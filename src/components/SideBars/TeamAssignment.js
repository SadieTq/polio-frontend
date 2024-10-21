import React, { useState, useEffect } from 'react';
import { Select, Button, message, Divider } from 'antd';
import TeamData from './TeamData';

const { Option } = Select;

function TeamAssignment() {
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [towns, setTowns] = useState([]);
  const [ucs, setUcs] = useState([]);
  const [ucmos, setUCMOs] = useState([]);  // State for UCMOs
  const [aics, setAICs] = useState([]);    // State for AICs
  const [flws, setFLWs] = useState([]);    // State for FLWs
  const userID = localStorage.getItem('id');
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTown, setSelectedTown] = useState(null);
  const [selectedUc, setSelectedUc] = useState(null);
  const [selectedUCMO, setSelectedUCMO] = useState(null);
  const [selectedAIC, setSelectedAIC] = useState(null);
  const [selectedFLWs, setSelectedFLWs] = useState([]);  // State for multiple FLWs
  const [refreshKey, setRefreshKey] = useState(0);
  // Fetch data from APIs for the first 4 selects
  useEffect(() => {
    fetch('http://203.161.43.125:4000/api/division')
      .then(response => response.json())
      .then(data => setDivisions(data.body || []))
      .catch(error => console.error('Error fetching divisions:', error));

    fetch('http://203.161.43.125:4000/api/district')
      .then(response => response.json())
      .then(data => setDistricts(data.body || []))
      .catch(error => console.error('Error fetching districts:', error));

    fetch('http://203.161.43.125:4000/api/tehsil')
      .then(response => response.json())
      .then(data => setTowns(data.body || []))
      .catch(error => console.error('Error fetching towns:', error));

    fetch('http://203.161.43.125:4000/api/uc')
      .then(response => response.json())
      .then(data => setUcs(data.body || []))
      .catch(error => console.error('Error fetching UCs:', error));

    // Fetch UCMO data
    fetch('http://203.161.43.125:4000/api/users/all-ucmo')
      .then(response => response.json())
      .then(data => setUCMOs(data.body || []))
      .catch(error => console.error('Error fetching UCMOs:', error));
  }, []);

  // Fetch AICs when a UCMO is selected
  const handleUCMOChange = (ucmoid) => {
    setSelectedUCMO(ucmoid);

    // Make API call to fetch AICs for the selected UCMO
    fetch(`http://203.161.43.125:4000/api/users/umco/${ucmoid}/aics`)
      .then(response => response.json())
      .then(data => setAICs(data.body || []))  // Set AICs
      .catch(error => console.error('Error fetching AICs:', error));
  };

  // Fetch FLWs when an AIC is selected
  const handleAICChange = (aicId) => {
    setSelectedAIC(aicId);

    // Make API call to fetch FLWs for the selected AIC
    fetch(`http://203.161.43.125:4000/api/users/aics/${aicId}/flws`)
      .then(response => response.json())
      .then(data => setFLWs(data.body || []))  // Set FLWs
      .catch(error => console.error('Error fetching FLWs:', error));
  };

  // Handle adding team
  const handleAddTeam = () => {
    if (!selectedDivision || !selectedDistrict || !selectedTown || !selectedUc || !selectedUCMO || !selectedAIC || selectedFLWs.length === 0) {
      message.error("Please select all fields before adding a team");
      return;
    }

    const payload = {
      territory: {
        district: selectedDistrict,
        division: selectedDivision,
        uc: selectedUc,
        tehsilOrTown: selectedTown,
        createdBy:userID
      },
      flws: selectedFLWs,  // Send multiple FLWs
      aic: selectedAIC,
      ucmo: selectedUCMO,
      
    };

    // POST request to the Add Team API
    fetch('http://203.161.43.125:4000/api/teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        if (data.code === 201) {  // Check if the response code is 201 (success)
          message.success("Team added successfully!");

          // Clear all selected fields
          setSelectedDivision(null);
          setSelectedDistrict(null);
          setSelectedTown(null);
          setSelectedUc(null);
          setSelectedUCMO(null);
          setSelectedAIC(null);
          setSelectedFLWs([]);
          setRefreshKey(prevKey => prevKey + 1);
        } else {
          message.error("Error adding team: " + (data.message || "Unknown error"));
        }
      })
      .catch(error => {
        console.error('Error adding team:', error);
        message.error("Error adding team. Please try again later.");
      });
  };

  return (<>

<div className="tab-panel">

    <div className="form-container">
    <h2>Add Team</h2>
    
      <div className="select-container-team">
        {/* Division */}
        <div className="select-group-team">
          <label>Select Division</label>
          <Select
          showSearch
            placeholder="Select Division"
            className="custom-select-team"
            onChange={setSelectedDivision}
            value={selectedDivision}
            optionFilterProp="children"  // Ensures the search filters based on the displayed text
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {divisions.map(division => (
              <Option key={division._id} value={division.name}>
                {division.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* District */}
        <div className="select-group-team">
          <label>Select District</label>
          <Select
          showSearch
            placeholder="Select District"
            className="custom-select-team"
            onChange={setSelectedDistrict}
            value={selectedDistrict}
            optionFilterProp="children"  // Ensures the search filters based on the displayed text
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {districts.map(district => (
              <Option key={district._id} value={district.name}>
                {district.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Town */}
        <div className="select-group-team">
          <label>Select Town</label>
          <Select
  showSearch
  placeholder="Select Town"
  className="custom-select-team"
  onChange={setSelectedTown}
  value={selectedTown}
  optionFilterProp="children"  // Ensures the search filters based on the displayed text
  filterOption={(input, option) =>
    option.children.toLowerCase().includes(input.toLowerCase())
  }
>
  {towns.map(town => (
    <Option key={town._id} value={town.name}>
      {town.name}
    </Option>
  ))}
</Select>

        </div>
      </div>

      {/* UC */}
      <div className="select-container-team2">
        <div className="select-group-team">
          <label>Select UC</label>
          <Select
          showSearch
            placeholder="Select UC"
            className="custom-select-team"
            onChange={setSelectedUc}
            value={selectedUc}
            optionFilterProp="children"  // Ensures the search filters based on the displayed text
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {ucs.map(uc => (
              <Option key={uc._id} value={uc.name}>
                {uc.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* UCMO */}
        <div className="select-group-team">
          <label>Select UCMO</label>
          <Select
          showSearch
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
        </div>

        {/* AIC */}
        <div className="select-group-team">
          <label>Select AIC</label>
          <Select
          showSearch
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
        </div>
      </div>

      {/* FLW */}
      <div className="select-container-team2">
        <div className="select-group-team">
          <label>Select FLWs</label>
          <Select
          showSearch
            placeholder="Select FLWs"
            className="custom-select-team2"
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
      </div>

      <div className="add-team-btn">
        <Button type="primary" onClick={handleAddTeam} style={{margin:'50px 10px'}}>
          Add Team
        </Button>
      </div>
    </div>
    <Divider style={{ marginTop: '20px' }} />
    <div className="form-container">
    <TeamData refreshKey={refreshKey} />
    </div>
  </div>
  
  </>);
}

export default TeamAssignment;
