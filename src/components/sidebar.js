import React from 'react';
import { Link } from 'react-router-dom'; 

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">Polio</div>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard">User Management</Link>
          </li>
          <li>
            <Link to="/dashboard">Surveyor Management</Link>
          </li>
          <li>
            <Link to="/dashboard">Territory Assignment</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
