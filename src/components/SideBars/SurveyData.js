import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';

const SurveyData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    fetch('http://110.38.226.9:4000/api/survey')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const cardTextStyle = {
    fontSize: '14px', // Reducing font size for more compact text
    lineHeight: '1.2', // Reducing line height for closer line spacing
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Survey Data</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {/* Vaccination Data Card */}
        <Card
          title="Vaccination Data"
          extra={<Button type="primary">Details</Button>}
          style={{ flex: '1 1 calc(33.333% - 16px)' }}
          bordered
        >
          <p style={cardTextStyle}><span style={{ color: '#0088FE', fontWeight: 'bold', fontSize: '18px' }}>●</span> Total Vaccinated Coverage: <strong>{data ? data.total : 'Loading...'}</strong></p>
          <p style={cardTextStyle}><span style={{ color: '#00C49F', fontWeight: 'bold', fontSize: '18px' }}>●</span> Total AFP cases: <strong>{data ? data['Total AFP Case'] : 'Loading...'}</strong></p>
          <p style={cardTextStyle}><span style={{ color: '#FFBB28', fontWeight: 'bold', fontSize: '18px' }}>●</span> Zero Dose count: <strong>{data ? data['Total Zero Dose Count'] : 'Loading...'}</strong></p>
          <p style={cardTextStyle}><span style={{ color: '#FF8042', fontWeight: 'bold', fontSize: '18px' }}>●</span> Newborn Count: <strong>{data ? data['Total Newborn Count'] : 'Loading...'}</strong></p>
        </Card>

        {/* Team Data Card */}
        <Card
          title="Team Data"
          extra={<Button type="primary">Details</Button>}
          style={{ flex: '1 1 calc(33.333% - 16px)' }}
          bordered
        >
          <p style={cardTextStyle}><span style={{ color: '#00C49F', fontWeight: 'bold', fontSize: '18px' }}>●</span> Team login before 8:30: <strong>{data ? data['before 8:30'] : 'Loading...'}</strong></p>
          <p style={cardTextStyle}><span style={{ color: '#FFBB28', fontWeight: 'bold', fontSize: '18px' }}>●</span> Team login after 8:30: <strong>{data ? data['after 8:30'] : 'Loading...'}</strong></p>
          <p style={cardTextStyle}><span style={{ color: '#FF8042', fontWeight: 'bold', fontSize: '18px' }}>●</span> Team revisited after 2pm: <strong>{data ? data.visitsAfter2PMCount : 'Loading...'}</strong></p>
        </Card>

        {/* Houses Data Card */}
        <Card
          title="Houses Data"
          extra={<Button type="primary">Details</Button>}
          style={{ flex: '1 1 calc(33.333% - 16px)' }}
          bordered
        >
          <p style={cardTextStyle}><span style={{ color: '#FFBB28', fontWeight: 'bold', fontSize: '18px' }}>●</span> Locked houses: <strong>{data ? data.uniqueLockedHouseCount : 'Loading...'}</strong></p>
          <p style={cardTextStyle}><span style={{ color: '#FF8042', fontWeight: 'bold', fontSize: '18px' }}>●</span> Revisited houses: <strong>{data ? data.revisitedHouseData : 'Loading...'}</strong></p>
        </Card>

        {/* Children Data Card */}
        <Card
          title="Children Data"
          extra={<Button type="primary">Details</Button>}
          style={{ flex: '1 1 calc(33.333% - 16px)' }}
          bordered
        >
          <p style={cardTextStyle}><span style={{ color: '#FF8042', fontWeight: 'bold', fontSize: '18px' }}>●</span> School children: <strong>{data ? data.school : 'Loading...'}</strong></p>
          <p style={cardTextStyle}><span style={{ color: '#AF19FF', fontWeight: 'bold', fontSize: '18px' }}>●</span> Street children: <strong>{data ? data.street : 'Loading...'}</strong></p>
          <p style={cardTextStyle}><span style={{ color: '#FFBB28', fontWeight: 'bold', fontSize: '18px' }}>●</span> Guest children: <strong>{data ? data.guestChild : 'Loading...'}</strong></p>
          <p style={cardTextStyle}><span style={{ color: '#00C49F', fontWeight: 'bold', fontSize: '18px' }}>●</span> Total children vaccinated in house: <strong>{data ? data.availableChild : 'Loading...'}</strong></p>
        </Card>

        {/* Refusals Data Card */}
        <Card
          title="Refusals Data"
          extra={<Button type="primary">Details</Button>}
          style={{ flex: '1 1 calc(33.333% - 16px)' }}
          bordered
        >
          <p style={cardTextStyle}><span style={{ color: '#AF19FF', fontWeight: 'bold', fontSize: '18px' }}>●</span> Total refusals: <strong>{data ? data.refusalStats.totalRefusalCount : 'Loading...'}</strong></p>
          <p style={cardTextStyle}><span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '18px' }}>●</span> Religious refusals: <strong>{data ? data.refusalStats.refusalReasons.religiousRefusal : 'Loading...'}</strong></p>
          <p style={cardTextStyle}><span style={{ color: '#32CD32', fontWeight: 'bold', fontSize: '18px' }}>●</span> Other refusals: <strong>{data ? data.refusalStats.refusalReasons.otherRefusal : 'Loading...'}</strong></p>
          <p style={cardTextStyle}><span style={{ color: '#6A5ACD', fontWeight: 'bold', fontSize: '18px' }}>●</span> Medical refusals: <strong>{data ? data.refusalStats.refusalReasons.medicalRefusal : 'Loading...'}</strong></p>
        </Card>

        {/* NA Data Card */}
        <Card
          title="NA Data"
          extra={<Button type="primary">Details</Button>}
          style={{ flex: '1 1 calc(33.333% - 16px)' }}
          bordered
        >
          <p style={cardTextStyle}><span style={{ color: '#AF19FF', fontWeight: 'bold', fontSize: '18px' }}>●</span> NA Children Same Day covered: <strong>{data ? data['covered NA Children same day'] : 'Loading...'}</strong></p>
          <p style={cardTextStyle}><span style={{ color: '#FF8042', fontWeight: 'bold', fontSize: '18px' }}>●</span> NA Children: <strong>{data ? data['uniqueNAChildrenCount'] : 'Loading...'}</strong></p>
          <p style={cardTextStyle}><span style={{ color: '#32CD32', fontWeight: 'bold', fontSize: '18px' }}>●</span> NA same day (visited): <strong>{data ? data['Na Housenot visted same day'] : 'Loading...'}</strong></p>
          <p style={cardTextStyle}><span style={{ color: '#6A5ACD', fontWeight: 'bold', fontSize: '18px' }}>●</span> NA same day (not visited): <strong>{data ? data['Na Housenot Not visted same day'] : 'Loading...'}</strong></p>
        </Card>
      </div>
    </div>
  );
};

export default SurveyData;
