import React, { useState, useEffect } from 'react';
import { Button, Select, message, Table, Divider, Input, Switch, Tooltip, Modal, Spin, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { MdDelete } from "react-icons/md";

const { Option } = Select;
const { confirm } = Modal; // Importing confirm from Modal

function CampaignManagement() {
  const [loading, setLoading] = useState(false);
  const [aicData, setAicData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const userID = localStorage.getItem('id');
  const userRole = localStorage.getItem('role');
  const [formData, setFormData] = useState({
    campaignType: '',
    campaignName: '',
    numberOfDays: ''
  });

  const fetchCampData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://survey.al-mizan.store/api/campaign');
      const data = await response.json();
      setAicData(data.body);
      setFilteredData(data.body);
    } catch (error) {
      message.error('Failed to fetch Campaign data');
    }
    finally {
      setLoading(false); // Stop loading spinner
    }
  };

  useEffect(() => {
    fetchCampData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCampaignTypeChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      campaignType: value
    }));
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = aicData.filter(item =>
      item.campaignName.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const handleStatusToggle = async (checked, record) => {
    const apiUrl = checked
      ? `https://survey.al-mizan.store/api/campaign/active/${record._id}`
      : `https://survey.al-mizan.store/api/campaign/inactive/${record._id}`;
  
    // Find the active campaign and its page number
    const activeCampaign = aicData.find(item => item.status === 'ACTIVE');
    const activeCampaignPage = activeCampaign
      ? Math.floor(aicData.indexOf(activeCampaign) / 7) + 1 // Calculate page number based on pagination (7 items per page)
      : null;
  
    try {
      const response = await fetch(apiUrl, { method: 'GET' });
  
      if (response.ok) {
        message.success(`Campaign ${checked ? 'activated' : 'inactivated'} successfully`);
        fetchCampData();
      } else if (activeCampaign) {
        // Show confirm popup with the active campaign's name and page number
        Modal.confirm({
          title: 'Campaign Activation Error',
          content: `The campaign "${activeCampaign.campaignName}" is already active on page ${activeCampaignPage}. Please deactivate it first.`,
          okText: 'OK',
          cancelText: 'Cancel',
          onOk() {
            // Close the modal automatically when "OK" is pressed
          },
        });
      }
    } catch (error) {
      message.error('An error occurred while changing the status');
    }
  };
  

  const handleSubmit = async (e) => {
    const payload = {
      campaignName: formData.campaignName,
      numberOfDays: parseInt(formData.numberOfDays, 10),
      campaignType: formData.campaignType,
      createdBy: userID
    };
  
    try {
      const response = await fetch('https://survey.al-mizan.store/api/campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        message.success('Campaign added successfully');
        fetchCampData();
        setFormData({
          campaignType: '',
          campaignName: '',
          numberOfDays: ''
        });
      } else {
        message.error('Failed to add campaign');
      }
    } catch (error) {
      message.error('An error occurred while adding the campaign');
    }
  };
  

  const deleteTeam = (teamId) => {
    // Show Ant Design confirmation modal
    confirm({
      title: 'Are you sure you want to delete this Campaign?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk() {
        // If confirmed, perform the DELETE request
        fetch(`https://survey.al-mizan.store/api/campaign/${teamId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) { 
              message.success('Campaign deleted successfully');
              fetchCampData(); // Refresh the team list after deletion
            } else {
              message.error(`Error deleting Campaign: ${data.message || 'Unknown error'}`);
            }
          })
          .catch((error) => {
            console.error('Error deleting Campaign:', error);
            message.error('Error deleting Campaign. Please try again later.');
          });
      },
      onCancel() {
        message.info('Campaign deletion cancelled');
      },
    });
  };

  const aicColumns = [
    {
      title: 'Campaign Name',
      dataIndex: 'campaignName',
      key: 'campaignName',
    },
    {
      title: 'Type',
      dataIndex: 'campaignType',
      key: 'campaignType',
    },
    {
      title: 'Days',
      dataIndex: 'numberOfDays',
      key: 'numberOfDays',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <Switch
          checked={record.status === 'ACTIVE'}
          onChange={(checked) => handleStatusToggle(checked, record)}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Tooltip title={userRole === 'ADMIN' ? "Delete" : "Action Unauthorized"}>
          <MdDelete
            style={{
              marginLeft: '17px',
              cursor: userRole === 'ADMIN' ? 'pointer' : 'not-allowed',
              opacity: userRole === 'ADMIN' ? 1 : 0.5,
            }}
            onClick={userRole === 'ADMIN' ? () => deleteTeam(record._id) : null} // Disable click if not ADMIN
          />
        </Tooltip>
      )
    },
  ];

  return (
    <div className="tab-panel">
      <div className="form-container">
        <h2>Add Campaign</h2>
        <p>Fill in the details below:</p>
     
     
     
        <Form layout="vertical" onFinish={handleSubmit} requiredMark="optional">
          <div className="form-group2">
            <label>Select Campaign Type</label>
            <Form.Item
  label="Campaign Type"
  name="campaignType"
  rules={[{ required: true, message: 'Please select a campaign type' }]}
>
  <Select
    placeholder="Select Type"
    style={{ width: '42%' }}
    loading={loading}
    value={formData.campaignType || undefined}
    onChange={handleCampaignTypeChange}
  >
    {['SNID', 'NID', 'OBR', 'CR'].map(type => (
      <Option key={type} value={type}>
        {type}
      </Option>
    ))}
  </Select>
</Form.Item>

          </div>
          <div className="form-group2">
            <label>Campaign Name</label>
            <input
              type="text"
              name="campaignName"
              placeholder="e.g. Campaign 2"
              value={formData.campaignName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group2">
  <label>Number of Days</label>
  <input
    type="number"
    name="numberOfDays"
    placeholder="e.g. 30"
    value={formData.numberOfDays}
    onChange={(e) => {
      const value = e.target.value;
      if (value > 0) {
        handleInputChange(e);
      } else {
        message.error('Number of days must be greater than 0');
      }
    }}
    required
  />
</div>


          <Button type="primary" htmlType="submit">Add Campaign</Button>
        </Form>
      </div>

      <Divider style={{ marginTop: '20px' }} />

      <div className="form-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Campaign Details</h3>
          <Input
            placeholder="Search by Campaign Name"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: 300 }}
          />
        </div>
        <Spin spinning={loading}>
        <Table
          dataSource={filteredData}
          columns={aicColumns}
          rowKey="_id"
          pagination={{ pageSize: 7 }}
        />
        </Spin>
      </div>
    </div>
  );
}

export default CampaignManagement;











