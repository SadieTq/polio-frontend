import React from 'react';
import { Link } from 'react-router-dom';
import img1 from '../assets/images/img1.png';  // Adjust path as needed

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src={img1} alt="Logo" className="logo-image" />
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard/stats">Dashboard</Link>
          </li>
          <li>
            <Link to="/dashboard/campaign">Campaign</Link>
          </li>
          <li>
            <Link to="/dashboard">User Management</Link>
          </li>
          <li>
            <Link to="/dashboard/flw">FLW Management</Link>
          </li>
          <li>
            <Link to="/dashboard/team">Team Assignment</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
