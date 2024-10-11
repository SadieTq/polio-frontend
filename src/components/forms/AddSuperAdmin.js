import React, { useState, useEffect } from 'react';
import { Button, message, Table, Divider } from 'antd';

function AddSuperAdmin() {
  // State for form values
  const [cnic, setCnic] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [street, setStreet] = useState('');

  const [adminData, setAdminData] = useState([]);

  // Fetch Admin data on component mount
  const fetchAdminData = async () => {
    try {
      const response = await fetch('https://survey.al-mizan.store/api/users/all-admin');
      const data = await response.json();
      setAdminData(data.body); 
    } catch (error) {
      message.error('Failed to fetch Admin data');
    }
  };

  useEffect(() => {
    fetchAdminData(); // Fetch data on component mount
  }, []);

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

        // Fetch the updated admin data to refresh the table
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
    }
  ];

  return (
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
          <label>Email</label>
          <input
            type="email"
            placeholder="e.g. xyz@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <label>Street Address</label>
          <input
            type="text"
            placeholder="e.g. 123 Street Name"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />
        </div>
        <Button type="primary" htmlType="submit">Add Admin</Button>
      </form>

      <Divider style={{ marginTop: '40px' }} />
      <h3>Admin Details</h3>
      <Table dataSource={adminData} columns={adminColumns} rowKey="_id" />
    </div>
  );
}

export default AddSuperAdmin;
