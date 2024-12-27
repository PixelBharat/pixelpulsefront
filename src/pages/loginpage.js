import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/favicon.png';
import serverUrl from '../config/config';
import msLogo from "../assets/ms-logo.png"
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { loginWithEmail, loginWithMicrosoft, authInProgress } = useContext(AuthContext);
  // const [authInProgress, setAuthInProgress] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${serverUrl.apiUrl}api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        loginWithEmail(data.token);
        navigate('/attendance');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleMicrosoftLogin = async () => {
    const trulogin = await loginWithMicrosoft();
    console.log(trulogin);
    navigate('/attendance'); // Redirect after successful Microsoft login
  };

  return (
    <div className="login-container">
      <div className="background-image"></div>
      <div className="login-form">
        <img src={logo} alt="Pixel Bharat" className="logo" />
        {/* <h2>
      <span className="brand-name">Pixel Pulse</span>
        </h2> */}
        <p className="signin">Sign in to Pixel Pulse</p>

        {/* Email/Password Login */}
        <div className="form-div">
        <form  onSubmit={handleEmailLogin}>
          <div className="input-group">
            <input type="text" placeholder="Enter Username" onChange={(e) => setEmail(e.target.value)} required className="text-input" />
          </div>
          <div className="input-group">
            <input type={isPasswordVisible ? 'text' : 'password'} placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="text-input" />
            <i className={`bi ${isPasswordVisible ? 'bi-eye-slash-fill' : 'bi-eye-fill'} password-toggle`} onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}></i>
          </div>
          {/* <div className="remember-me">
            <label className="custom-checkbox">
              <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
              <span className="checkmark"></span>
            </label>
            <label className="remeber" htmlFor="remember">
              Remember Me
            </label>
          </div> */}
          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

          {/* Microsoft Sign-In */}
        <div className="social-login">
          <button onClick={handleMicrosoftLogin} disabled={authInProgress} className="login-ms-btn">
            <img src={msLogo} alt="Microsoft Logo" className="ms-logo" />
            {authInProgress ? 'Logging in...' : 'Sign in with Microsoft'}
          </button>
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default LoginPage;
