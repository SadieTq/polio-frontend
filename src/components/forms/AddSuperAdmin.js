import React, { useState, useEffect } from 'react';
import { Button, message, Table, Divider, Input, Radio } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function AddSuperAdmin() {
  // State for form values
  const [cnic, setCnic] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [street, setStreet] = useState('');
  
  // State for gender and employment status
  const [gender, setGender] = useState('MALE'); // Default value 'MALE'
  const [isEmployee, setIsEmployee] = useState(true); // Default value true (Employed)

  // State for Admin data and search term
  const [adminData, setAdminData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table

  // Fetch Admin data on component mount
  const fetchAdminData = async () => {
    try {
      const response = await fetch('https://survey.al-mizan.store/api/users/all-admin');
      const data = await response.json();
      setAdminData(data.body); // Set initial data
      setFilteredData(data.body); // Set filtered data as full dataset initially
    } catch (error) {
      message.error('Failed to fetch Admin data');
    }
  };

  useEffect(() => {
    fetchAdminData(); // Fetch data on component mount
  }, []);

  useEffect(() => {
    // Filter admin data based on the search term
    const filtered = adminData.filter((admin) =>
      admin.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered); // Update filtered data
  }, [searchTerm, adminData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Payload for API request
    const payload = {
      firstName,
      lastName,
      email,
      cnic,
      phone: mobileNo,
      address: {
        street,
      },
      gender, // MALE or FEMALE
      isEmployee, // true or false
    };

    try {
      // POST request to API
      const response = await fetch('https://survey.al-mizan.store/api/users/add-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Admin added successfully!');

        // Clear the form
        setCnic('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setMobileNo('');
        setStreet('');

        // Refresh the admin data after adding a new one
        fetchAdminData();
      } else {
        message.error('Failed to add admin: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred while adding the admin.');
    }
  };

  // Columns for the Admin Table
  const adminColumns = [
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
    },
  ];

  return (
    <>
      <div className="form-container">
        <h2>Add Admin</h2>
        <p>Fill in the details below:</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admin CNIC</label>
            <input
              type="text"
              placeholder="e.g. 1234512345678"
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              placeholder="e.g. Saad"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              placeholder="e.g. Tariq"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Mobile No</label>
            <input
              type="text"
              placeholder="e.g. 03001234567"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email (Optional)</label>
            <input
              type="email"
              placeholder="e.g. xyz@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Street Address (Optional)</label>
            <input
              type="text"
              placeholder="e.g. 123 Street Name"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>

          {/* Gender Toggle */}
          <div className="form-group">
            <label>Gender</label>
            <Radio.Group onChange={(e) => setGender(e.target.value)} value={gender}>
              <Radio value="MALE">Male</Radio>
              <Radio value="FEMALE">Female</Radio>
            </Radio.Group>
          </div>

          {/* Employment Status Toggle */}
          <div className="form-group">
            <label>Employment Status</label>
            <Radio.Group onChange={(e) => setIsEmployee(e.target.value === 'employed')} value={isEmployee ? 'employed' : 'unemployed'}>
              <Radio value="employed">Employed</Radio>
              <Radio value="unemployed">Unemployed</Radio>
            </Radio.Group>
          </div>

          <Button type="primary" htmlType="submit">Add Admin</Button>
        </form>
      </div>

      <Divider style={{ marginTop: '20px' }} />

      <div className="form-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Admin Details</h3>
          <Input
            placeholder="Search by First Name"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        {/* Admin Table */}
        <Table dataSource={filteredData} columns={adminColumns} rowKey="_id" />
      </div>
    </>
  );
}

export default AddSuperAdmin;
