import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, PieChart, Pie, Cell } from 'recharts';
import { Spin, Divider, Row, Col } from 'antd';

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

  // Prepare data for Bar and Pie Charts
  const chartData = surveyData ? [
    { name: 'Total Vaccinated', value: surveyData.total },
    { name: 'Team Login Before 8:30', value: surveyData['before 8:30'] },
    { name: 'Team Login After 8:30', value: surveyData['after 8:30'] },
    { name: 'Locked Houses', value: surveyData.uniqueLockedHouseCount },
    { name: 'Team Revisited After 2pm', value: surveyData.visitsAfter2PMCount },
    { name: 'NA Children', value: surveyData.uniqueNAChildrenCount },
    { name: 'Revisited Houses', value: surveyData.revisitedHouseData },
    { name: 'School Children', value: surveyData.school },
    { name: 'Street Children', value: surveyData.street },
    { name: 'Guest Children', value: surveyData.guestChild },
    { name: 'Available Children', value: surveyData.availableChild },
    { name: 'Total Refusals', value: surveyData.refusalStats.totalRefusalCount },
    { name: 'Religious Refusals', value: surveyData.refusalStats.refusalReasons.religiousRefusal },
    { name: 'Other Refusals', value: surveyData.refusalStats.refusalReasons.otherRefusal },
    { name: 'NA Visited Same Day', value: surveyData['Na Housenot visted same day'] },
    { name: 'NA Not Visited Same Day', value: surveyData['Na Housenot Not visted same day'] },
    { name: 'NA Children Covered Same Day', value: surveyData['covered NA Children same day'] },
    { name: 'Total AFP Cases', value: surveyData['Total AFP Case'] },
    { name: 'Zero Dose Count', value: surveyData['Total Zero Dose Count'] },
    { name: 'Newborn Count', value: surveyData['Total Newborn Count'] }
  ] : [];

  // Split the data into two parts for two pie charts
  const pieData1 = chartData.slice(0, 10); // First 10 items for Pie Chart 1
  const pieData2 = chartData.slice(10, 20); // Next 10 items for Pie Chart 2

  return (
    <>
      <div className="tab-panel">
        
<div className="form-container">
          <h2 style={{ marginLeft: 10 }}>Team Data: Pie Charts</h2>

          <Row gutter={[16, 16]}>
            {/* Color-coded labels for Pie Chart 1 */}
            <Col span={4}>
              <div style={{ padding: '10px' }}>
                {pieData1.map((entry, index) => (
                  <div key={`item1-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: COLORS[index % COLORS.length],
                        marginRight: '10px'
                      }}
                    />
                    <span >{entry.name}: <span style={{ fontWeight: 'bold' }}>{entry.value}</span></span>
                  </div>
                ))}
              </div>
            </Col>

            {/* Pie Chart 1 */}
            <Col span={8}>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData1}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#0F52BA"
                    label
                  >
                    {pieData1.map((entry, index) => (
                      <Cell key={`cell1-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Col>

            {/* Color-coded labels for Pie Chart 2 */}
            <Col span={4}>
              <div style={{ padding: '10px' }}>
                {pieData2.map((entry, index) => (
                  <div key={`item2-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: COLORS[index % COLORS.length],
                        marginRight: '10px'
                      }}
                    />
                    <span>{entry.name}: <span style={{ fontWeight: 'bold' }}>{entry.value}</span></span>
                  </div>
                ))}
              </div>
            </Col>

            {/* Pie Chart 2 */}
            <Col span={8}>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData2}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#FF8042"
                    label
                  >
                    {pieData2.map((entry, index) => (
                      <Cell key={`cell2-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Col>
          </Row>
        </div>
        <Divider style={{ marginTop: '40px', marginBottom: '40px' }} />

        

<div className="form-container">
          <Spin spinning={loading}>
            <h2 style={{ marginLeft: 10 }}>Team Data: Bar Graph</h2>
            <ResponsiveContainer width="100%" height={1200}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#0F52BA">
                  <LabelList dataKey="value" position="right" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Spin>
        </div>


      </div>
    </>
  );
}

export default Dashboard;
