import React from 'react';
import { useNavigate } from 'react-router-dom';

function HeaderBar() {
  const navigate = useNavigate();

  const handleLogout = () => {

    navigate('/');
  };

  return (
    <div className="header-bar">
      <p className="logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
        Logout
      </p>
    </div>
  );
}

export default HeaderBar;
