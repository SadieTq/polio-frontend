import React from 'react';
import { Link } from 'react-router-dom'; 

function Sidebar() {
  const role = localStorage.getItem('role'); // Get role from localStorage

  return (
    <div className="sidebar">
      <div className="logo">Polio</div>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard/stats">Dashboard</Link>
          </li>

          {role === 'ADMIN' && (
            <li>
              <Link to="/dashboard/campaign">Campaign</Link>
            </li>
          )}
          
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
