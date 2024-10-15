import React, { useState } from 'react';
import { Tabs } from 'antd';
import AddSuperAdmin from './forms/AddSuperAdmin';
import AddAdmin from './forms/AddAdmin';
import AddDivisionalManager from './forms/AddDivisionalManager';

const { TabPane } = Tabs;

function TabPanel() {
  const [activeKey, setActiveKey] = useState("1");

  return (
    <div className="tab-panel">
      <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
        <TabPane tab="Add Admin" key="1">
          <AddSuperAdmin />
        </TabPane>
        <TabPane tab="Add UCMO" key="2">
          <AddAdmin />
        </TabPane>
        <TabPane tab="Add AIC" key="3">
          <AddDivisionalManager />
        </TabPane>
       
      </Tabs>
    </div>
  );
}

export default TabPanel;
