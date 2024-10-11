import React, { useState, useEffect } from 'react';
import { Button, Select, message, Spin, Table, Divider } from 'antd';

const { Option } = Select;

function AddDivisionalManager() {
  const [FlwList, setFlwList] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [selectedFlw, setSelectedFlw] = useState(null); // UCMO ID
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cnic: '',
    phone: '',
    address: '',
  });

  // Function to fetch the list of FLWs (AICs/UCMOs)
  const fetchFlws = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://survey.al-mizan.store/api/users/all-flw');
      const data = await response.json();
      setFlwList(data.body); 
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch FLW list');
      setLoading(false);
    }
  };

  // Fetch FLW data on component mount
  useEffect(() => {
    fetchFlws(); // Fetch data immediately when component renders
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle selection of FLW (UCMO)
  const handleSelectFlw = (value) => {
    setSelectedFlw(value); // The selected FLW's _id (UCMO ID)
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
      aic: selectedFlw, // Send selected UCMO ID
    };

    try {
      const response = await fetch('https://survey.al-mizan.store/api/users/add-flw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newFlw = await response.json(); // Get the new FLW data from the response
        message.success('FLW added successfully');

        // Clear the form and dropdown after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          cnic: '',
          phone: '',
          address: '',
        });
        setSelectedFlw(null); // Clear the UCMO dropdown selection

        // Update the FLW list to include the newly added entry
        setFlwList((prevList) => [...prevList, newFlw.body]);
      } else {
        message.error('Failed to add FLW');
      }
    } catch (error) {
      message.error('An error occurred while adding FLW');
    }
  };

  // Table columns for the FLW data
  const flwColumns = [
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
      <h2>Add FLW</h2>
      <p>Fill in the details below:</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select AIC</label>
          <Select
            placeholder="Select AIC"
            style={{ width: '42%' }}
            value={selectedFlw} // Bind the selected value to the dropdown
            loading={loading}
            onChange={handleSelectFlw} // Handle selection change
            notFoundContent={
              loading ? (
                <div className="spinner-container">
                  <Spin size="small" />
                </div>
              ) : 'No data'
            } // Show centered spinner while loading
          >
            {FlwList.map(Flw => (
              <Option key={Flw._id} value={Flw._id}>
                {Flw.firstName}
              </Option>
            ))}
          </Select>
        </div>
        <div className="form-group">
          <label>FLW CNIC</label>
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
        <Button type="primary" htmlType="submit">Add FLW</Button>
      </form>

      {/* Divider and FLW Table */}
      <Divider style={{ marginTop: '40px' }} />
      <h3>FLW Details</h3>
      <Table dataSource={FlwList} columns={flwColumns} rowKey="_id" />
    </div>
  );
}

export default AddDivisionalManager;
