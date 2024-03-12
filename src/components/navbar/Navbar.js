
import React from "react";
import "./Navbar.css"; 
import { useAuth } from '../../AuthContext'; 
import RoundButton from "../roundbutton/Roundbutton";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const { isAuthenticated, username, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="logo-container">
                    <svg id="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud" viewBox="0 0 16 16">
                        <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
                    </svg>
                    <a href="/" id="link">
                        <p id="logo">minicloud</p>
                    </a>
                </div>
            
                <ul className="nav-menu">


              {isAuthenticated ? (
                <>
                  <RoundButton onClick={() => navigate('/account')} iconName="account" />
                  <RoundButton onClick={logout} iconName="logout" />
                  <RoundButton onClick={() => navigate('/cloud')} iconName="cloud" />
                </>
              ) : (
                <>
                  <RoundButton onClick={() => navigate('/signup')} iconName="signup" />
                  <RoundButton onClick={() => navigate('/login')} iconName="login" />
                  <RoundButton onClick={() => navigate('/adminauth')} iconName="key" />
                  <RoundButton onClick={() => navigate('/')} iconName="home" />
                </>
              )}
            </ul>
          </div>
        </nav>
      );
    };
  

export default Navbar;
