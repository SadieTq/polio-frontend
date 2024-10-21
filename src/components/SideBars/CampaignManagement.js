import React, { useState, useEffect } from 'react';
import { Button, Select, message, Table, Divider, Input, Switch, Tooltip, Modal } from 'antd';
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
  const [formData, setFormData] = useState({
    campaignType: '',
    campaignName: '',
    numberOfDays: ''
  });

  const fetchCampData = async () => {
    try {
      const response = await fetch('http://203.161.43.125:4000/api/campaign');
      const data = await response.json();
      setAicData(data.body);
      setFilteredData(data.body);
    } catch (error) {
      message.error('Failed to fetch Campaign data');
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
      ? `http://203.161.43.125:4000/api/campaign/active/${record._id}`
      : `http://203.161.43.125:4000/api/campaign/inactive/${record._id}`;

    try {
      const response = await fetch(apiUrl, { method: 'GET' });
      if (response.ok) {
        message.success(`Campaign ${checked ? 'activated' : 'inactivated'} successfully`);
        fetchCampData();
      } else {
        message.error(`Only one campaign can be active!`);
      }
    } catch (error) {
      message.error('An error occurred while changing the status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      campaignName: formData.campaignName,
      numberOfDays: parseInt(formData.numberOfDays, 10),
      campaignType: formData.campaignType,
      createdBy:userID
    };

    try {
      const response = await fetch('http://203.161.43.125:4000/api/campaign', {
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
        fetch(`http://203.161.43.125:4000/api/campaign/${teamId}`, {
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
        <Tooltip title="Delete">
          <MdDelete
            style={{ marginLeft: '17px', cursor: 'pointer' }}
            onClick={() => deleteTeam(record._id)} // Use record._id instead of record.key
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="tab-panel">
      <div className="form-container">
        <h2>Add Campaign</h2>
        <p>Fill in the details below:</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Campaign Type</label>
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
          </div>
          <div className="form-group">
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
          <div className="form-group">
            <label>Number of Days</label>
            <input
              type="number"
              name="numberOfDays"
              placeholder="e.g. 30"
              value={formData.numberOfDays}
              onChange={handleInputChange}
              required
            />
          </div>

          <Button type="primary" htmlType="submit">Add Campaign</Button>
        </form>
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
        <Table
          dataSource={filteredData}
          columns={aicColumns}
          rowKey="_id"
          pagination={{ pageSize: 7 }}
        />
      </div>
    </div>
  );
}

export default CampaignManagement;
