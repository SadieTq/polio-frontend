import React, { useEffect, useState } from 'react';
import { Table, Input, Modal, Select, Button, message,Tooltip,Descriptions, Typography, Divider  } from 'antd';
import { FaUserEdit, FaEdit, FaRegNewspaper  } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

function TeamData({refreshKey}) {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamDetails, setTeamDetails] = useState({});
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [tehsil, setTehsil] = useState('');
  const [mauza, setMauza] = useState('');

  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tehsils, setTehsils] = useState([]);
  const [mauzas, setMauzas] = useState([]);
  const [ucmos, setUCMOs] = useState([]);  // State for UCMOs
  const [aics, setAICs] = useState([]);    // State for AICs
  const [flws, setFLWs] = useState([]); 
  const [selectedUCMO, setSelectedUCMO] = useState(null);
  const [selectedAIC, setSelectedAIC] = useState(null);
  const [selectedFLWs, setSelectedFLWs] = useState([]);

  useEffect(() => {
    fetchTeams();
  }, [refreshKey])


  useEffect(() => {
    fetchTeams();

    fetch('https://survey.al-mizan.store/api/division')
      .then((response) => response.json())
      .then((data) => {
        setDivisions(data.body);
      })
      .catch((error) => {
        console.error('Error fetching divisions:', error);
      });

    fetch('https://survey.al-mizan.store/api/district')
      .then((response) => response.json())
      .then((data) => {
        setDistricts(data.body);
      })
      .catch((error) => {
        console.error('Error fetching districts:', error);
      });

    fetch('https://survey.al-mizan.store/api/tehsil')
      .then((response) => response.json())
      .then((data) => {
        setTehsils(data.body);
      })
      .catch((error) => {
        console.error('Error fetching tehsils:', error);
      });

    fetch('https://survey.al-mizan.store/api/uc')
      .then((response) => response.json())
      .then((data) => {
        setMauzas(data.body);
      })
      .catch((error) => {
        console.error('Error fetching UCs:', error);
      });
      fetch('https://survey.al-mizan.store/api/users/all-ucmo')
      .then((response) => response.json())
      .then((data) => setUCMOs(data.body))
       .catch((error) => {
        console.error('Error fetching UCMOs:', error);
      });
      
  }, [isModalVisible]);

  const handleUCMOChange = (ucmoid) => {
    setSelectedUCMO(ucmoid);

    // Make API call to fetch AICs for the selected UCMO
    fetch(`https://survey.al-mizan.store/api/users/umco/${ucmoid}/aics`)
      .then(response => response.json())
      .then(data => setAICs(data.body || []))  // Set AICs
      .catch(error => console.error('Error fetching AICs:', error));
  };


  const handleAICChange = (aicId) => {
    setSelectedAIC(aicId);

    // Make API call to fetch FLWs for the selected AIC
    fetch(`https://survey.al-mizan.store/api/users/aics/${aicId}/flws`)
      .then(response => response.json())
      .then(data => setFLWs(data.body || []))  // Set FLWs
      .catch(error => console.error('Error fetching FLWs:', error));
  };

  const fetchTeams = () => {
    fetch('https://survey.al-mizan.store/api/teams/')
      .then((response) => response.json())
      .then((data) => {
        const teams = data.body.map((team) => {
          const firstName = team.flws[0]?.firstName || '';
          const lastName = team.flws[0]?.lastName || '';
          const name = firstName && lastName ? `${firstName} ${lastName}` : 'Unavailable';

          return {
            key: team._id,
            teamName: team.teamName,
            district: team.territory.district,
            division: team.territory.division,
            town: team.territory.tehsilOrTown,
            uc: team.territory.uc,
          };
        });
        setDataSource(teams);
      })
      .catch((error) => {
        console.error('Error fetching team data:', error);
      });
  };

  const showEditModal = (team) => {
    setSelectedTeam(team);
    setDivision(team.division);
    setDistrict(team.district);
    setTehsil(team.town);
    setMauza(team.uc);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    const teamId = selectedTeam.key;

    const payload = {
      territory: {
        division: division,
        district: district,
        tehsilOrTown: tehsil,
        uc: mauza,
      },
      flws: selectedFLWs,  // Send multiple FLWs
      aic: selectedAIC,
      ucmo: selectedUCMO,
    };

    fetch(`https://survey.al-mizan.store/api/teams/${teamId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Team updated successfully:', data);
        message.success("Team added successfully!");
        setIsModalVisible(false);
        setSelectedUCMO(null);
        setSelectedAIC(null);
        setSelectedFLWs([]);
        fetchTeams();
      })
      .catch((error) => {
        console.error('Error updating team:', error);
        message.error("Error updating team");
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUCMO(null);
    setSelectedAIC(null);
    setSelectedFLWs([]);
  };

  const handleDetailCancel = () => {
    setIsDetailModalVisible(false);
  };

  const fetchTeamDetails = (teamId) => {
    fetch(`https://survey.al-mizan.store/api/teams/${teamId}`)
      .then((response) => response.json())
      .then((data) => {
        const { flws, aic, ucmo } = data.body;
        
        // Store all FLW details
        const teamMembers = flws.map((flw) => ({
          firstName: flw.firstName || 'Unavailable',
          lastName: flw.lastName || 'Unavailable',
          cnic: flw.cnic || 'Unavailable',
          phone: flw.phone || 'Unavailable',
          role: flw.role || 'Unavailable',
         
        }));
  
        // Store AIC and UCMO details
        setTeamDetails({
          flws: teamMembers,
          aicFirstName: aic?.firstName || 'Unavailable',
          ucmoFirstName: ucmo?.firstName || 'Unavailable',
        });
        setIsDetailModalVisible(true);
      })
      .catch((error) => {
        console.error('Error fetching team details:', error);
      });
  };
  
  const { confirm } = Modal;

  const deleteTeam = (teamId) => {
    // Show Ant Design confirmation modal
    confirm({
      title: 'Are you sure you want to delete this team?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk() {
        // If confirmed, perform the DELETE request
        fetch(`https://survey.al-mizan.store/api/teams/${teamId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) { 
              message.success('Team deleted successfully');
              fetchTeams(); // Refresh the team list after deletion
            } else {
              message.error(`Error deleting team: ${data.message || 'Unknown error'}`);
            }
          })
          .catch((error) => {
            console.error('Error deleting team:', error);
            message.error('Error deleting team. Please try again later.');
          });
      },
      onCancel() {
        message.info('Team deletion cancelled');
      },
    });
  };
  
  const columns = [
   
    {
      title: 'Team Name',
      dataIndex: 'teamName',
      key: 'teamName',
    },
    {
      title: 'District',
      dataIndex: 'district',
      key: 'district',
    },
    {
      title: 'Division',
      dataIndex: 'division',
      key: 'division',
    },
    {
      title: 'UC',
      dataIndex: 'uc',
      key: 'uc',
    },
    {
      title: 'Town',
      dataIndex: 'town',
      key: 'town',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
        <Tooltip title="Edit">
          < FaEdit
            style={{ marginRight: '10px', cursor: 'pointer' }}
            onClick={() => showEditModal(record)}
          /></Tooltip>
          
          <Tooltip title="Details">
           < FaUserEdit
            style={{marginRight: '10px' ,cursor: 'pointer' }}
            onClick={() => fetchTeamDetails(record.key)}
          /></Tooltip>

        <Tooltip title="Delete">
           < MdDelete
            style={{ cursor: 'pointer' }}
            onClick={() => deleteTeam(record.key)}
          /></Tooltip>

        </>
      ),
    },
  ];

  const onSearch = (value) => {
    console.log(value);
  };

  return (
    <div className="team-container" style={{ padding: '20px' }}>
      <h2>Team Data</h2>
      <p>Assign territories to teams</p>

      {/* <Search
        placeholder="Search by Surveyor Name"
        onSearch={onSearch}
        style={{ width: 300, marginBottom: '20px' }}
      /> */}

      <Table dataSource={dataSource} columns={columns} pagination={true} />

      <Modal
        title="Select Territory"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Confirm Selection
          </Button>,
        ]}
        width={600} // Set a fixed width for the modal
        bodyStyle={{ maxHeight: '55vh', overflowY: 'auto' }} // Set max height and enable vertical scroll
      >
        <div>
          <label>Select Division</label>
          <Select
          showSearch
            style={{ width: '100%', marginBottom: '10px' }}
            placeholder="Select Division"
            value={division}
            onChange={(value) => setDivision(value)}
            optionFilterProp="children"  // Ensures the search filters based on the displayed text
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {divisions.map((div) => (
              <Option key={div._id} value={div.name}>
                {div.name}
              </Option>
            ))}
          </Select>

          <label>Select District</label>
          <Select
          showSearch
            style={{ width: '100%', marginBottom: '10px' }}
            placeholder="Select District"
            value={district}
            onChange={(value) => setDistrict(value)}
            optionFilterProp="children"  // Ensures the search filters based on the displayed text
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {districts.map((dist) => (
              <Option key={dist._id} value={dist.name}>
                {dist.name}
              </Option>
            ))}
          </Select>

          <label>Select Tehsil/Town</label>
          <Select
          showSearch
            style={{ width: '100%', marginBottom: '10px' }}
            placeholder="Select Tehsil/Town"
            value={tehsil}
            onChange={(value) => setTehsil(value)}
            optionFilterProp="children"  // Ensures the search filters based on the displayed text
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {tehsils.map((tehsil) => (
              <Option key={tehsil._id} value={tehsil.name}>
                {tehsil.name}
              </Option>
            ))}
          </Select>

          <label>Select UC</label>
          <Select
          showSearch
            style={{ width: '100%', marginBottom: '10px' }}
            placeholder="Select UC"
            value={mauza}
            onChange={(value) => setMauza(value)}
            optionFilterProp="children"  // Ensures the search filters based on the displayed text
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {mauzas.map((uc) => (
              <Option key={uc._id} value={uc.name}>
                {uc.name}
              </Option>
            ))}
          </Select>

          <label>Select UCMO</label>
          <Select
          showSearch
           style={{ width: '100%', marginBottom: '10px' }}
            placeholder="Select UCMO"
            className="custom-select-team"
            onChange={handleUCMOChange}
            value={selectedUCMO}
            optionFilterProp="children"  // Ensures the search filters based on the displayed text
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {ucmos.map(ucmo => (
              <Option key={ucmo._id} value={ucmo._id}>
                {ucmo.firstName}
              </Option>
            ))}
          </Select>

          <label>Select AIC</label>
          <Select
          showSearch
           style={{ width: '100%', marginBottom: '10px' }}
            placeholder="Select AIC"
            className="custom-select-team"
            onChange={handleAICChange}
            value={selectedAIC}
            optionFilterProp="children"  // Ensures the search filters based on the displayed text
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {aics.map(aic => (
              <Option key={aic._id} value={aic._id}>
                {aic.firstName}
              </Option>
            ))}
          </Select>

          <label>Select FLWs</label>
          <Select
          showSearch
           style={{ width: '100%', marginBottom: '10px' }}
            placeholder="Select FLWs"
            className="custom-select-team"
            mode="multiple"  // Enable multiple selection
            onChange={setSelectedFLWs}
            value={selectedFLWs}
            optionFilterProp="children"  // Ensures the search filters based on the displayed text
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {flws.map(flw => (
              <Option key={flw._id} value={flw._id}>
                {flw.firstName}
              </Option>
            ))}
          </Select>

        </div>
      </Modal>

      <Modal
  title={<Title level={3}>Details</Title>} // Uses Ant Typography for title
  visible={isDetailModalVisible}
  onCancel={handleDetailCancel}
  footer={[
    <Button key="back" onClick={handleDetailCancel}>
      Close
    </Button>,
  ]}
  width={600} // Set a fixed width for the modal
  bodyStyle={{ maxHeight: '55vh', overflowY: 'auto' }} // Set max height and enable vertical scroll
>
  <Descriptions bordered column={1} size="small">
    {/* Loop through each FLW's details */}
    {teamDetails.flws && teamDetails.flws.length > 0 ? (
      teamDetails.flws.map((flw, index) => (
        <React.Fragment key={index}>
          <Descriptions.Item label={`FLW ${index + 1} Name`}>
            <Text>{`${flw.firstName} ${flw.lastName}`}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={`FLW ${index + 1} CNIC`}>
            <Text>{flw.cnic}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={`FLW ${index + 1} Phone`}>
            <Text>{flw.phone}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={`FLW ${index + 1} Role`}>
            <Text>{flw.role}</Text>
          </Descriptions.Item>
         
          <div style={{ marginBottom: '20px' }} />
        </React.Fragment>
      ))
    ) : (
      <Descriptions.Item label="FLWs">
        <Text>Unavailable</Text>
      </Descriptions.Item>
    )}

    {/* AIC and UCMO details */}
    <Descriptions.Item label="AIC">
      <Text>{teamDetails.aicFirstName}</Text>
    </Descriptions.Item>
    <Descriptions.Item label="UCMO">
      <Text>{teamDetails.ucmoFirstName}</Text>
    </Descriptions.Item>
  </Descriptions>
</Modal>





    </div>
  );
}

export default TeamData;
