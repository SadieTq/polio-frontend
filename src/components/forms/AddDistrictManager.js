import React, { useState, useEffect } from 'react';
import { Button, Select, message, Spin, Table, Divider, Input, Radio } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

function AddDivisionalManager() {
  const [aicList, setAicList] = useState([]); // For dropdown (AICs)
  const [loading, setLoading] = useState(false);
  const [selectedAic, setSelectedAic] = useState(null); // Selected AIC ID
  const [flwList, setFlwList] = useState([]); // For the table (FLWs)
  const [filteredFlwList, setFilteredFlwList] = useState([]); // Filtered table data
  const [gender, setGender] = useState('MALE'); // State for gender toggle
  const [isEmployee, setIsEmployee] = useState(true); // State for employment status toggle

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cnic: '',
    phone: '',
    address: '',
  });

  // Function to fetch AICs for the dropdown
  const fetchAics = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://survey.al-mizan.store/api/users/all-aic');
      const data = await response.json();
      setAicList(data.body);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch AIC list');
      setLoading(false);
    }
  };

  // Function to fetch FLWs for the table
  const fetchFlwsForTable = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://survey.al-mizan.store/api/users/all-flw');
      const data = await response.json();
      setFlwList(data.body);
      setFilteredFlwList(data.body); // Initialize the filtered list
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch FLW data');
      setLoading(false);
    }
  };

  // Fetch AICs (for the dropdown) and FLWs (for the table) on component mount
  useEffect(() => {
    fetchAics(); // Fetch AICs for dropdown
    fetchFlwsForTable(); // Fetch FLWs for the table
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle selection of AIC
  const handleSelectAic = (value) => {
    setSelectedAic(value); // The selected AIC's _id
  };

  // Function to submit the form and add a new FLW
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      address: {
        street: formData.address,
      },
      gender: gender,  // Include gender
      isEmployee: isEmployee,  // Include employment status
      qualifications: [],
      aic: selectedAic, // Selected AIC ID
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
        const newFlw = await response.json(); // Get the newly added FLW data from the response
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
        setSelectedAic(null); // Clear the AIC dropdown selection
        setGender('MALE');  // Reset gender to default
        setIsEmployee(true);  // Reset employment status to default

        // Update the FLW list for the table with the newly added FLW
        setFlwList((prevList) => [...prevList, newFlw.body]);
        setFilteredFlwList((prevList) => [...prevList, newFlw.body]); // Also update filtered list
      } else {
        message.error('Failed to add FLW');
      }
    } catch (error) {
      message.error('An error occurred while adding FLW');
    }
  };

  // Handle search input change for filtering the table data
  const handleSearch = (value) => {
    const filteredData = flwList.filter((flw) =>
      flw.firstName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredFlwList(filteredData);
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

  return (<>
    <div className="form-container">
      <h2>Add FLW</h2>
      <p>Fill in the details below:</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select AIC</label>
          <Select
          showSearch
            placeholder="Select AIC"
            style={{ width: '42%' }}
            value={selectedAic} // Bind the selected value to the dropdown
            loading={loading}
            onChange={handleSelectAic} // Handle selection change
            optionFilterProp="children"  // Ensures the search filters based on the displayed text
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={
              loading ? (
                <div className="spinner-container">
                  <Spin size="small" />
                </div>
              ) : 'No data'
            } // Show centered spinner while loading
          >
            {aicList.map(aic => (
              <Option key={aic._id} value={aic._id}>
                {aic.firstName}
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
  onChange={(e) => setIsEmployee(e.target.value)}
>
  <Radio value={true}>Employed</Radio>
  <Radio value={false}>Unemployed</Radio>
</Radio.Group>
        </div>


        <Button type="primary" htmlType="submit">Add FLW</Button>
      </form>


    </div>
      <Divider style={{ marginTop: '20px' }} />

    <div className="form-container">

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>FLW Details</h3>
        {/* Search input with SearchOutlined icon */}
        <Input
          placeholder="Search by first name"
          onChange={(e) => handleSearch(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
        />
      </div>
      <Table dataSource={filteredFlwList} columns={flwColumns} rowKey="_id"  pagination={{ pageSize: 7 }}/>

    </div>




    </>);
}

export default AddDivisionalManager;
