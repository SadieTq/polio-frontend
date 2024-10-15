import React, { useState, useEffect } from 'react';
import { Button, Select, message, Spin, Table, Divider, Input, Radio } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

function AddDivisionalManager() {
  const [UcmoList, setUcmoList] = useState([]); // State for Ucmo list
  const [loading, setLoading] = useState(false);
  const [selectedUcmo, setSelectedUcmo] = useState(null); // UCMO ID
  const [gender, setGender] = useState('MALE'); // State for gender radio buttons
  const [isEmployee, setIsEmployee] = useState(true); // State for employment status radio buttons
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cnic: '',
    phone: '',
    address: '',
  });

  const [UcmoData, setUcmoData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [filteredData, setFilteredData] = useState([]); // Filtered data for table

  // Function to fetch the list of Ucmos (UCMOs)
 

  // Fetch Ucmo data on component mount and after form submission
  const fetchUcmoData = async () => {
    try {
      const response = await fetch('https://survey.al-mizan.store/api/users/all-ucmo');
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

 

  // Function to submit the form and send data to the API
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      address: {
        street: formData.address,
      },
      gender: gender,  // Include gender
      isEmployee: isEmployee

      
    };

    try {
      const response = await fetch('https://survey.al-mizan.store/api/users/add-umco', {
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
          email: '',
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
          <label>Email (Optional)</label>
          <input
            type="email"
            name="email"
            placeholder="e.g. xyz@example.com"
            value={formData.email}
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
  </>
  );
}

export default AddDivisionalManager;
