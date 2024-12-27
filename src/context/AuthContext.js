import { createContext, useState, useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { jwtDecode } from 'jwt-decode';
import serverUrl from '../config/config';
export const AuthContext = createContext();

const msalConfig = {
  auth: {
    clientId: `963c2692-7b64-40e0-b801-fb78b40195a7`, // Azure AD Client ID
    authority: `https://login.microsoftonline.com/62832060-5348-4b09-bf36-98a2b5d0364d`, // Tenant ID
    // redirectUri: 'http://localhost:3000' // Your redirect URI
    redirectUri: 'https://pulse-pixel.vercel.app'
  }
};
const msalInstance = new PublicClientApplication(msalConfig);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authInProgress, setAuthInProgress] = useState(false);
  const [msalInitialized, setMsalInitialized] = useState(false);

  useEffect(() => {
    const initializeMSAL = async () => {
      try {
        await msalInstance.initialize();
        setMsalInitialized(true);
  
        // Check for existing MSAL session
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          setUser(accounts[0]); // Restore MSAL session
          console.log('Restored MSAL session:', accounts);
        } else {
          // Check localStorage for token
          const token = localStorage.getItem('token');
          if (token && !isTokenExpired(token)) {
            setUser(jwtDecode(token)); // Restore user session from token
          }
        }
      } catch (error) {
        console.error('Error initializing MSAL:', error);
      }
    };
  
    const restoreUserSession = () => {
      const token = localStorage.getItem('token');
      if (token && !isTokenExpired(token)) {
        setUser(jwtDecode(token)); // Restore session from token if valid
        console.log('Session restored from JWT token');
      } else {
        console.log('No valid token found or token expired');
        setUser(null); // Clear user if no valid token
      }
    };

    initializeMSAL();
    restoreUserSession(); 
  
    const intervalId = setInterval(checkTokenExpiration, 60000); // Check every minute for token expiration
    return () => clearInterval(intervalId);
  }, []);
  
  

  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  };

  const checkTokenExpiration = async () => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      await logout(true); // Pass true to indicate this is an automatic logout due to token expiration
    }
  };
  

  const loginWithEmail = (token) => {
    if (!isTokenExpired(token)) {
      localStorage.setItem('token', token);
      setUser(jwtDecode(token));
    } else {
      logout();
    }
  };
  const loginWithMicrosoft = async () => {
    if (authInProgress || !msalInitialized) {
      console.warn('Login in progress or MSAL not initialized');
      return;
    }

    setAuthInProgress(true);
    try {
      console.log('Initiating Microsoft login...');

      // Log in using Microsoft
      const loginResponse = await msalInstance.loginPopup({
        scopes: ['user.read']
      });
      setUser(loginResponse.account);
      console.log('Microsoft login successful:', loginResponse);

      // Acquire access token
      const tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: ['user.read'],
        account: loginResponse.account
      });

      // Send the email to your backend to generate your JWT
      console.log('login token:', loginResponse);
      console.log('Acquired token:', loginResponse.account.username);

      const email = loginResponse.account.username;

      const res = await fetch(`${serverUrl.apiUrl}api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password: null }) // No password needed for Microsoft login
      });

      const data = await res.json();
      if (res.ok) {
        const token = data.token; // Get the JWT from the response
        if (!isTokenExpired(token)) {
          localStorage.setItem('token', token);
          setUser(jwtDecode(token));
        } else {
          logout();
        }
        console.log(jwtDecode(token));
        console.log('JWT stored:', token);
      } else {
        console.error('Error logging in with Microsoft:', data.message);
      }
    } catch (error) {
      if (error.errorCode === 'interaction_in_progress') {
        console.warn('Interaction already in progress');
      } else {
        console.error('Microsoft login failed:', error);
      }
    } finally {
      setAuthInProgress(false);
    }
  };

  const logout = (isTokenExpiredLogout = false) => {
    localStorage.removeItem('token');
    
    console.log('Logging out...', isTokenExpiredLogout);
  
    // Only call msalInstance.logoutPopup() if this is a manual logout, not token expiration
    if (!isTokenExpiredLogout) {
      console.log('Triggering msalInstance.logoutPopup() for manual logout...');
      
      msalInstance.logoutPopup()
        .then(() => {
          console.log('Logout popup was shown successfully.');
        })
        .catch((error) => {
          console.error('Error during logoutPopup:', error);
        });
    }
    
    // setAuthInProgress(false);
    setUser(null);
  };
  
  

  return <AuthContext.Provider value={{ user, loginWithEmail, loginWithMicrosoft, logout }}>{children}</AuthContext.Provider>;
};
