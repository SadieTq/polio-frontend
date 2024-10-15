import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HeaderBar from './components/HeaderBar';
import TabPanel from './components/TabPanel';
import Sidebar from './components/sidebar';
import LoginPage from './components/LoginPage';
import SurveyorManagement from './components/Management/SurveyorManagement';
import TeamAssignment from './components/Management/TeamAssignment';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard/*" element={
          <PrivateRoute>
            <div className="app-container">
              <Sidebar />
              <div className="main-content">
                <HeaderBar />
                <Routes>                  
                  <Route path="flw" element={<SurveyorManagement />} />
                  <Route path="team" element={<TeamAssignment />} />
                  <Route path="/" element={<TabPanel />} /> {/* Default dashboard content */}
                </Routes>
              </div>
            </div>
          </PrivateRoute>
        }/>
      </Routes>
    </Router>
  );
}

export default App;
