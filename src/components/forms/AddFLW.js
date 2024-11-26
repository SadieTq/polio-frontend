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
import { baseURL } from "../../apiConfig"

const { Option } = Select;

function AddFLW() {
  const [aicList, setAicList] = useState([]); // For dropdown (AICs)
  const [loading, setLoading] = useState(false);
  const [flwLoading, setFlwLoading] = useState(false);
  const [selectedAic, setSelectedAic] = useState(null); // Selected AIC ID
  const [flwList, setFlwList] = useState([]); // For the table (FLWs)
  const [filteredFlwList, setFilteredFlwList] = useState([]); // Filtered table data
  const [gender, setGender] = useState("MALE"); // State for gender toggle
  const [isEmployee, setIsEmployee] = useState(true); // State for employment status toggle
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [selectedModalAic, setSelectedModalAic] = useState(null);
  const userID = localStorage.getItem("id");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    cnic: "",
    phone: "",
  });

  // Function to fetch AICs for the dropdown
  const fetchAics = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/api/users/all-aic`
      );
      const data = await response.json();
      setAicList(data.body);
      
    } catch (error) {
      // message.error("Failed to fetch AIC list");
      setLoading(false);
    }
  };
  const showEditModal = (admin) => {
    setEditingAdmin(null); // Clear the previous data
    setEditingAdmin({ ...admin }); // Set the selected admin data to edit
    setSelectedModalAic(admin.aic || null); // Set the selected AIC for modal
    setIsEditModalVisible(true); // Show modal
  };
  // Function to fetch FLWs for the table
  const fetchFlwsForTable = async () => {
    setFlwLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/api/users/all-flw`
      );
      const data = await response.json();
      setFlwList(data.body);
      setFilteredFlwList(data.body); // Initialize the filtered list
     
    } catch (error) {
      // message.error("Failed to fetch FLW data");
    } finally {
      setFlwLoading(false); // Stop loading spinner
    }
  };

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
    setSelectedAic(value); // The selected AIC's _id for the Add FLW form
  };

  // In the modal, create a separate handler for the modal's AIC dropdown
  const handleSelectModalAic = (value) => {
    setSelectedModalAic(value); // The selected AIC's _id for the modal
    setEditingAdmin((prevAdmin) => ({
      ...prevAdmin,
      aic: value, // Update the selected AIC for the editing admin
    }));
  };

  // Function to submit the form and add a new FLW
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAic) {
      message.error("Please select AIC");
      return; // Exit the function if validation fails
    }

    const payload = {
      ...formData,
      gender: gender, // Include gender
      isEmployee: isEmployee, // Include employment status
      qualifications: [],
      aic: selectedAic, // Selected AIC ID
      createdBy: userID,
    };

    try {
      const response = await fetch(
        `${baseURL}/api/users/add-flw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (response.ok) {
        message.success("FLW added successfully");

        setEditingAdmin(null);
        setSelectedModalAic(null);
        setFormData({
          firstName: "",
          lastName: "",
          cnic: "",
          phone: "",
        });
        setSelectedAic(null); // Clear the AIC dropdown selection
        setGender("MALE"); // Reset gender to default
        setIsEmployee(true); // Reset employment status to default

        // Update the FLW list for the table with the newly added FLW
        fetchFlwsForTable();
      } else {
        message.error("Failed to add FLW: " + data.message);
      }
    } catch (error) {
      message.error("An error occurred while adding FLW");
    }
  };
  const handleUpdate = async () => {

    if (!editingAdmin.cnic || editingAdmin.cnic.length !== 13 || isNaN(editingAdmin.cnic)) {
      message.error("CNIC must be a 13-digit number.");
      return;
    }

    const payload = {
      aic: editingAdmin.aic,
      firstName: editingAdmin.firstName,
      lastName: editingAdmin.lastName,
      cnic: editingAdmin.cnic,
      phone: editingAdmin.phone,
      status: editingAdmin.status,
      isEmployee: editingAdmin.isEmployee,
      updatedBy: userID,
      password: editingAdmin.password,
    };

    try {
      const response = await fetch(
        `${baseURL}/api/users/${editingAdmin._id}`,
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
        message.success("FLW updated successfully!");
        fetchFlwsForTable(); // Refresh data
        setIsEditModalVisible(false); // Close modal
      } else {
        message.error("Failed to update FLW" + data.message);
      }
    } catch (error) {
      message.error("An error occurred while updating FLW");
    }
  };

  // Handle search input change for filtering the table data
  const handleSearch = (value) => {
    const filteredData = flwList.filter(
      (flw) =>
        flw.firstName.toLowerCase().includes(value.toLowerCase()) ||
        flw.cnic.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredFlwList(filteredData);
  };

  // Table columns for the FLW data
  const flwColumns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "firstName",
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
      dataIndex: ["createdBy", "firstName"], //Check object name when API is fixed
      key: "createdby",
    },
    {
      title: "Updated By",
      dataIndex: ["updatedBy", "firstName"],
      key: "updatedby",
    },
    {
      title: "Reporting To",
      dataIndex: ["aic", "firstName"],
      key: "reporting",
    },
    {
      title: "Team",
      key: "team",
      render: (text, record) => {
        
        return record.teams && record.teams.length > 0 && record.teams[0].aicDetails
          ? record.teams[0].teamName
          : "Not Assigned"; // 
      },
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
        <h2>Add FLW</h2>
        <p>Fill in the details below:</p>
        <form onSubmit={handleSubmit}>
          <div className="select-container-team">
            <div className="select-group-team">
              <div className="form-group">
                <label>Select AIC<span style={{ color: "red" }}>*</span></label>
                <Select
                  showSearch
                  placeholder="Select AIC"
                  style={{ width: "83%" }}
                  value={selectedAic} // Bind the selected value for the Add FLW form
                  loading={loading}
                  onChange={handleSelectAic} // Use handleSelectAic for the Add FLW form
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  notFoundContent={
                    loading ? (
                      <div className="spinner-container">
                        <Spin size="small" />
                      </div>
                    ) : (
                      "No data"
                    )
                  }
                >
                  {aicList.map((aic) => (
                    <Option key={aic._id} value={aic._id}>
                      {`${aic.firstName} ${aic.lastName}`}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="select-group-team">
              <div className="form-group">
                <label>First Name<span style={{ color: "red" }}>*</span></label>
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
                <label>FLW CNIC<span style={{ color: "red" }}>*</span></label>
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
                <label>Last Name<span style={{ color: "red" }}>*</span></label>
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
                <label>Mobile No<span style={{ color: "red" }}>*</span></label>
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
            Add FLW
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
          <h3>FLW Details</h3>
          {/* Search input with SearchOutlined icon */}
          <Input
            placeholder="Search by First Name Or CNIC"
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
        </div>
        <Spin spinning={flwLoading}>
          <Table
            dataSource={filteredFlwList}
            columns={flwColumns}
            rowKey="_id"
            pagination={{ pageSize: 7 }}
          />
        </Spin>
      </div>

      <Modal
        title="Edit FLW"
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingAdmin(null); // Clear the edit form
          setSelectedModalAic(null); // Clear selected AIC for modal
        }}
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
            <div className="form-group">
              <label>Select AIC</label>
              <Select
                showSearch
                placeholder="Select AIC"
                style={{ width: "42%" }}
                value={selectedModalAic || editingAdmin?.aic} // Bind the selected value for the modal
                loading={loading}
                onChange={handleSelectModalAic} // Use handleSelectModalAic for the modal
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                notFoundContent={
                  loading ? (
                    <div className="spinner-container">
                      <Spin size="small" />
                    </div>
                  ) : (
                    "No data"
                  )
                }
              >
                {aicList.map((aic) => (
                  <Option key={aic._id} value={aic._id}>
                    {`${aic.firstName} ${aic.lastName}`}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          <div className="form-group">
            <label>CNIC</label>
            <input
              type="text"
              value={editingAdmin?.cnic || ""}
              onChange={(e) =>
                setEditingAdmin({ ...editingAdmin, cnic: e.target.value })
              }
              required
            />
          </div>
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

export default AddFLW;
