import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPowerSharp } from "react-icons/io5";
import { Tooltip } from 'antd';

function HeaderBar() {
  const navigate = useNavigate();
  const userID = localStorage.getItem("id"); // Get the user ID from localStorage

  const handleLogout = async () => {
    try {
      // API call to logout using fetch
      const response = await fetch('https://survey.al-mizan.store/api/auth/logout', {
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
      <p className="logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
        <Tooltip title="Sign Out">
          <IoPowerSharp size={25} style={{ marginRight: '20px' }} />
        </Tooltip>
      </p>
    </div>
  );
}

export default HeaderBar;
