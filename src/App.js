import './App.css';
import SignUpPage from './pages/signup/Signup';
import Navbar from './components/navbar/Navbar';
import LoginPage from './pages/login/Login';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import HomePage from './pages/home/HomePage';
import CloudPage from './pages/cloud/CloudPage';
import AccountPage from './pages/account/AccountPage';
import AdminPage from './pages/admin/AdminPage';
import AdminAuth from './pages/admin/AdminAuth';
function App() {
  return (
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/cloud" element={<CloudPage />} /> 
          <Route path="/account" element={<AccountPage />} /> 
          <Route path="/admin" element={<AdminPage />} /> 
          <Route path="/adminauth" element={<AdminAuth />} /> 
        </Routes>
      </>
      

    
  );
}

export default App;
