import React, { useState, useEffect } from 'react';
import { Button, Select, message, Spin, Table, Divider } from 'antd';

const { Option } = Select;

function AddDivisionalManager() {
  const [aicList, setAicList] = useState([]); // State for AIC list
  const [loading, setLoading] = useState(false);
  const [selectedAic, setSelectedAic] = useState(null); // UCMO ID
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cnic: '',
    phone: '',
    address: '',
  });

  const [aicData, setAicData] = useState([]);

  // Function to fetch the list of AICs (UCMOs)
  const fetchAICs = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://survey.al-mizan.store/api/users/all-ucmo');
      const data = await response.json();
      setAicList(data.body); 
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch AIC list');
      setLoading(false);
    }
  };

  // Fetch AIC data on component mount and after form submission
  const fetchAicData = async () => {
    try {
      const response = await fetch('https://survey.al-mizan.store/api/users/all-aic');
      const data = await response.json();
      setAicData(data.body); // Assuming the data is in the body field
    } catch (error) {
      message.error('Failed to fetch AIC data');
    }
  };

  useEffect(() => {
    fetchAicData(); // Fetch data on component mount
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle selection of AIC (UCMO)
  const handleSelectAIC = (value) => {
    setSelectedAic(value); // The selected AIC's _id (UCMO ID)
  };

  // Function to submit the form and send data to the API
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      address: {
        street: formData.address,
      },
      qualifications: [], 
      ucmo: selectedAic,  // Send selected UCMO ID
    };

    try {
      const response = await fetch('https://survey.al-mizan.store/api/users/add-aic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        message.success('AIC added successfully');

        // Clear the form and dropdown after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          cnic: '',
          phone: '',
          address: '',
        });
        setSelectedAic(null); // Clear the UCMO dropdown selection

        // Fetch updated AIC data to refresh the table
        fetchAicData();
      } else {
        message.error('Failed to add AIC');
      }
    } catch (error) {
      message.error('An error occurred while adding AIC');
    }
  };

  // Columns for the AIC Table
  const aicColumns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'CNIC',
      dataIndex: 'cnic',
      key: 'cnic',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    }
  ];

  return (
    <div className="form-container">
      <h2>Add AIC</h2>
      <p>Fill in the details below:</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select UCMO</label>
          <Select
            placeholder="Select UCMO"
            style={{ width: '42%' }}
            onFocus={fetchAICs} // Trigger API call when dropdown is focused
            value={selectedAic} // Bind the selected value to the dropdown
            loading={loading}
            onChange={handleSelectAIC} 
            notFoundContent={
              loading ? (
                <div className="spinner-container">
                  <Spin size="small" />
                </div>
              ) : 'No data'
            } 
          >
            {aicList.map(aic => (
              <Option key={aic._id} value={aic._id}>
                {aic.firstName}
              </Option>
            ))}
          </Select>
        </div>
        <div className="form-group">
          <label>AIC CNIC</label>
          <input
            type="text"
            name="cnic"
            placeholder="e.g. 1234512345678"
            value={formData.cnic}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="e.g. Saad"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="e.g. Tariq"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="e.g. xyz@example.com"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Mobile No</label>
          <input
            type="text"
            name="phone"
            placeholder="e.g. 03001234567"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            placeholder="e.g. 123 Street Name"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>
        <Button type="primary" htmlType="submit">Add AIC</Button>
      </form>

      {/* Divider and AIC Table */}
      <Divider style={{ marginTop: '40px' }} />
      <h3>AIC Details</h3>
      <Table dataSource={aicData} columns={aicColumns} rowKey="_id" />
    </div>
  );
}

export default AddDivisionalManager;
