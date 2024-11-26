import React, { useState, useEffect } from 'react';
import { Tabs, Modal } from 'antd';
import AddAdmin from './forms/AddAdmin';
import AddUCMO from './forms/AddUCMO';
import AddAIC from './forms/AddAIC';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

function TabPanel() {
  const [activeKey, setActiveKey] = useState(null); // Initialize as null
  const [role, setRole] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);

    // Set the default active tab based on role
    if (userRole === 'ADMIN') {
      setActiveKey("1");
    } else if (userRole === 'UCMO') {
      setActiveKey("2");
    } else if (userRole === 'AIC') {
      setActiveKey("3");
    } else if (userRole === 'FLW') {
      setIsModalVisible(true); // Show modal if user is not authorized
    }
  }, [navigate]);

  const handleModalOk = () => {
  navigate('/');
  setIsModalVisible(false);
    
  };

  return (
    <div className="tab-panel1">
      {/* Modal to show unauthorized message */}
      <Modal
        title="Unauthorized"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
      >
        <p>Sorry, you are not authorized</p>
      </Modal>

      <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
        {role === 'ADMIN' && (
          <>
            <TabPane tab="Add Admin" key="1">
              <AddAdmin />
            </TabPane>
            <TabPane tab="Add UCMO" key="2">
              <AddUCMO />
            </TabPane>
            <TabPane tab="Add AIC" key="3">
              <AddAIC />
            </TabPane>
          </>
        )}
        {role === 'UCMO' && (
          <>
            <TabPane tab="Add UCMO" key="2">
              <AddUCMO />
            </TabPane>
            <TabPane tab="Add AIC" key="3">
              <AddAIC />
            </TabPane>
          </>
        )}
        {role === 'AIC' && (
          <TabPane tab="Add AIC" key="3">
            <AddAIC />
          </TabPane>
        )}
      </Tabs>
    </div>
  );
}

export default TabPanel;




