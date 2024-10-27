import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Spin, Divider, Row, Col } from "antd";
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
      console.error("Error fetching survey data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyData();
  }, []);

  // Define data for each chart category
  const vaccinationData = surveyData
    ? [{ name: "Total Vaccinated Coverage", value: surveyData.total },
      { name: "School children", value: surveyData.school },
      { name: "Street children", value: surveyData.street },
      { name: "Guest children", value: surveyData.guestChild },
      { name: "Inhouse Children", value: surveyData["Children vaccinated at House"] },
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
        { name: "Total NA Houses", value: surveyData["Total NA houses"] },
        { name: "NA house cover same day", value: surveyData["NA house cover same day "] },
        { name: "Remaining Na House", value: surveyData["Remaining Na House "] },
        { name: "Na house visited after 2 pm", value: surveyData["Na housevisited after 2 pm "] },
      ]
    : [];

  const childrenData = surveyData
    ? [
      
        { name: "Newborn Count", value: surveyData["Total Newborn Count"] },
      ]
    : [];

  const refusalsData = surveyData
    ? [
        { name: "Total refusals", value: surveyData.refusalStats.totalRefusalCount },
        { name: "Religious refusals", value: surveyData.refusalStats.refusalReasons.religiousRefusal },
        { name: "Medical refusals", value: surveyData.refusalStats.refusalReasons.medicalRefusal },
        { name: "Other refusals", value: surveyData.refusalStats.refusalReasons.otherRefusal },
        { name: "Unknown refusals", value: surveyData.refusalStats.refusalReasons.unknown },
      ]
    : [];

  const nadata = surveyData
    ? [
        { name: "Total NA", value: surveyData["Total Na "] },
        { name: "NA Covered Same Day", value: surveyData["Cover same day Na "] },
        { name: "Remaining NA", value: surveyData["Remaining Na "] },
        { name: "Not covered after 2pm", value: surveyData["Not cover after 2pm day"] },
        { name: "Covered after 2pm", value: surveyData["NA cover after 2 pm "] },
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
                <Cell key={`cell-${index}`} fill={COLORS[(colorIndex + index) % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Col>
    </Row>
  );

  return (
    <div className="tab-panel">
      <div className="form-container">
        <h2>District Health Authority Lahore</h2>
        <div style={{ display: 'flex' }}>
          <h3 style={{ marginRight: '20px' }}>Division: Lahore</h3>
          <h3>District: Lahore</h3>
        </div>
      </div>

      <Divider style={{ marginTop: "10px", marginBottom: "10px" }} />
      <div className="form-container">
        <SurveyData />
      </div>

      {/* <Divider style={{ marginTop: "20px", marginBottom: "20px" }} />
      <div className="form-container">
        <h2>Chart View</h2>

        {loading ? (
          <Spin tip="Loading data..." />
        ) : (
          <>
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
                <h3>NA Houses Data</h3>
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
                <h3>NA Children</h3>
                {renderPieChartWithLegend(nadata, 5)}
              </Col>
            </Row>
          </>
        )}
      </div> */}
    </div>
  );
}

export default Dashboard;
