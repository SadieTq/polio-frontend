import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HeaderBar from './components/HeaderBar';
import TabPanel from './components/TabPanel';
import Sidebar from './components/sidebar';
import LoginPage from './components/LoginPage';
import UserManagement from './components/Management/UserManagement';
import SurveyorManagement from './components/Management/SurveyorManagement';
import TerritoryAssignment from './components/Management/TerritoryAssignment';
import TeamAssignment from './components/Management/TeamAssignment';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard/*"
          element={
            <div className="app-container">
              <Sidebar />
              <div className="main-content">
                <HeaderBar />
                <Routes>
                  <Route path="user" element={<UserManagement />} />
                  <Route path="flw" element={<SurveyorManagement />} />
                  {/* <Route path="territory" element={<TerritoryAssignment />} /> */}
                  <Route path="team" element={<TeamAssignment />} />
                  <Route path="/" element={<TabPanel />} /> {/* Default dashboard content */}
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;