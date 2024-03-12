import axios from "axios";
import { useEffect, useState } from "react";
import './AdminPage.css'
function AdminPage(){

    const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [memoryUpdates, setMemoryUpdates] = useState({}); 

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/account/getAccounts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(response.data);
      const initialMemoryUpdates = response.data.reduce((acc, { account }) => {
        acc[account.id] = null; 
        return acc;
      }, {});
      setMemoryUpdates(initialMemoryUpdates);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemoryChange = (username, newTotalMemory) => {
    setMemoryUpdates(prev => ({ ...prev, [username]: newTotalMemory }));
  };

  const confirmMemoryUpdate = async (username) => {
    console.log("Username to update:", username);
    const newTotalMemory = memoryUpdates[username];
    console.log("New total memory:", newTotalMemory);
    if (newTotalMemory == null) return; 
  
    try {
      const token = localStorage.getItem('token');
      console.log("Token:", token);
  
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('newTotalMemory', newTotalMemory);
  
      await axios.post('http://localhost:8080/api/manage/updateTotalMemory', params, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      });
      console.log("Update successful");
      fetchAccounts(); 
    } catch (error) {
      console.error('Failed to update total memory:', error);
    }
  };

  if (isLoading) {
    return <div>Loading accounts...</div>;
  }

  return (
    <div className="admin-container">
      <h2 className="admin-heading">Accounts List</h2>
      {accounts.length > 0 ? (
        <ul className="account-list">
          {accounts.map(({ account, accountManager }) => (
            <li key={account.id} className="account-item">
              <div>
                <p className="account-detail">Username: {account.username}</p>
                <p className="account-detail">Email: {account.email}</p>
                <p className="account-detail">Root Directory: {accountManager.rootdir}</p>
                <p className="account-detail">Used Memory: {accountManager.usedMemory.toFixed(2)} MB</p>
                <div className="memory-controls">
                  <p className="account-detail">Total Memory:</p>
                  <input
                    type="number"
                    className="memory-input"
                    defaultValue={accountManager.totalMemory}
                    min={accountManager.usedMemory}
                    onBlur={(e) => handleMemoryChange(account.username, e.target.value)} 
                    />
                  <p>MB</p>
                  <button className="memory-button" onClick={() => confirmMemoryUpdate(account.username)}>Confirm Changes</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No accounts found.</p>
      )}
    </div>
  );
}


export default AdminPage;