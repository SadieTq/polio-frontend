import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  message,
  Spin,
  Table,
  Divider,
  Input,
  Radio,
  Tooltip,
  Modal,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FaEdit } from "react-icons/fa";

const { Option } = Select;

function AddAIC() {
  const [aicList, setAicList] = useState([]); // State for AIC list
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [selectedAic, setSelectedAic] = useState(null); // UCMO ID
  const [gender, setGender] = useState("MALE"); // State for gender toggle
  const [isEmployee, setIsEmployee] = useState(true); // State for employment status toggle
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cnic: "",
    phone: "",
  });

  const [aicData, setAicData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredData, setFilteredData] = useState([]); // Filtered data for table
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null); // Holds the admin data to edit
  const userID = localStorage.getItem("id");
  // Function to fetch the list of AICs (UCMOs)
  const fetchAICs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://110.38.226.9:4000/api/users/all-ucmo"
      );
      const data = await response.json();
      setAicList(data.body);
      setLoading(false);
    } catch (error) {
      // message.error("Failed to fetch UCMO list");
      setLoading(false);
    }
  };

  // Fetch AIC data on component mount and after form submission
  const fetchAicData = async () => {
    setLoading1(true);
    try {
      const response = await fetch(
        "http://110.38.226.9:4000/api/users/all-aic"
      );
      const data = await response.json();
      setAicData(data.body); // Assuming the data is in the body field
      setFilteredData(data.body); // Initialize filteredData to the full dataset
    } catch (error) {
      // message.error("Failed to fetch AIC data");
    } finally {
      setLoading1(false); // Stop loading spinner
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
    setSelectedAic(value); // Update the state used for the form submission
    setEditingAdmin((prevAdmin) => ({
      ...prevAdmin,
      ucmo: value, // Store the selected UCMO ID in editingAdmin state
    }));
  };

  const showEditModal = (admin) => {
    setEditingAdmin(admin); // Set the selected admin data
    setIsEditModalVisible(true); // Show the modal
  };

  // Function to submit the form and send data to the API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAic) {
      message.error("Please select a UCMO");
      return; // Exit the function if validation fails
    }

    const payload = {
      ...formData,

      gender: gender, // Include gender
      isEmployee: isEmployee, // Include employment status
      qualifications: [],
      ucmo: selectedAic, // Send selected UCMO ID
      createdBy: userID,
    };

    try {
      const response = await fetch(
        "http://110.38.226.9:4000/api/users/add-aic",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        message.success("AIC added successfully");

        // Clear the form and dropdown after successful submission
        setFormData({
          firstName: "",
          lastName: "",
          cnic: "",
          phone: "",
        });
        setSelectedAic(null); // Clear the UCMO dropdown selection
        setGender("MALE"); // Reset gender to default
        setIsEmployee(true); // Reset employment status to default

        // Fetch updated AIC data to refresh the table
        fetchAicData();
      } else {
        message.error("Failed to add AIC");
      }
    } catch (error) {
      message.error("An error occurred while adding AIC");
    }
  };
  const handleUpdate = async () => {
    const payload = {
      ucmo: editingAdmin.ucmo, // UCMO ID from selected option
      firstName: editingAdmin.firstName,
      lastName: editingAdmin.lastName,
      phone: editingAdmin.phone,

      status: editingAdmin.status,
      isEmployee: editingAdmin.isEmployee,
      updatedBy: userID,
      password: editingAdmin.password,
    };

    try {
      const response = await fetch(
        `http://110.38.226.9:4000/api/users/${editingAdmin._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        message.success("Admin updated successfully!");
        fetchAicData(); // Refresh admin data
        setIsEditModalVisible(false); // Close the modal
      } else {
        message.error("Failed to update admin: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while updating the admin.");
    }
  };

  // Handle search input change and filter the data
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    // Filter aicData by both firstName and cnic
    const filtered = aicData.filter(
      (item) =>
        item.firstName.toLowerCase().includes(value) ||
        item.cnic.toLowerCase().includes(value)
    );

    setFilteredData(filtered);
  };

  // Columns for the AIC Table
  const aicColumns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastname",
    },
    {
      title: "CNIC",
      dataIndex: "cnic",
      key: "cnic",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Created By",
      dataIndex: ["createdBy", "firstName"],
      key: "createdby",
    },
    {
      title: "Updated By",
      dataIndex: ["updatedBy", "firstName"],
      key: "createdby",
    },
    {
      title: "Reporting To",
      dataIndex: ["ucmoDetails", "firstName"],
      key: "createdby",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <div style={{ marginLeft: 17 }}>
            <Tooltip title="Edit">
              <FaEdit
                style={{ marginRight: "10px", cursor: "pointer" }}
                onClick={() => showEditModal(record)}
              />
            </Tooltip>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="form-container">
        <h2>Add AIC</h2>
        <p>Fill in the details below:</p>
        <form onSubmit={handleSubmit}>
          <div className="select-container-team">
            <div className="select-group-team">
              <div className="form-group">
                <label>
                  Select UCMO<span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  showSearch
                  placeholder="Select UCMO"
                  style={{ width: "83%" }}
                  onFocus={fetchAICs} // Trigger API call when dropdown is focused
                  value={selectedAic} // Bind the selected value to the dropdown
                  loading={loading}
                  onChange={handleSelectAIC} // Correctly handle selection
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  notFoundContent={loading ? <Spin size="small" /> : "No data"}
                >
                  {aicList.map((aic) => (
                    <Option key={aic._id} value={aic._id}>
                      {aic.firstName}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="select-group-team">
              <div className="form-group">
                <label>
                  First Name<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="e.g. Saad"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="select-container-team">
            <div className="select-group-team">
              <div className="form-group">
                <label>
                  AIC CNIC<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="cnic"
                  placeholder="e.g. 1234512345678"
                  value={formData.cnic}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="select-group-team">
              <div className="form-group">
                <label>
                  Last Name<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="e.g. Tariq"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="select-container-team">
            <div className="select-group-team">
              <div className="form-group">
                <label>
                  Mobile No<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="e.g. 03001234567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="select-group-team"></div>
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

          <Button type="primary" htmlType="submit">
            Add AIC
          </Button>
        </form>
      </div>

      <Divider style={{ marginTop: "20px" }} />

      <div className="form-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>AIC Details</h3>
          <Input
            placeholder="Search by First Name Or CNIC"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: 300 }}
          />
        </div>
        <Spin spinning={loading1}>
          <Table
            dataSource={filteredData}
            columns={aicColumns}
            rowKey="_id"
            pagination={{ pageSize: 7 }}
          />
        </Spin>
      </div>

      <Modal
        title="Edit AIC"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        width={600} // Set a fixed width for the modal
        bodyStyle={{ maxHeight: "55vh", overflowY: "auto" }} // Set max height and enable vertical scroll
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
            <label>Select UCMO</label>
            <Select
              showSearch
              placeholder="Select UCMO"
              style={{ width: "42%" }}
              onFocus={fetchAICs}
              value={editingAdmin?.ucmo} // Bind to editingAdmin.ucmo
              loading={loading}
              onChange={handleSelectAIC} // Use handleSelectAIC to store the selected UCMO ID
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              notFoundContent={loading ? <Spin size="small" /> : "No data"}
            >
              {aicList.map((aic) => (
                <Option key={aic._id} value={aic._id}>
                  {aic.firstName}
                </Option>
              ))}
            </Select>
          </div>
          <div className="form-group"></div>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={editingAdmin?.firstName || ""}
              onChange={(e) =>
                setEditingAdmin({ ...editingAdmin, firstName: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={editingAdmin?.lastName || ""}
              onChange={(e) =>
                setEditingAdmin({ ...editingAdmin, lastName: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Mobile No</label>
            <input
              type="text"
              value={editingAdmin?.phone || ""}
              onChange={(e) =>
                setEditingAdmin({ ...editingAdmin, phone: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Update Password (Optional)</label>
            <input
              type="password"
              value={editingAdmin?.password || ""}
              onChange={(e) =>
                setEditingAdmin({ ...editingAdmin, password: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Employment</label>
            <Radio.Group
              onChange={(e) =>
                setEditingAdmin({
                  ...editingAdmin,
                  isEmployee: e.target.value === "employed",
                })
              }
              value={editingAdmin?.isEmployee ? "employed" : "unemployed"}
            >
              <Radio value="unemployed">Unemployed</Radio>
              <Radio value="employed">Employed</Radio>
            </Radio.Group>
          </div>

          <div className="form-group">
            <label>Status</label>
            <Radio.Group
              onChange={(e) =>
                setEditingAdmin({ ...editingAdmin, status: e.target.value })
              }
              value={editingAdmin?.status || "INACTIVE"}
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

export default AddAIC;
