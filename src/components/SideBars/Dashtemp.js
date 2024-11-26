import React from "react";
import moment from "moment";
import img3 from "../../assets/images/img3.png";
import {
  Card,
  Col,
  Row,
  Button,
  DatePicker,
  Spin,
  Checkbox,
  Table,
  Modal,
} from "antd";
import {
  HomeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LoginOutlined,
  BarChartOutlined,
  UserOutlined,
  TeamOutlined,
  BulbOutlined,
  MedicineBoxOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { getDataURL, baseURL } from "../../apiConfig";
import {
  AppstoreOutlined,
  BlockOutlined,
  BuildOutlined,
  ExportOutlined,
} from "@ant-design/icons";

ChartJS.register(
  CategoryScale,
  BarElement,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);
const { RangePicker } = DatePicker;
const areaData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
  ],
  datasets: [
    {
      label: "Data1",
      data: [300, 320, 340, 360, 380, 400, 420, 440, 460, 480],
      backgroundColor: "rgba(130, 202, 157, 0.5)",
      borderColor: "#82ca9d",
      fill: true,
    },
    {
      label: "Data2",
      data: [310, 330, 350, 370, 390, 410, 430, 450, 470, 490],
      backgroundColor: "rgba(255, 198, 88, 0.5)",
      borderColor: "#ffc658",
      fill: true,
    },
    {
      label: "Data3",
      data: [320, 340, 360, 380, 400, 420, 440, 460, 480, 500],
      backgroundColor: "rgba(255, 128, 66, 0.5)",
      borderColor: "#ff8042",
      fill: true,
    },
  ],
};

const lineData2 = {
  labels: ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM"],
  datasets: [
    {
      label: "In house Children",
      data: [10, 20, 15, 25, 30],
      borderColor: "#00C49F",
      tension: 0.4,
    },
    {
      label: "School Children",
      data: [10, 50, 69, 25, 500],
      borderColor: "#FFBB28",
      tension: 0.4,
    },
    {
      label: "Street Children",
      data: [25, 50, 249, 55, 500],
      borderColor: "#00b2ea",
      tension: 0.4,
    },
  ],
};

const Dashtemp = () => {
  const [data, setData] = useState(null);

  const [summaryData, setData01] = useState(null);
  const [lockedHouseData, setData02] = useState(null);
  const [refusalData, setData03] = useState(null);
  const [childrenData, setData04] = useState(null);
  const [teamPerformanceData, setData05] = useState(null);
  const [tableStreet, setData06] = useState(null);
  const [tableSchool, setData07] = useState(null);
  const [tableHouse, setData08] = useState(null);
  const [campaignActive, setData09] = useState(null);
  const [teamData, setData11] = useState(null);
  const [campaignAll, setData10] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [checkedDay, setCheckedDay] = useState([]); // Default to an empty array
  const [checkboxOptions, setCheckboxOptions] = useState([]);
  const [isFutureCampaign, setIsFutureCampaign] = useState(false);
  

  useEffect(() => {
   
    fetchCampaignData();
  }, []);
  
  useEffect(() => {

    if (checkedDay.length > 0) {
      const daysQuery = checkedDay.join(",");
      fetchVaccinationData(daysQuery);
 fetchHouseData(daysQuery);
    fetchChildData(daysQuery);
    fetchRefusalsData(daysQuery);
    fetchPerformanceData(daysQuery);
    fetchTableStreet(daysQuery);
    fetchTableSchool(daysQuery);
    fetchTableHouse(daysQuery);
    fetchTeamData(daysQuery);
    console.log("Checked", checkedDay)
    }
    else
    {
      console.log("Checked", checkedDay)
    }
  }, [checkedDay]); 
  

  // useEffect(() => {
  //   fetchCampaignData();
  //   fetchVaccinationData();
  //   fetchHouseData();
  //   fetchChildData();
  //   fetchRefusalsData();
  //   fetchPerformanceData();
  //   fetchTableStreet();
  //   fetchTableSchool();
  //   fetchTableHouse(); 
  // }, []);


  const handleDetailsClick = () => {
    setIsModalVisible(true); // Show the modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Hide the modal
  };

  // const fetchCampaignData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${baseURL}/api/campaign`);
  //     const result = await response.json();
  
  //     if (response.ok) {
  //       if (result.body) {
  //         setData09(result.body);
  
  //         const activeCampaigns = result.body.filter((campaign) => campaign.status === "ACTIVE");
  //         if (activeCampaigns.length > 0) {
  //           const activeCampaign = activeCampaigns[0];
  //           setData10(activeCampaign);
  
  //           const startDate = new Date(activeCampaign.startDate);
  //           const endDate = new Date(activeCampaign.endDate);
  //           const daysBetween = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  //           const options = Array.from({ length: daysBetween + 1 }, (_, index) => ({
  //             label: `Day ${index + 1}`,
  //             value: new Date(startDate.getTime() + index * (1000 * 60 * 60 * 24)).toISOString().split("T")[0],
  //           }));
  
  //           setCheckboxOptions(options);
  
  //           const currentDate = new Date();
  //           const selectedDays = Math.ceil((currentDate - startDate) / (1000 * 60 * 60 * 24));
  //           const selectedValue = options[selectedDays - 1]?.value || null;
  
  //           setCheckedDay(selectedValue ? [selectedValue] : []);
  //         }
  //       }
  //     } else {
  //       console.error("Failed to fetch campaigns:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching campaign data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  const fetchCampaignData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/api/campaign`);
      const result = await response.json();
  
      if (response.ok) {
        if (result.body) {
          setData09(result.body);
  
          const activeCampaigns = result.body.filter(
            (campaign) => campaign.status === "ACTIVE"
          );
          if (activeCampaigns.length > 0) {
            const activeCampaign = activeCampaigns[0];
            setData10(activeCampaign);
  
            const startDate = new Date(activeCampaign.startDate);
            const endDate = new Date(activeCampaign.endDate);
            const currentDate = new Date();
  
            // Check if the start date is in the future
            if (startDate > currentDate) {
              setIsFutureCampaign(true);
              setCheckedDay([]);
              setCheckboxOptions([]);
              return;
            } else {
              setIsFutureCampaign(false);
            }
  
            const daysBetween = Math.ceil(
              (endDate - startDate) / (1000 * 60 * 60 * 24)
            );
  
            const options = Array.from({ length: daysBetween + 1 }, (_, index) => ({
              label: `Day ${index + 1}`,
              value: new Date(
                startDate.getTime() + index * (1000 * 60 * 60 * 24)
              )
                .toISOString()
                .split("T")[0],
            }));
  
            setCheckboxOptions(options);
  
            const selectedDays = Math.ceil(
              (currentDate - startDate) / (1000 * 60 * 60 * 24)
            );
            const selectedValue = options[selectedDays - 1]?.value || null;
  
            setCheckedDay(selectedValue ? [selectedValue] : []);
          }
        }
      } else {
        console.error("Failed to fetch campaigns:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching campaign data:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const fetchVaccinationData = async (day = null) => {
    setLoading(true);
    try {
      const url = day
        ? getDataURL("Summary", day)
        : getDataURL("Summary", "");
  
      const response = await fetch(url);
      const result = await response.json();
  
      if (response.ok) {
        if (result.responseObject) {
          try {
            const data = result.responseObject[0];
            setData01(data);
          } catch (error) {
            console.error("Error parsing responseObject: ", error);
          }
        }
      } else {
        console.error("Failed to fetch vaccination data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching vaccination data:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchTeamData = async (day = null) => {
    setLoading(true);
    try {
      const url = day
        ? getDataURL("TeamData", day)
        : getDataURL("TeamData", "");

      const response = await fetch(url);
      const result = await response.json();
      if (response.ok) {
        if (result.responseObject) {
          try {
            const data = result.responseObject[0];
            setData11(data);
          } catch (error) {
            console.error("Error parsing responseObject: ", error);
          }
        }
      } else {
        console.error("Failed to fetch team data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchHouseData = async (day = null) => {
    setLoading(true);
    try {
      const url = day
        ? getDataURL("GetLockedHouseCount", day)
        : getDataURL("GetLockedHouseCount", "");

      const response = await fetch(url);
      const result = await response.json();
      if (response.ok) {
        if (result.responseObject) {
          try {
            const data = result.responseObject[0];
            setData02(data);
          } catch (error) {
            console.error("Error parsing responseObject: ", error);
          }
        }
      } else {
        console.error("Failed to fetch house data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching house data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildData = async (day = null) => {
    setLoading(true);
    try {
      const url = day
        ? getDataURL("ChildrenData", day)
        : getDataURL("ChildrenData", "");

      const response = await fetch(url);
      const result = await response.json();

      if (response.ok) {
        if (result.responseObject) {
          try {
            const data = result.responseObject[0];

            setData04(data);
          } catch (error) {
            console.error("Error parsing responseObject: ", error);
          }
        }
      } else {
        console.error("Failed to fetch Child data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching house data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRefusalsData = async (day = null) => {
    setLoading(true);
    try {
      const url = day
        ? getDataURL("RefusalData", day)
        : getDataURL("RefusalData", "");

      const response = await fetch(url);
      const result = await response.json();

      if (response.ok) {
        if (result.responseObject) {
          try {
            const data = result.responseObject[0];
            setData03(data);
          } catch (error) {
            console.error("Error parsing responseObject: ", error);
          }
        }
      } else {
        console.error("Failed to fetch Refusals data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching Refusals data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceData = async (day = null) => {
    setLoading(true);
    try {
      const url = day
        ? getDataURL("TeamPerformance", day)
        : getDataURL("TeamPerformance", "");

      const response = await fetch(url);
      const result = await response.json();

      if (response.ok) {
        if (result.responseObject) {
          try {
            const data = result.responseObject[0];
            setData05(data);
          } catch (error) {
            console.error("Error parsing responseObject: ", error);
          }
        }
      } else {
        console.error(
          "Failed to fetch Team Performance data:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching Team Performance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableStreet = async (day = null) => {
    setLoading(true);
    try {
      const url = day
        ? getDataURL("StreetChildrenByHourRange", day)
        : getDataURL("StreetChildrenByHourRange", "");

      const response = await fetch(url);
      const result = await response.json();

      if (response.ok) {
        if (result.responseObject) {
          try {
            const data = result.responseObject[0];

            setData06(data);
          } catch (error) {
            console.error("Error parsing responseObject: ", error);
          }
        }
      } else {
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableSchool = async (day = null) => {
    setLoading(true);
    try {
      const url = day
        ? getDataURL("SchoolChildrenByHourRange", day)
        : getDataURL("SchoolChildrenByHourRange", "");

      const response = await fetch(url);
      const result = await response.json();

      if (response.ok) {
        if (result.responseObject) {
          try {
            const data = result.responseObject[0];

            setData07(data);
          } catch (error) {
            console.error("Error parsing responseObject: ", error);
          }
        }
      } else {
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableHouse = async (day = null) => {
    setLoading(true);
    try {
      const url = day
        ? getDataURL("HousesChildrenByHourRange", day)
        : getDataURL("HousesChildrenByHourRange", "");

      const response = await fetch(url);
      const result = await response.json();

      if (response.ok) {
        if (result.responseObject) {
          try {
            const data = result.responseObject[0];

            setData08(data);
          } catch (error) {
            console.error("Error parsing responseObject: ", error);
          }
        }
      } else {
        console.error("Failed to fetch data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };


  const lineData = {
    labels: tableHouse ? Object.keys(tableHouse[0]) : [], // Extract hour ranges dynamically from keys
    datasets: [
      {
        label: "House Children",
        data: tableHouse ? Object.values(tableHouse[0]) : [], // Extract corresponding values
        borderColor: "#FFBB28",
        tension: 0.4,
      },
      {
        label: "School Children",
        data: tableSchool ? Object.values(tableSchool[0]) : [], // Assuming similar structure for tableSchool
        borderColor: "#00C49F",
        tension: 0.4,
      },
      {
        label: "Street Children",
        data: tableStreet ? Object.values(tableStreet[0]) : [], // Assuming similar structure for tableSchool
        borderColor: "#00b2ea",
        tension: 0.4,
      },
    ],
  };

  const handleCheckboxChange = (checkedValues) => {
    setCheckedDay(checkedValues);
  
    if (checkedValues.length > 0) {
      const daysQuery = checkedValues.join(",");
  
      fetchVaccinationData(daysQuery);
      fetchHouseData(daysQuery);
      fetchChildData(daysQuery);
      fetchRefusalsData(daysQuery);
      fetchPerformanceData(daysQuery);
      fetchTableStreet(daysQuery);
      fetchTableSchool(daysQuery);
      fetchTableHouse(daysQuery);
      fetchTeamData(daysQuery);
    } else {
      fetchVaccinationData(null);
      fetchHouseData(null);
      fetchChildData(null);
      fetchRefusalsData(null);
      fetchPerformanceData(null);
      fetchTableStreet(null);
      fetchTableSchool(null);
      fetchTableHouse(null);
      fetchTeamData(null);
    }
  }

  // const handleSearchClick = () => {
  //   if (checkedDay.length > 0) {
  //     const lastCheckedDay = checkedDay[checkedDay.length - 1];
  //     fetchVaccinationData(lastCheckedDay);
  //     fetchHouseData(lastCheckedDay);
  //     fetchChildData(lastCheckedDay);
  //     fetchRefusalsData(lastCheckedDay);
  //   }
  // };
  const tableColumns = [
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Team Number",
      dataIndex: "teamNumber",
      key: "teamNumber",
    },
    {
      title: "Houses",
      dataIndex: "housesVisited",
      key: "housesVisited",
    },
    {
      title: "Schools",
      dataIndex: "schoolsCovered",
      key: "schoolsCovered",
    },
    {
      title: "Street Children",
      dataIndex: "streetChildrenVisited",
      key: "streetChildrenVisited",
    },
    {
      title: "Total Visited",
      dataIndex: "totalVisited",
      key: "totalVisited",
    },
  ];

  const tableData =
    teamPerformanceData?.map((item, index) => ({
      key: index,
      userName: item.UserName,
      teamNumber: item.TeamNumber,
      housesVisited: item.HousesVisited,
      schoolsCovered: item.SchoolsCovered,
      streetChildrenVisited: item.StreetChildrenVisited,
      totalVisited: item.TotalVisited,
    })) || [];

  const barData = {
    labels: ["Religious", "Medical", "Other"],
    datasets: [
      {
        label: "Refusals",
        data: refusalData
          ? [
              refusalData[0].ReligiousRefusals,
              refusalData[0].MedicalRefusals,
              refusalData[0].OtherRefusals,
            ]
          : [0, 0, 0, 0],
        backgroundColor: "#fc8655",
      },
    ],
  };

  const pieData =
    summaryData &&
    (summaryData[0].SchoolChildrenCount ||
      summaryData[0].StreetChildrenCount ||
      summaryData[0].InhouseChildrenCount)
      ? {
          labels: ["School children", "Street children", "Inhouse Children"],
          datasets: [
            {
              data: [
                summaryData[0].SchoolChildrenCount,
                summaryData[0].StreetChildrenCount,
                summaryData[0].InhouseChildrenCount,
              ],
              backgroundColor: ["#00C49F", "#FFBB28", "#FF8042", "#AAAAAA"],
              hoverOffset: 4,
            },
          ],
        }
      : {
          labels: ["Unavailable"],
          datasets: [
            {
              data: [1], // Single slice for N/A
              backgroundColor: ["#FFBB28"], // Gray color for N/A
              hoverOffset: 4,
            },
          ],
        };

  return (
    <>
      <div className="tab-panel">
        <div className="dash-dashboard-container">
          <div style={{ marginBottom: 20 }}>
            <img src={img3} alt="logo1" className="logo-image1" />
          </div>
          <div className="form-container">
  <h3>Active Campaign Details</h3>
  {campaignAll ? (
    <div className="dash-content-title">
      {/* Display Campaign Details */}
      <p>Campaign Name: {campaignAll.campaignName}</p>
      <p>Campaign Type: {campaignAll.campaignType}</p>
      {/* <p>Status: {campaignAll.status}</p> */}
      <p>Start Date: {campaignAll.startDate}</p>
      <p>End Date: {campaignAll.endDate}</p>
      {/* <p>Created At: {new Date(campaignAll.createdAt).toLocaleString()}</p>
      <p>Updated At: {new Date(campaignAll.updatedAt).toLocaleString()}</p> */}
    </div>
  ) : (
    <p>No Active Campaign</p>
  )}

 
</div>
<div className="form-container">
  <h3>Select Day Of Campaign</h3>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    {isFutureCampaign ? (
      <p style={{ color: "red" }}>Campaign has not started yet</p>
    ) : (
      <Checkbox.Group
        options={checkboxOptions} // Dynamic options
        value={checkedDay} // Selected checkbox value
        onChange={handleCheckboxChange}
      />
    )}

    <div style={{ display: "flex", gap: "10px" }}>
      <Button type="primary" onClick={handleDetailsClick}>
        Download
      </Button>
      {/* Uncomment below if needed */}
      {/* <Button type="primary" onClick={handleSearchClick}>
        Search
      </Button> */}
    </div>
  </div>
</div>


          <Row gutter={10}>
            <Col span={6}>
              <Card className="dash-dashboard-card">
                <div className="dash-card-icon">📝</div>
                <div className="dash-card-content">
                  <div className="dash-card-title">Vaccination Data</div>
                  <div className="dash-content-title">
                    <div>
                      <BarChartOutlined
                        style={{ marginRight: "8px", color: "#1890ff" }}
                      />
                      Total coverage:{" "}
                      <strong>
                        {summaryData
                          ? summaryData[0].TotalVaccinatedCoverage
                          : "..."}
                      </strong>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col span={6}>
              <Card className="dash-dashboard-card">
                <div className="dash-card-icon">🏡</div>
                <div className="dash-card-content">
                  <div className="dash-card-title">Team Data</div>
                  <div className="dash-content-title">
                    <div>
                      <ClockCircleOutlined
                        style={{ marginRight: "8px", color: "#fa541c" }}
                      />
                      Team login before 8:30:{" "}
                      <strong>
                        {teamData
                          ? teamData[0].Before830Count
                          : "..."}
                      </strong>
                    </div>
                    <div>
                      <LoginOutlined
                        style={{ marginRight: "8px", color: "#722ed1" }}
                      />
                      Team login after 8:30:{" "}
                      <strong>
                        {teamData
                          ? teamData[0].After830Count
                          : "..."}
                      </strong>
                    </div>
                    <div>
                      <LoginOutlined
                        style={{ marginRight: "8px", color: "#722ed1" }}
                      />
                      User sync data:{" "}
                      <strong>
                        {teamData
                          ? teamData[0].UserSyncData
                          : "..."}
                      </strong>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col span={6}>
              <Card className="dash-dashboard-card">
                <div className="dash-card-icon">🏡</div>
                <div className="dash-card-content">
                  <div className="dash-card-title">Houses Data</div>
                  <div className="dash-content-title">
                    <div>
                      <HomeOutlined
                        style={{ marginRight: "8px", color: "#1890ff" }}
                      />
                      Total NA houses:{" "}
                      <strong>
                        {lockedHouseData
                          ? lockedHouseData[0].LockedHouseCount
                          : "..."}
                      </strong>
                    </div>
                    <div>
                      <CheckCircleOutlined
                        style={{ marginRight: "8px", color: "#52c41a" }}
                      />
                      NA house cover same day:{" "}
                      <strong>
                        {lockedHouseData
                          ? lockedHouseData[0].NAHouseCoveredSameDay
                          : "..."}
                      </strong>
                    </div>
                    <div>
                      <HomeOutlined
                        style={{ marginRight: "8px", color: "#fa8c16" }}
                      />
                      Remaining NA House:{" "}
                      <strong>
                        {lockedHouseData
                          ? lockedHouseData[0].RemainingNAHouse
                          : "..."}
                      </strong>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col span={6}>
              <Card className="dash-dashboard-card">
                <div className="dash-card-icon">👨‍👦</div>
                <div className="dash-card-content">
                  <div className="dash-card-title">Children Data</div>
                  <div className="dash-content-title">
                    <div>
                      <ClockCircleOutlined
                        style={{ marginRight: "8px", color: "#52c41a" }}
                      />
                      NA covered after 2pm:{" "}
                      <strong>
                        {childrenData
                          ? childrenData[0].NACoveredAfter2pm
                          : "..."}
                      </strong>
                    </div>

                    <div>
                      <UserOutlined
                        style={{ marginRight: "8px", color: "#fa8c16" }}
                      />
                      Total NA children:{" "}
                      <strong>
                      {childrenData
                          ? childrenData[0].TotalNAChildren
                          : "..."}
                      </strong>
                    </div>
                    <div>
                      <TeamOutlined
                        style={{ marginRight: "8px", color: "#1890ff" }}
                      />
                      NA children covered same day:{" "}
                      <strong>
                      {childrenData
                          ? childrenData[0].NAChildrenCoveredSameDay
                          : "..."}
                      </strong>
                    </div>
                    {/* <div>
                      <TeamOutlined
                        style={{ marginRight: "8px", color: "#722ed1" }}
                      />
                      Remaining NA children:{" "}
                      <strong>
                      {childrenData ? childrenData[0].RemainingNAChildren : "..."}
                      </strong>
                    </div> */}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <Row className="dash-chart-container" gutter={16}>
            <Col span={12}>
              <Card className="dash-chart-card">
                {<div className="dash-chart-title">Vaccination Data</div>}
                <div className="dash-chart-content">
                  <Pie
                    data={pieData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card className="dash-chart-card">
                <div className="dash-chart-title">Vaccination Trend</div>
                <div className="dash-chart-content2">
                  <Line
                    data={lineData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </Card>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Card className="dash-chart-card">
                <div className="dash-chart-title">Refusals</div>
                <div className="dash-chart-content2">
                  <div>
                    Total refusals:{" "}
                    <strong>
                      {refusalData ? refusalData[0].TotalRefusalHouses : "..."}
                    </strong>
                  </div>

                  <Bar
                    data={barData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card className="dash-chart-card">
                <div className="dash-chart-title">Data Table</div>
                <div className="dash-chart-content2">
                  <Line
                    data={lineData2}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </Card>
            </Col>
          </Row>

          <Card className="form-container">
            <div className="dash-chart-title">Team Performance</div>

            <Table
              columns={tableColumns}
              dataSource={tableData}
              loading={loading} // Show loading spinner while data is being fetched
              pagination={{ pageSize: 7 }} // Pagination limit
            />
          </Card>

          {/* <div className="form-container">
            <h3>Unregistered Data</h3>
            <div style={{ display: "flex", gap: "15px" }}>
              <span>
                Total Processed:{" "}
                <strong>{coveredChildData ? coveredChildData[0].TotalCoveredChildrenInHouse : "..."}</strong>
              </span>

              <span>
                House:{" "}
                <strong>
                  {coveredChildData ? coveredChildData[0].TotalCoveredChildrenInHouse : "..."}
                </strong>
              </span>
              <span>
                Guest Children:{" "}
                <strong>
                  {coveredChildData ? coveredChildData[0].TotalCoveredGuestInHouse : "..."}
                </strong>
              </span>

              <span>
                School:{" "}
                <strong>
                  {coveredChildData ? coveredChildData[0].TotalCoveredChildrenInSchool : "..."}
                </strong>
              </span>

              <span>
                Street:{" "}
                <strong>
                  {coveredChildData ? coveredChildData[0].TotalCoveredChildrenOnStreet : "..."}
                </strong>
              </span>

            </div>
          </div> */}
        </div>
      </div>
      <Modal
        title="Download"
        visible={isModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
      >
        <p>Select Download Option</p>
      </Modal>
    </>
  );
};

export default Dashtemp;
