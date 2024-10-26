import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPowerSharp } from "react-icons/io5";
import { Tooltip } from 'antd';

function HeaderBar() {
  const navigate = useNavigate();
  const userID = localStorage.getItem("id"); // Get the user ID from localStorage
  const name = localStorage.getItem("name");
  const cnic = localStorage.getItem("cnic");

  const handleLogout = async () => {
    try {
      // API call to logout using fetch
      const response = await fetch('http://110.38.226.9:4000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: userID }) // Send user ID in the payload
      });

      if (response.ok) {
        // If successful, clear localStorage or session as needed
        localStorage.removeItem("id");
        localStorage.removeItem("role");
        localStorage.removeItem("token");
        localStorage.removeItem("cnic");
        localStorage.removeItem("name");
        // Navigate to the home page
        navigate('/');
      } else {
        console.error("Failed to log out:", response.statusText);
      }
    } catch (error) {
      console.error("Error occurred during logout:", error);
    }
  };

  return (
    <div className="header-bar">
    <div className="welcome-and-logout">
      <span className="welcome-message">Welcome, {name}! CNIC: {cnic}</span>
      <p className="logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
        <Tooltip title="Sign Out">
          <IoPowerSharp size={25} style={{ marginLeft: '10px' }} />
        </Tooltip>
      </p>
    </div>
  </div>
  );
}

export default HeaderBar;
