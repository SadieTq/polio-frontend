import React, { useState, useEffect } from 'react';
import { Button, Select, message, Spin, Table, Divider, Input, Radio, Modal, Tooltip  } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FaEdit } from 'react-icons/fa';

const { Option } = Select;

function AddUCMO() {
  const [UcmoList, setUcmoList] = useState([]); // State for Ucmo list
  const [loading, setLoading] = useState(false);
  const [selectedUcmo, setSelectedUcmo] = useState(null); // UCMO ID
  const [gender, setGender] = useState('MALE'); // State for gender radio buttons
  const [isEmployee, setIsEmployee] = useState(true); // State for employment status radio buttons
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cnic: '',
    phone: '',
    address: '',
  });

  const [UcmoData, setUcmoData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [filteredData, setFilteredData] = useState([]); // Filtered data for table
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null); // Holds the admin data to edit
  const userID = localStorage.getItem('id');
  // Function to fetch the list of Ucmos (UCMOs)
 

  // Fetch Ucmo data on component mount and after form submission
  const fetchUcmoData = async () => {
    try {
      const response = await fetch('http://203.161.43.125:4000/api/users/all-ucmo');
      const data = await response.json();
      setUcmoData(data.body); // Assuming the data is in the body field
      setFilteredData(data.body); // Initialize filteredData to the full dataset
    } catch (error) {
      message.error('Failed to fetch Ucmo data');
    }
  };

  useEffect(() => {
    fetchUcmoData(); // Fetch data on component mount
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const showEditModal = (admin) => {
    setEditingAdmin(admin); // Set the selected admin data
    setIsEditModalVisible(true); // Show the modal
  };
  
 

  // Function to submit the form and send data to the API
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      address: {
        street: formData.address,
      },
      gender: gender,  // Include gender
      isEmployee: isEmployee,
      createdBy: userID

      
    };

    try {
      const response = await fetch('http://203.161.43.125:4000/api/users/add-umco', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        message.success('Ucmo added successfully');

        // Clear the form and dropdown after successful submission
        setFormData({
          firstName: '',
          lastName: '',
          cnic: '',
          phone: '',
          address: '',
        });
        setSelectedUcmo(null); // Clear the UCMO dropdown selection
        setGender('MALE');  // Reset gender to default
        setIsEmployee(true);  // Reset employment status to default

        // Fetch updated Ucmo data to refresh the table
        fetchUcmoData();
      } else {
        message.error('Failed to add Ucmo');
      }
    } catch (error) {
      message.error('An error occurred while adding Ucmo');
    }
  };

  // Handle search input change and filter the data
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = UcmoData.filter(item =>
      item.firstName.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
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
      password:editingAdmin.password,
    };
  
    try {
      const response = await fetch(`http://203.161.43.125:4000/api/users/${editingAdmin._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        message.success('Admin updated successfully!');
        fetchUcmoData(); // Refresh admin data
        setIsEditModalVisible(false); // Close the modal
      } else {
        message.error('Failed to update admin: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred while updating the admin.');
    }
  };
  
  // Columns for the Ucmo Table
  const UcmoColumns = [
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

  return (<>
    <div className="form-container">
      <h2>Add UCMO</h2>
      <p>Fill in the details below:</p>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>UCMO CNIC</label>
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
          <label>Address (Optional)</label>
          <input
            type="text"
            name="address"
            placeholder="e.g. 123 Street Name"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <Radio.Group
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <Radio value="MALE">Male</Radio>
            <Radio value="FEMALE">Female</Radio>
          </Radio.Group>
        </div>

        {/* Employment Status Toggle */}
        <div className="form-group">
          <label>Employment Status</label>
          <Radio.Group
            value={isEmployee}
            onChange={(e) => setIsEmployee(e.target.value === true)}
          >
            <Radio value={true}>Employed</Radio>
            <Radio value={false}>Unemployed</Radio>
          </Radio.Group>
        </div>

        <Button type="primary" htmlType="submit">Add UCMO</Button>
      </form>
    </div>

    <Divider style={{ marginTop: '20px' }} />

    <div className="form-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>UCMO Details</h3>
        <Input
          placeholder="Search by First Name"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: 300 }}
        />
      </div>
      <Table
        dataSource={filteredData}
        columns={UcmoColumns}
        rowKey="_id" 
        pagination={{ pageSize: 7 }}
      />
    </div>

    <Modal
  title="Edit UCMO"
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

export default AddUCMO;
