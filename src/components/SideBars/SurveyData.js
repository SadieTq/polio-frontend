import React, { useEffect, useState } from "react";
import { Card, Button, Divider } from "antd";

const SurveyData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    fetch("http://110.38.226.9:4000/api/survey")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const cardTextStyle = {
    fontSize: "14px", // Reducing font size for more compact text
    lineHeight: "1.2", // Reducing line height for closer line spacing
  };

  return (
    <div >
      <h3>Survey Data</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {/* Vaccination Data Card */}
        <Card
          title="Overall Vaccination Data"
          extra={<Button type="primary">Details</Button>}
          style={{ flex: "1 1 calc(33.333% - 16px)" }}
          bordered
        >
          <p style={cardTextStyle}>
            <span
              style={{ color: "#0088FE", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            Total vaccinated coverage:{" "}
            <strong>{data ? data.total : "Loading..."}</strong>
          </p>
          <p style={cardTextStyle}>
            <span
              style={{ color: "#FF8042", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            School children:{" "}
            <strong>{data ? data.school : "Loading..."}</strong>
          </p>
  

          <p style={cardTextStyle}>
            <span
              style={{ color: "#AF19FF", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            Street children:{" "}
            <strong>{data ? data.street : "Loading..."}</strong>
          </p>
          <p style={cardTextStyle}>
            <span
              style={{ color: "#FFBB28", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            Guest children:{" "}
            <strong>{data ? data.guestChild : "Loading..."}</strong>
          </p>
          <p style={cardTextStyle}>
            <span
              style={{ color: "#FFBB28", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            Inhouse Children:{" "}
            <strong>
              {data ? data["Children vaccinated at House"] : "Loading..."}
            </strong>
          </p>
          
   </Card>

        {/* Team Data Card */}
        <Card
          title="Team Data"
          extra={<Button type="primary">Details</Button>}
          style={{ flex: "1 1 calc(33.333% - 16px)" }}
          bordered
        >
          <p style={cardTextStyle}>
            <span
              style={{ color: "#00C49F", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            Team login before 8:30:{" "}
            <strong>{data ? data["before 8:30"] : "Loading..."}</strong>
          </p>
          {/* <Divider style={{ marginTop: "5px", marginBottom: "5px" }} /> */}
          <p style={cardTextStyle}>
            <span
              style={{ color: "#FFBB28", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            Team login after 8:30:{" "}
            <strong>{data ? data["after 8:30"] : "Loading..."}</strong>
          </p>
          {/* <p style={cardTextStyle}><span style={{ color: '#FF8042', fontWeight: 'bold', fontSize: '18px' }}>●</span> Team revisited after 2pm: <strong>{data ? data.visitsAfter2PMCount : 'Loading...'}</strong></p> */}
        </Card>

        {/* Houses Data Card */}
        <Card
          title="NA Houses Data"
          extra={<Button type="primary">Details</Button>}
          style={{ flex: "1 1 calc(33.333% - 16px)" }}
          bordered
        >
          <p style={cardTextStyle}>
            <span
              style={{ color: "#FFBB28", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            Total NA houses:(Locked or No children under age 5){" "}
            <strong >{data ? data["Total NA houses"] : "Loading..."}</strong>
          </p>
          {/* <Divider style={{ marginTop: "5px", marginBottom: "5px" }} /> */}
          <p style={cardTextStyle}>
            <span
              style={{ color: "#FF8042", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            NA house cover same day:{" "}
            <strong>
              {data ? data["NA house cover same day "] : "Loading..."}
            </strong>
          </p>
          <p style={cardTextStyle}>
            <span
              style={{ color: "#FF8042", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            Remaining NA House:{" "}
            <strong>{data ? data["Remaining Na House "] : "Loading..."}</strong>
          </p>
       
        </Card>

        {/* Children Data Card */}
        <Card
          title="NA after 2pm"
          extra={<Button type="primary">Details</Button>}
          style={{ flex: "1 1 calc(33.333% - 16px)" }}
          bordered
        >
                  {/* <p style={cardTextStyle}>
            <span
              style={{ color: "#FF8042", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            Newborn Count:{" "}
            <strong>{data ? data["Total Newborn Count"] : "Loading..."}</strong>
          </p> */}


          <p style={cardTextStyle}>
            <span
              style={{ color: "#6A5ACD", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            NA covered after 2pm:{" "}
            <strong>
              {data ? data["NA cover after 2 pm "] : "Loading..."}
            </strong>
          </p>
          {/* <Divider style={{ marginTop: "5px", marginBottom: "5px" }} /> */}
          <p style={cardTextStyle}>
            <span
              style={{ color: "#6A5ACD", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            NA not covered after 2pm:{" "}
            <strong>
              {data ? data["Not cover after 2pm day"] : "Loading..."}
            </strong>
          </p>
          {/* <p style={cardTextStyle}>
            <span
              style={{ color: "#FF8042", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            NA house visited after 2 pm:{" "}
            <strong>
              {data ? data["Na housevisited after 2 pm "] : "Loading..."}
            </strong>
          </p> */}
        </Card>

        <Card
          title="NA Children Data"
          extra={<Button type="primary">Details</Button>}
          style={{ flex: "1 1 calc(33.333% - 16px)" }}
          bordered
        >
          <p style={cardTextStyle}>
            <span
              style={{ color: "#AF19FF", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            Total NA children:{" "}
            <strong>
              {data ? data["Total Na "] : "Loading..."}
            </strong>
          </p>
          {/* <Divider style={{ marginTop: "5px", marginBottom: "5px" }} /> */}
          <p style={cardTextStyle}>
            <span
              style={{ color: "#FF8042", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            NA children covered same day:{" "}
            <strong>
              {data ? data["Cover same day Na "] : "Loading..."}
            </strong>
          </p>
          <p style={cardTextStyle}>
            <span
              style={{ color: "#32CD32", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            Remaining NA children:{" "}
            <strong>
              {data ? data["Remaining Na "] : "Loading..."}
            </strong>
          </p>
         
       
        </Card>


 <Card
          title="Refusals Data"
          extra={<Button type="primary">Details</Button>}
          style={{ flex: "1 1 calc(33.333% - 16px)" }}
          bordered
        >
          <p style={cardTextStyle}>
            <span
              style={{ color: "#AF19FF", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            Total refusals:{" "}
            <strong>
              {data ? data.refusalStats.totalRefusalCount : "Loading..."}
            </strong>
          </p>
          {/* <Divider style={{ marginTop: "5px", marginBottom: "5px" }} /> */}
          <p style={cardTextStyle}>
            <span
              style={{ color: "#FFD700", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            Religious refusals:{" "}
            <strong>
              {data
                ? data.refusalStats.refusalReasons.religiousRefusal
                : "Loading..."}
            </strong>
          </p>
          <p style={cardTextStyle}>
            <span
              style={{ color: "#32CD32", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            Other refusals:{" "}
            <strong>
              {data
                ? data.refusalStats.refusalReasons.otherRefusal + data.refusalStats.refusalReasons.unknown
                : "Loading..."}
            </strong>
          </p>
          <p style={cardTextStyle}>
            <span
              style={{ color: "#6A5ACD", fontWeight: "bold", fontSize: "18px" }}
            >
              ●
            </span>{" "}
            Medical refusals:{" "}
            <strong>
              {data
                ? data.refusalStats.refusalReasons.medicalRefusal
                : "Loading..."}
            </strong>
          </p>

        </Card>


      </div>
    </div>
  );
};

export default SurveyData;
