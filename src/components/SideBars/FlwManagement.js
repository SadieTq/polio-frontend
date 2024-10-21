import React, { useState } from 'react';
import { Tabs } from 'antd';
import AddFLW from '../forms/AddFLW';

const { TabPane } = Tabs;

function FlwManagement() {
  const [activeKey, setActiveKey] = useState("1");
  return (
    <div className="tab-panel">
    <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
      <TabPane tab="Add FLW" key="1">
      <AddFLW />
      </TabPane>
     
    </Tabs>
  </div>
  );
}

export default FlwManagement;