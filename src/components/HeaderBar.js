import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPowerSharp } from "react-icons/io5";
import { Tooltip } from 'antd';

function HeaderBar() {
  const navigate = useNavigate();

  const handleLogout = () => {

    navigate('/');
  };

  return (
    <div className="header-bar">
      <p className="logout" onClick={handleLogout} style={{ cursor: 'pointer' }}>
      <Tooltip title="Sign Out"><IoPowerSharp size={25} style={{ marginRight: '20px' }}/></Tooltip>
      </p>
    </div>
  );
}

export default HeaderBar;
