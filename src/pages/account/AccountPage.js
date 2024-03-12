
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AccountPage.css'

function AccountPage(){
    const [accountData, setAccountData] = useState(null);

    useEffect(() => {
        const fetchAccountData = async () => {
            const token = localStorage.getItem('token'); 
            if (!token) {
                console.log('No JWT token found. Please log in.');
                return;
            }
            
            try {
                const response = await axios.get('http://localhost:8080/api/manage/getaccount', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                setAccountData(response.data);
            } catch (error) {
                console.error('Error fetching account data:', error);
            }
        };

        fetchAccountData();
    }, []);

    const calculateMemoryUsage = () => {
        if (accountData) {
            const { usedMemory, totalMemory } = accountData;
            const usage = (usedMemory / totalMemory) * 100;
            return usage.toFixed(2); 
        }
        return 0;
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (confirmDelete) {
            const token = localStorage.getItem('token');
            try {
                await axios.delete('http://localhost:8080/api/account/delete', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log("Account deleted successfully.");
                localStorage.removeItem('token');
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('Error deleting account. Please try again.');
            }
        }
    };

    return (
        <div className="container">
            <h2 className="heading">Account Information</h2>
            {accountData ? (
                <div>
                    <div className="formGroup">
                        <label className="label">Username:</label>
                        <p className="input">{accountData.account.username}</p>
                    </div>
                    <div className="formGroup">
                        <label className="label">Used Memory:</label>
                        <p className="input">{calculateMemoryUsage(accountData.usedMemory)} MB</p>
                    </div>
                    <div className="formGroup">
                        <label className="label">Total Memory:</label>
                        <p className="input">{accountData.totalMemory} MB</p>
                    </div>
                    <button className="button" onClick={handleDeleteAccount}>Delete Account</button>
                </div>
            ) : (
                <p>Loading account information...</p>
            )}
        </div>
    );
}
export default AccountPage;