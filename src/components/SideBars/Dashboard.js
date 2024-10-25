import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Spin, Divider, Row, Col, Card, Button } from "antd";
import SurveyData from "../SideBars/SurveyData";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF6347",
  "#32CD32",
  "#6A5ACD",
  "#FFD700",
];

function Dashboard() {
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch survey data
  const fetchSurveyData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://110.38.226.9:4000/api/survey/");
      const data = await response.json();
      setSurveyData(data);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyData();
  }, []);

  // Define data for each chart category
  const vaccinationData = surveyData
    ? [
        { name: "Total Vaccinated Coverage", value: surveyData.total },
        { name: "Total AFP cases", value: surveyData["Total AFP Case"] },
        { name: "Zero Dose count", value: surveyData["Total Zero Dose Count"] },
        { name: "Newborn Count", value: surveyData["Total Newborn Count"] },
      ]
    : [];

  const teamData = surveyData
    ? [
        { name: "Team login before 8:30", value: surveyData["before 8:30"] },
        { name: "Team login after 8:30", value: surveyData["after 8:30"] },
        {
          name: "Team revisited after 2pm",
          value: surveyData.visitsAfter2PMCount,
        },
      ]
    : [];

  const housesData = surveyData
    ? [
        { name: "Locked houses", value: surveyData.uniqueLockedHouseCount },

        { name: "Revisited houses", value: surveyData.revisitedHouseData },
      ]
    : [];

  const childrenData = surveyData
    ? [
        { name: "School children", value: surveyData.school },
        { name: "Street children", value: surveyData.street },
        { name: "Guest children", value: surveyData.guestChild },
        {
          name: "Total children vaccinated in house",
          value: surveyData.availableChild,
        },
      ]
    : [];

  const refusalsData = surveyData
    ? [
        {
          name: "Total refusals",
          value: surveyData.refusalStats.totalRefusalCount,
        },
        {
          name: "Religious refusals",
          value: surveyData.refusalStats.refusalReasons.religiousRefusal,
        },
        {
          name: "Other refusals",
          value: surveyData.refusalStats.refusalReasons.otherRefusal,
        },
        {
          name: "Medical refusals",
          value: surveyData.refusalStats.refusalReasons.medicalRefusal,
        },
      ]
    : [];

  const nadata = surveyData
    ? [
        {
          name: "NA Children Same Day covered",
          value: surveyData["covered NA Children same day"],
        },
        
        { name: "NA Children", value: surveyData.uniqueNAChildrenCount },
        {
          name: "NA same day (visited)",
          value: surveyData["Na Housenot visted same day"],
        },
        {
          name: "NA same day (not visited)",
          value: surveyData["Na Housenot Not visted same day"],
        },
      ]
    : [];

  // Render individual pie charts with color-coded legend and values
  const renderPieChartWithLegend = (data, colorIndex) => (
    <Row align="middle">
      <Col span={6}>
        <div style={{ padding: "10px" }}>
          {data.map((entry, index) => (
            <div
              key={`item-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  backgroundColor: COLORS[(colorIndex + index) % COLORS.length],
                  marginRight: "8px",
                  borderRadius: "50%",
                }}
              />
              <span>
                {entry.name}: <strong>{entry.value}</strong>
              </span>
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
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[(colorIndex + index) % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Col>
    </Row>
  );

  // Render individual data cards with color-coded legend and values
  const renderDataCard = (title, data, colorIndex, buttonLabel) => (
    <Card
      bordered
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{title}</span>
          <Button style={{ width: "22%" }} type="primary" size="small">{buttonLabel}Details</Button>
        </div>
      }
      
      style={{ marginBottom: "16px" }}
      
    >
      {/* <Divider style={{ marginTop: "5px", marginBottom: "5px" }} /> */}
      {data.map((entry, index) => (
        <div
          key={`card-item-${index}`}
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: COLORS[(colorIndex + index) % COLORS.length],
              marginRight: "8px",
              borderRadius: "50%",
            }}
          />
          <span>
            {entry.name}: <strong>{entry.value}</strong>
          </span>
        </div>
      ))}
    </Card>
  );

  return (
    <div className="tab-panel">




       <div className="form-container">
         <h2>District Health Authority Lahore</h2> 
      <div style={{ display: 'flex' }}>
         
    <h3 style={{ marginRight: '20px' }}>District: Lahore</h3>
    <h3>Division: Lahore</h3>
</div>  

       </div>

       <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
<div className="form-container">
<SurveyData/>
</div>



       {/* <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
      <div className="form-container">
 
        <h3>Survey Data</h3>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            {renderDataCard("Vaccination Data", vaccinationData, 0)}
          
          </Col>
          <Col span={8}>{renderDataCard("Team Data", teamData, 1)}</Col>
          <Col span={8}>{renderDataCard("Houses Data", housesData, 2)}</Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            {renderDataCard("Children Data", childrenData, 3)}
          </Col>
          <Col span={8}>
            {renderDataCard("Refusals Data", refusalsData, 4)}
          </Col>
          <Col span={8}>
            {renderDataCard("NA Data", nadata, 4)}
          </Col>
        </Row>
      </div> */}
      <Divider style={{ marginTop: "20px", marginBottom: "20px" }} />
      <div className="form-container">
        <h2>Chart View</h2>

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
              <Col span={12}>
                <h3>NA Data</h3>
                {renderPieChartWithLegend(nadata, 4)}
              </Col>
            </Row>
          </>
        )}
      </div>
      
    </div>
  );
}

export default Dashboard;
