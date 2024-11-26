// src/App.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, Alert } from 'antd'; 
import img1 from '../assets/images/img1.png'; 
import { baseURL } from "../apiConfig"

const LoginPage = () => {
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("cnic");
    localStorage.removeItem("name");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show the spinner
    setError(null); // Clear any previous error message

    // API request body
    const requestBody = {
      cnic: cnic,
      password: password,
    };

    try {
      // Making the POST request
      const response = await fetch(`${baseURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok && data.token && data.user && data.user.role) { // Check for token and user role
        if (data.user.role === "FLW") {
          setError("Access Denied to FLW");
          setLoading(false);
          return;
        }
        localStorage.setItem('token', data.token); // Store the token
        localStorage.setItem('role', data.user.role);   // Store the user role
        localStorage.setItem('id', data.user.id);   // Store the user id
        localStorage.setItem('name', data.user.firstName); 
        localStorage.setItem('cnic', data.user.cnic); 
        navigate('/dashboard');
      } else {
        console.error('Login failed:', data);
        setError('Login failed, please check your CNIC and password.'); // Set the error message
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again later.'); // Set the error message
    } finally {
      setLoading(false); // Hide the spinner after the request is completed
    }
  };

  return (
    <div className="containerLogin">
      {loading && (
        <div className="spinner-container">
          <Spin size="large" /> 
        </div>
      )}
      {!loading && ( /* Only show the form when not loading */
        <div className="wrapperLogin">
          <div className="leftLogin">
            
            <h1 className="titleLogin">Welcome!</h1>
            <p>Enter your CNIC and password to sign in</p>

            {error && (
              <Alert
                message="Error"
                description={error} // Display the error message
                type="error"
                showIcon
                style={{ marginBottom: '20px' }}
              />
            )}

            <form className="formLogin" onSubmit={handleSubmit}>
              <input
                type="text"
                className="inputLogin"
                placeholder="Enter your CNIC"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
              />
              <input
                type="password"
                className="inputLogin"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="buttonLogin">Sign in</button>
            </form>
          </div>
          <div className="rightLogin">
          
        <img src={img1} alt="logo1" className="logo-image1" />
      
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
