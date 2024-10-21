import React, { useState, useEffect } from 'react';
import { Button, message, Table, Divider, Input, Radio, Tooltip, Modal  } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FaEdit } from 'react-icons/fa';

function AddAdmin() {
  // State for form values
  const [cnic, setCnic] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [street, setStreet] = useState('');
  
  // State for gender and employment status
  const [gender, setGender] = useState('MALE'); // Default value 'MALE'
  const [isEmployee, setIsEmployee] = useState(true); // Default value true (Employed)

  // State for Admin data and search term
  const [adminData, setAdminData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
const [editingAdmin, setEditingAdmin] = useState(null); // Holds the admin data to edit

const userID = localStorage.getItem('id');
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
    // Filter admin data based on the search term for both firstName and cnic
    const filtered = adminData.filter((admin) =>
      admin.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.cnic.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered); // Update filtered data
  }, [searchTerm, adminData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Payload for API request
    const payload = {
      firstName,
      lastName,
      cnic,
      phone: mobileNo,
      address: {
        street,
      },
      gender, // MALE or FEMALE
      isEmployee, // true or false
      createdBy: userID
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
  const showEditModal = (admin) => {
    setEditingAdmin(admin); // Set the selected admin data
    setIsEditModalVisible(true); // Show the modal
  };

  const handleUpdate = async () => {
    const payload = {
      firstName: editingAdmin.firstName,
      lastName: editingAdmin.lastName,
      phone: editingAdmin.phone,
      address: {
        street: editingAdmin.address?.street,
      },
      status: editingAdmin.status,
      isEmployee: editingAdmin.isEmployee,
      updatedBy: userID,
      password: editingAdmin.password
    };
  
    try {
      const response = await fetch(`https://survey.al-mizan.store/api/users/${editingAdmin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        message.success('Admin updated successfully!');
        fetchAdminData(); // Refresh admin data
        setIsEditModalVisible(false); // Close the modal
      } else {
        message.error('Failed to update admin: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred while updating the admin.');
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
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
        <div style={{ marginLeft: 17 }}>
        <Tooltip title="Edit">
          < FaEdit
            style={{ marginRight: '10px', cursor: 'pointer' }}
            onClick={() => showEditModal(record)}
          /></Tooltip></div>
      

        </>
      ),
    },
  ];

  return (
    <>
      <div className="form-container">

  
        <h2>Add Admin</h2>
        <p>Fill in the details below:</p>
        <form onSubmit={handleSubmit}>


      <div className="select-container-team">
      <div className="select-group-team">

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
      </div>
    
    
      <div className="select-group-team">

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
      </div>
   </div>


   <div className="select-container-team">

   <div className="select-group-team">
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

   </div>

   <div className="select-group-team">


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
   </div>
  
   </div>

 <div className="select-container-team">

   <div className="select-group-team">

<div className="form-group2">
            <label>Address (Optional)</label>
            <input
              type="text"
              placeholder="e.g. 123 Street Name"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>
   </div>


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
            placeholder="Search by First Name Or CNIC"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
        </div>

        {/* Admin Table */}
        <Table dataSource={filteredData} columns={adminColumns} rowKey="_id"  pagination={{ pageSize: 7 }} />
      </div>

      <Modal
  title="Edit Admin"
  visible={isEditModalVisible}
  onCancel={() => setIsEditModalVisible(false)}
  width={600} // Set a fixed width for the modal
  bodyStyle={{ maxHeight: '55vh', overflowY: 'auto' }} // Set max height and enable vertical scroll
  footer={[
    <Button key="back" onClick={() => setIsEditModalVisible(false)}>
      Cancel
    </Button>,
    <Button key="submit" type="primary" onClick={handleUpdate}>
      Update
    </Button>,
  ]}
>
  <form>

    <div className="form-group">
      <label>First Name</label>
      <input
        type="text"
        value={editingAdmin?.firstName || ''}
        onChange={(e) => setEditingAdmin({ ...editingAdmin, firstName: e.target.value })}
        required
      />
    </div>
    <div className="form-group">
      <label>Last Name</label>
      <input
        type="text"
        value={editingAdmin?.lastName || ''}
        onChange={(e) => setEditingAdmin({ ...editingAdmin, lastName: e.target.value })}
        required
      />
    </div>
    <div className="form-group">
      <label>Mobile No</label>
      <input
        type="text"
        value={editingAdmin?.phone || ''}
        onChange={(e) => setEditingAdmin({ ...editingAdmin, phone: e.target.value })}
        required
      />
    </div>
    <div className="form-group">
      <label>Street Address (Optional)</label>
      <input
        type="text"
        value={editingAdmin?.address?.street || ''}
        onChange={(e) => setEditingAdmin({ ...editingAdmin, address: { ...editingAdmin.address, street: e.target.value } })}
      />
    </div>
    <div className="form-group">
      <label>Update Password (Optional)</label>
      <input
        type="password"
        value={editingAdmin?.password || ''}
        onChange={(e) => setEditingAdmin({ ...editingAdmin, password:e.target.value})}
      />
    </div>

  

    <div className="form-group">
      <label>Employment</label>
      <Radio.Group
        onChange={(e) => setEditingAdmin({ ...editingAdmin, isEmployee: e.target.value === 'employed' })}
        value={editingAdmin?.isEmployee ? 'employed' : 'unemployed'}
      >
        <Radio value="unemployed">Unemployed</Radio>
        <Radio value="employed">Employed</Radio>        
      </Radio.Group>
    </div>

  <div className="form-group">
      <label>Status</label>
      <Radio.Group
        onChange={(e) => setEditingAdmin({ ...editingAdmin, status: e.target.value })}
        value={editingAdmin?.status || 'INACTIVE'}
      >
        <Radio value="ACTIVE">Active</Radio>
        <Radio value="INACTIVE">Inactive</Radio>
      </Radio.Group>
    </div>

  </form>
</Modal>
    </>
  );
}

export default AddAdmin;
