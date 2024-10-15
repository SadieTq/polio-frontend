import React, { useState } from 'react';
import { Tabs } from 'antd';
import SingleSurveyor from './forms/Surveyor/SingleSurveyor'
import AddDistrictManager from './forms/AddDistrictManager';

const { TabPane } = Tabs;

function TabPanelSurveyor() {
  const [activeKey, setActiveKey] = useState("1");

  return (
    <div className="tab-panel">
      <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
        <TabPane tab="Add FLW" key="1">
        <AddDistrictManager />
        </TabPane>
       
      </Tabs>
    </div>
  );
}

export default TabPanelSurveyor;
