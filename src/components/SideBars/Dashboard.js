import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Spin, Divider, Row, Col, Card } from 'antd';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6347', '#32CD32', '#6A5ACD', '#FFD700'];

function Dashboard() {
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch survey data
  const fetchSurveyData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://110.38.226.9:4000/api/survey/');
      const data = await response.json();
      setSurveyData(data);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyData();
  }, []);

  // Define data for each chart category
  const vaccinationData = surveyData ? [
    { name: 'Total Vaccinated Coverage Today', value: surveyData.total },
    { name: 'Total AFP Cases', value: surveyData['Total AFP Case'] },
    { name: 'Zero Dose Count', value: surveyData['Total Zero Dose Count'] }
  ] : [];

  const teamData = surveyData ? [
    { name: 'Team Login Before 8:30', value: surveyData['before 8:30'] },
    { name: 'Team Login After 8:30', value: surveyData['after 8:30'] },
    { name: 'Team Revisited After 2pm', value: surveyData.visitsAfter2PMCount }
  ] : [];

  const housesData = surveyData ? [
    { name: 'Locked Houses', value: surveyData.uniqueLockedHouseCount },
    { name: 'NA Visited Same Day', value: surveyData['Na Housenot visted same day'] },
    { name: 'NA Not Visited Same Day', value: surveyData['Na Housenot Not visted same day'] },
    { name: 'Revisited Houses', value: surveyData.revisitedHouseData }
  ] : [];

  const childrenData = surveyData ? [
    // { name: 'Children', value: surveyData.uniqueNAChildrenCount },
    { name: 'School Children', value: surveyData.school },
    { name: 'Street Children', value: surveyData.street },
    { name: 'Guest Children', value: surveyData.guestChild },
    { name: 'Total Children Vaccinated In House', value: surveyData.availableChild },
    // { name: 'NA Children Same Day', value: surveyData['covered NA Children same day'] },
    // { name: 'Newborn Count', value: surveyData['Total Newborn Count'] }
  ] : [];

  const refusalsData = surveyData ? [
    { name: 'Total Refusals', value: surveyData.refusalStats.totalRefusalCount },
    { name: 'Religious Refusals', value: surveyData.refusalStats.refusalReasons.religiousRefusal },
    { name: 'Other Refusals', value: surveyData.refusalStats.refusalReasons.otherRefusal }
  ] : [];

  // Render individual pie charts with color-coded legend and values
  const renderPieChartWithLegend = (data, colorIndex) => (
    <Row align="middle">
      <Col span={6}>
        <div style={{ padding: '10px' }}>
          {data.map((entry, index) => (
            <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: COLORS[(colorIndex + index) % COLORS.length],
                  marginRight: '8px',
                  borderRadius: '50%'
                }}
              />
              <span>{entry.name}: <strong>{entry.value}</strong></span>
            </div>
          ))}
        </div>
      </Col>
      <Col span={18}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill={COLORS[colorIndex % COLORS.length]}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[(colorIndex + index) % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Col>
    </Row>
  );

  // Render individual data cards with color-coded legend and values
  const renderDataCard = (title, data, colorIndex) => (
    <Card title={title} bordered={true} style={{ marginBottom: '16px' }}>
      {data.map((entry, index) => (
        <div key={`card-item-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <div
            style={{
              width: '16px',
              height: '16px',
              backgroundColor: COLORS[(colorIndex + index) % COLORS.length],
              marginRight: '8px',
              borderRadius: '50%'
            }}
          />
          <span>{entry.name}: <strong>{entry.value}</strong></span>
        </div>
      ))}
    </Card>
  );

  return (
    <div className="tab-panel">
      <div className="form-container">
        <h2 >Survey Data</h2>

        {loading ? (
          <Spin tip="Loading data..." />
        ) : (
          <>
            {/* Render Pie Charts */}
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <h3>Vaccination Data</h3>
                {renderPieChartWithLegend(vaccinationData, 0)}
              </Col>
              <Col span={12}>
                <h3>Team Data</h3>
                {renderPieChartWithLegend(teamData, 1)}
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <h3>Houses Data</h3>
                {renderPieChartWithLegend(housesData, 2)}
              </Col>
              <Col span={12}>
                <h3>Children Data</h3>
                {renderPieChartWithLegend(childrenData, 3)}
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <h3>Refusals Data</h3>
                {renderPieChartWithLegend(refusalsData, 4)}
              </Col>
            </Row>

          

          
           
          </>
        )}
      </div>
      <Divider style={{ marginTop: '50px', marginBottom: '50px' }} />


      <div className="form-container">
      <h2 >Overall View</h2>
      <Row gutter={[16, 16]}>
              <Col span={12}>{renderDataCard("Vaccination Data", vaccinationData, 0)}</Col>
              <Col span={12}>{renderDataCard("Team Data", teamData, 1)}</Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>{renderDataCard("Houses Data", housesData, 2)}</Col>
              <Col span={12}>{renderDataCard("Children Data", childrenData, 3)}</Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>{renderDataCard("Refusals Data", refusalsData, 4)}</Col>
            </Row>

</div>
    </div>
  );
}

export default Dashboard;
