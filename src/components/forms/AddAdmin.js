import React, { useState, useEffect } from "react";
import {
  Button,
  message,
  Table,
  Divider,
  Input,
  Radio,
  Tooltip,
  Modal,
  Spin,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FaEdit } from "react-icons/fa";

function AddAdmin() {
  const [cnic, setCnic] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("MALE");
  const [isEmployee, setIsEmployee] = useState(true); // Default value true (Employed)
  const [adminData, setAdminData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering
  const [filteredData, setFilteredData] = useState([]); // Filtered data for the table

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null); // Holds the admin data to edit

  const userID = localStorage.getItem("id");

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://110.38.226.9:4000/api/users/all-admin"
      );
      const data = await response.json();
      setAdminData(data.body); // Set initial data
      setFilteredData(data.body); // Set filtered data as full dataset initially
    } catch (error) {
      // message.error("Failed to fetch Admin data");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  useEffect(() => {
    fetchAdminData(); // Fetch data on component mount
  }, []);

  useEffect(() => {
    // Filter admin data based on the search term for both firstName and cnic
    const filtered = adminData.filter(
      (admin) =>
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

      gender, // MALE or FEMALE
      isEmployee, // true or false
      createdBy: userID,
    };

    try {
      // POST request to API
      const response = await fetch(
        "http://110.38.226.9:4000/api/users/add-admin",
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
        message.success("Admin added successfully!");

        // Clear the form
        setCnic("");
        setFirstName("");
        setLastName("");
        setMobileNo("");

        // Refresh the admin data after adding a new one
        fetchAdminData();
      } else {
        message.error("Failed to add Admin: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while adding the Admin.");
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
        fetchAdminData(); // Refresh admin data
        setIsEditModalVisible(false); // Close the modal
      } else {
        message.error("Failed to update Admin: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while updating the Admin.");
    }
  };

  // Columns for the Admin Table
  const adminColumns = [
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
      dataIndex: ["createdBy", "firstName"],
      key: "createdby",
    },
    {
      title: "Updated By",
      dataIndex: ["updatedBy", "firstName"],
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
        <h2>Add Admin</h2>
        <p>Fill in the details below:</p>
        <form onSubmit={handleSubmit}>
          <div className="select-container-team">
            <div className="select-group-team">
              <div className="form-group">
                <label>
                  Admin CNIC<span style={{ color: "red" }}>*</span>
                </label>
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
                <label>First Name<span style={{ color: "red" }}>*</span></label>
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
                <label>Mobile No<span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  placeholder="e.g. 03001234567"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="select-group-team">
              <div className="form-group">
                <label>Last Name<span style={{ color: "red" }}>*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Tariq"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="select-container-team">
            <div className="select-group-team"></div>
          </div>

          <div className="form-group">
            <label>Gender</label>
            <Radio.Group
              onChange={(e) => setGender(e.target.value)}
              value={gender}
              
            >
              <Radio value="MALE">Male</Radio>
              <Radio value="FEMALE">Female</Radio>
            </Radio.Group>
          </div>

          {/* Employment Status Toggle */}
          <div className="form-group">
            <label>Employment Status</label>
            <Radio.Group
              onChange={(e) => setIsEmployee(e.target.value === "employed")}
              value={isEmployee ? "employed" : "unemployed"}
             
            >
              <Radio value="employed">Employed</Radio>
              <Radio value="unemployed">Unemployed</Radio>
            </Radio.Group>
          </div>

          <Button type="primary" htmlType="submit">
            Add Admin
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
        <Spin spinning={loading}>
          <Table
            dataSource={filteredData}
            columns={adminColumns}
            rowKey="_id"
            pagination={{ pageSize: 7 }}
          />
        </Spin>
      </div>

      <Modal
        title="Edit Admin"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        width={600}
        bodyStyle={{ maxHeight: "55vh", overflowY: "auto" }}
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
            <label>First Name<span style={{ color: "red" }}>*</span></label>
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
            <label>Last Name<span style={{ color: "red" }}>*</span></label>
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
            <label>Mobile No<span style={{ color: "red" }}>*</span></label>
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

export default AddAdmin;
