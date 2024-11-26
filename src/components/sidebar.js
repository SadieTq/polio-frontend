import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { AppstoreOutlined, UserOutlined, TeamOutlined, LineChartOutlined, RocketOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import img1 from '../assets/images/img1.png'; // Adjust path as needed

const { Sider } = Layout;

function Sidebar() {
  return (
    <Sider
      style={{
        height: '100vh',
        background: '#1e1f28',
      }}
      breakpoint="lg"
      collapsedWidth="80"
    >
      {/* Logo */}
      <div className="logo" style={{ padding: '10px', textAlign: 'center' }}>
        <img
          src={img1}
          alt="Logo"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      {/* Navigation */}
      <Menu
        theme="dark"
        mode="inline"
        style={{ background: '#1e1f28' }}
        defaultSelectedKeys={['1']}
      >
        <Menu.Item
          key="1"
          icon={<LineChartOutlined />}
          style={{ marginBottom: '10px' }}
        >
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item
          key="2"
          icon={<AppstoreOutlined />}
          style={{ marginBottom: '10px' }}
        >
          <Link to="/dashboard/dashtemp">Dashboard Temp</Link>
        </Menu.Item>
        <Menu.Item
          key="3"
          icon={<RocketOutlined />}
          style={{ marginBottom: '10px' }}
        >
          <Link to="/dashboard/campaign">Campaign</Link>
        </Menu.Item>
        <Menu.Item
          key="4"
          icon={ <TeamOutlined />}
          style={{ marginBottom: '10px' }}
        >
          <Link to="/dashboard/user">User Management</Link>
        </Menu.Item>
        <Menu.Item
          key="5"
          icon={<UserOutlined />}
          style={{ marginBottom: '10px' }}
        >
          <Link to="/dashboard/flw">FLW Management</Link>
        </Menu.Item>
        <Menu.Item
          key="6"
          icon={<UsergroupAddOutlined />}
          style={{ marginBottom: '10px' }}
        >
          <Link to="/dashboard/team">Team Assignment</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default Sidebar;


// function Sidebar() {
//   return (
//     <div className="sidebar">
//       <div className="logo">
//         <img src={img1} alt="Logo" className="logo-image" />
//       </div>
//       <nav>
//         <ul>
//           <li>
//             <Link to="/dashboard">Dashboard</Link>
//           </li>
//           <li>
//             <Link to="/dashboard/dashtemp">Dashboard Temp</Link>
//           </li>
//           <li>
//             <Link to="/dashboard/campaign">Campaign</Link>
//           </li>
//           <li>
//             <Link to="/dashboard/user">User Management</Link>
//           </li>
//           <li>
//             <Link to="/dashboard/flw">FLW Management</Link>
//           </li>
//           <li>
//             <Link to="/dashboard/team">Team Assignment</Link>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// }

// export default Sidebar;
