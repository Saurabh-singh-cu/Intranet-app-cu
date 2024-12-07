import React, { useState, useEffect } from "react";
import { message, Modal, notification, Select, Spin, Switch } from "antd";
import axios from "axios";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Drawer, Button } from "antd";
import { BiSolidUserDetail } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import { BiSolidEdit } from "react-icons/bi";

import "./Users.css";

const MyFormComponent = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [inputData, setInputData] = useState({});
  const [tableData, setTableData] = useState([]);
  const [entityData, setEntityData] = useState([]);
  const [permissionData, setPermissionData] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [roles, setRoles] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [titles, setTitles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleSession, setIsModalVisibleSession] = useState(false);
  const [loading, setloading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [switchState, setSwitchState] = useState(false);

  const apiUrls = {
    "entity-types": "http://13.202.65.103/intranetapp/entity-types/",
    roles_permissions:
      "http://13.202.65.103/intranetapp/roles_permissions/",
    roles: "http://13.202.65.103/intranetapp/roles/",
    departments: "http://13.202.65.103/intranetapp/departments/",
    sessions: "http://13.202.65.103/intranetapp/sessions/",
    genders: "http://13.202.65.103/intranetapp/genders/",
    title: "http://13.202.65.103/intranetapp/title/",
    designation: "http://13.202.65.103/intranetapp/designation/",
    user_create: "http://13.202.65.103/intranetapp/user_create/",
    user_table: "http://13.202.65.103/intranetapp/user_table/",
    current_session: "http://13.202.65.103/intranetapp/current_session/",
  };

  useEffect(() => {
    setInputData({});

    if (selectedValue === "roles_permissions") {
      fetchEntityData();
      fetchPermissionData();
    } else if (selectedValue === "roles") {
      fetchPermissionData();
    }
  }, [selectedValue]);
  useEffect(() => {
    setInputData({});

    if (selectedValue === "roles") {
      fetchEntityData();
      fetchPermissionData();
    } else if (selectedValue === "roles") {
      fetchPermissionData();
    }
  }, [selectedValue]);

  useEffect(() => {
    if (selectedValue === "user_create") {
      fetchRoles();
      fetchDesignations();
      fetchTitles();
      fetchGenders();
      fetchDepartments();
      fetchUser();
    }
  }, [selectedValue]);

  useEffect(() => {
    fetchPermissionData();
  }, []);

  const fetchRoles = async () => {
    setloading(true);
    try {
      const response = await axios.get(apiUrls["roles"]);
      setRoles(response.data);
      console.log(response.data, "role");
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setloading(false);
    }
  };

  const fetchDesignations = async () => {
    setloading(true);
    try {
      const response = await axios.get(apiUrls["designation"]);
      setDesignations(response.data);
      console.log(response.data, "desig");
    } catch (error) {
      console.error("Error fetching designations:", error);
    } finally {
      setloading(false);
    }
  };

  const fetchTitles = async () => {
    setloading(true);
    try {
      const response = await axios.get(apiUrls["title"]);
      setTitles(response.data);
      console.log(response.data, "title");
    } catch (error) {
      console.error("Error fetching titles:", error);
    } finally {
      setloading(false);
    }
  };

  const fetchGenders = async () => {
    setloading(true);
    try {
      const response = await axios.get(apiUrls["genders"]);
      setGenders(response.data);
      console.log(response.data, "gender");
    } catch (error) {
      console.error("Error fetching genders:", error);
    } finally {
      setloading(false);
    }
  };

  const fetchDepartments = async () => {
    setloading(true);
    try {
      const response = await axios.get(apiUrls["departments"]);
      setDepartments(response.data);
      console.log(response.data, "depart");
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setloading(false);
    }
  };

  const fetchEntityData = async () => {
    setloading(true);
    try {
      const response = await axios.get(apiUrls["entity-types"]);
      console.log(response, "ENTITY DATA");
      setEntityData(response.data);
    } catch (error) {
      console.error("Error fetching entity data:", error);
    } finally {
      setloading(false);
    }
  };

  const fetchPermissionData = async () => {
    setloading(true);
    try {
      const response = await axios.get(apiUrls["roles_permissions"]);
      setPermissionData(response.data);
      console.log("permissionsAAAA", response?.data);
    } catch (error) {
      console.error("Error fetching permission data:", error);
    } finally {
      setloading(false);
    }
  };
  const fetchUser = async () => {
    setloading(true);
    try {
      const response = await axios.get(apiUrls["user_create"]);
      setUsers(response.data);
      console.log(response.data, "USERS");
    } catch (error) {
      console.error("Error fetching permission data:", error);
    } finally {
      setloading(false);
    }
  };

  const handleSelectChange = (e) => {
    setSelectedValue(e.target.value);
    setInputData({});
    fetchTableData(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };
  const handleInputChange1 = (name, value) => {
    setInputData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = apiUrls[selectedValue];
      let payload = { ...inputData };

      if (selectedValue === "roles" && payload.roles_permissions) {
        payload.permission_id = payload.roles_permissions;
        delete payload.roles_permissions;
      }

      if (editMode !== null) {
        await axios.put(`${apiUrl}${editMode}/`, inputData); // Edit action
        notification.success({
          message: "Success",
          description: "Data updated successfully!",
          style: { backgroundColor: "#88C273" }, // Green color
        });
      } else {
        await axios.post(apiUrl, inputData);
        notification.success({
          message: "Success",
          description: "Data submitted successfully!",
          style: { backgroundColor: "#88C273" },
        });
      }
      fetchTableData(selectedValue);
      setEditMode(null);
      setInputData({});
    } catch (error) {
      console.error("Error submitting data:", error);
      notification.error({
        message: "Error",
        description: `${error?.message}`,
      });
    }
  };
  const handleRolesSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = apiUrls.roles;
      const payload = {
        role_name: inputData.role_name,
        permission_id: inputData.roles_permissions,
        status: inputData.status,
      };

      if (editMode !== null) {
        await axios.put(`${apiUrl}${editMode}/`, payload);
        notification.success({
          message: "Success",
          description: "Role updated successfully!",
          style: { backgroundColor: "#88C273" },
        });
      } else {
        await axios.post(apiUrl, payload);
        notification.success({
          message: "Success",
          description: "Role created successfully!",
          style: { backgroundColor: "#88C273" },
        });
      }
      fetchTableData("roles");
      setEditMode(null);
      setInputData({});
    } catch (error) {
      console.error("Error submitting role data:", error);
      notification.error({
        message: "Error",
        description: `${error?.message}`,
      });
    }
  };
  const handleDepartmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = apiUrls.roles;
      const payload = {
        dept_id: inputData.department,
        desig_id: inputData.desig_id,
        emp_code: inputData.emp_code,
        gender: inputData.gender,
        password: inputData.password,
        status: inputData.status,
        title_id: inputData.title_id,
        user_email: inputData.user_email,
        user_mobile: inputData.user_mobile,
        user_name: inputData.user_name,
        user_role: inputData.user_role,
        username: inputData.username
      };
  
      if (editMode !== null) {
        await axios.put(`${apiUrl}${editMode}/`, payload);
        notification.success({
          message: "Success",
          description: "User updated successfully!",
          style: { backgroundColor: "#88C273" },
        });
      } else {
        await axios.post(apiUrl, payload);
        notification.success({
          message: "Success",
          description: "User created successfully!",
          style: { backgroundColor: "#88C273" },
        });
      }
  
      fetchTableData("roles");
      setEditMode(null);
      setInputData({});
    } catch (error) {
      console.error("Error submitting role data:", error);
      notification.error({
        message: "Error",
        description: `${error?.message}`,
      });
    }
  };
  

  const fetchTableData = async (value) => {
    setloading(true);
    try {
      const apiUrl = apiUrls[value];
      const response = await axios.get(apiUrl);
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    } finally {
      setloading(false);
    }
  };

  const handleEdit = (item) => {
    setEditMode(item.id);
    const idField = getIdFieldName();
    if (item[idField]) {
      setEditMode(item[idField]);
      setInputData(item);
    } else {
      console.error(`No ${idField} found for this item.`);
    }
    if (selectedValue === "user_create") {
      setInputData({
        user_role: item.user_role,
        desig_id: item.designation_name,
        title_id: item.title_name,
        department: item.department_name,
        user_name: item.user_name,
        username: item.username,
        user_email: item.user_email,
        emp_code: item.emp_code,
        user_mobile: item.user_mobile,
        gender: item.gender_name,
        password: item.password,
      });
      setEditMode(item.id);
    }
  };

  const handleDelete = async (item) => {
    const idField = getIdFieldName();
    if (item[idField]) {
      try {
        const apiUrl = apiUrls[selectedValue];
        await axios.delete(`${apiUrl}${item[idField]}/`);
        fetchTableData(selectedValue);
        notification.success({
          message: "Success",
          description: "Data deleted successfully!",
          style: { backgroundColor: "#E85C0D" },
        });
      } catch (error) {
        console.error(`Error deleting ${selectedValue}:`, error);
        notification.error({
          message: "Error",
          description: "Failed to delete the data. Please try again.",
        });
      }
    } else {
      console.error(`No ${idField} found for this item.`);
      notification.error({
        message: "Error",
        description: "Invalid ID. Could not delete the data.",
      });
    }
  };

  const getFieldName = () => {
    switch (selectedValue) {
      case "entity-types":
        return {
          field1: "entity_name",
          field2: "status",
          extraField1: "entity_guide",
        };
      case "roles_permissions":
        return { field1: "permission_name", field2: "status" };
      case "roles":
        return { field1: "role_name", field2: "status" };
      case "departments":
        return { field1: "dept_name", field2: "dept_status" };
      case "genders":
        return { field1: "gender_name", field2: "gender_status" };
      case "title":
        return { field1: "title_name", field2: "title_status" };
      case "designation":
        return { field1: "desig_name", field2: "desig_status" };
      case "user_create":
        return { field2: "status" };
      case "sessions":
        return {
          field1: "start_year",
          field2: "end_year",
          extraField1: "start_month",
          extraField2: "end_month",
        };
      default:
        return {};
    }
  };

  const getIdFieldName = () => {
    switch (selectedValue) {
      case "entity-types":
        return "entity_id";
      case "roles_permissions":
        return "permission_id";
      case "roles":
        return "role_id";
      case "departments":
        return "dept_id";
      case "genders":
        return "gender_id";
      case "title":
        return "title_id";
      case "designation":
        return "desig_id";
      case "sessions":
        return "session_id";
      case "create_user":
        return "id";
      case "user_table":
        return "id";
      default:
        return "";
    }
  };
  const {
    field1,
    field2,
    extraField,
    extraField1,
    extraField2,
    extraField3,
    field4,
  } = getFieldName();

  const showDrawer = (user) => {
    setSelectedUser(user);
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const showDeleteConfirm = (userId) => {
    setUserToDelete(userId);
    setIsModalVisible(true);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (editMode) {
      const apiUrl = apiUrls["user_table"];
      try {
        await axios.put(`${apiUrl}${editMode}/`, inputData);
        notification.success({
          message: "Success",
          description: "User updated successfully!",
          style: { backgroundColor: "#88C273" },
        });
        fetchTableData("user_create");
        setEditMode(null);
        setInputData({});
      } catch (error) {
        console.error("Error updating user:", error);
        notification.error({
          message: "Error",
          description: `Failed to update user: ${error.message}`,
        });
      }
    } else {
      console.log("Not in edit mode");
    }
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      const apiUrl = apiUrls["user_table"];
      try {
        await axios.delete(`${apiUrl}${userToDelete}/`);
        notification.success({
          message: "Success",
          description: "User deleted successfully!",
          style: { backgroundColor: "#88C273" },
        });
        fetchTableData("user_create");
        setUserToDelete(null);
        setIsModalVisible(false);
      } catch (error) {
        console.error("Error deleting user:", error);
        notification.error({
          message: "Error",
          description: `Failed to delete user: ${error.message}`,
        });
      }
    }
  };

  const handleSwitchClick = (item) => {
    setSelectedItem(item);
    setIsModalVisibleSession(true);
    setIsModalVisibleSession(true);
  };

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      duration: 3,
    });
  };

  const confirmActivation = async () => {
    if (selectedItem) {
      try {
        const data = {
          session_code: selectedItem?.session_code,
        };
        const config = {
          method: "POST",
          url: "http://13.202.65.103/intranetapp/current_session/",
          data,
        };
        const response = await axios(config);

        openNotification("success", response?.data?.message);
      } catch (error) {
        console.error("Error activating session:", error);
      } finally {
        setIsModalVisibleSession(false);
        setSelectedItem(null);
      }
    }
  };

  const handleCancelActivation = () => {
    setIsModalVisibleSession(false);
    setSwitchState(false);
  };

  return (
    <>
      <div className="my-form-component">
        <div className="form-container">
          <h2
            style={{
              fontSize: "15px",
              marginBottom: "15px",
              color: "black",
              fontWeight: "300",
            }}
          >
            {" "}
            User Configuration
          </h2>
          <select
            value={selectedValue}
            onChange={handleSelectChange}
            className="custom-select"
          >
            <option value="">Select an Option</option>
            <option value="entity-types">Entity Name</option>
            <option value="roles_permissions">Roles & Permissions</option>
            <option value="roles">Roles</option>
            <option value="departments">Departments</option>
            <option value="sessions">Sessions</option>
            <option value="genders">Genders</option>
            <option value="title">Title</option>
            <option value="designation">Designation</option>
            <option value="user_create">Create User</option>
          </select>
          {/* onSubmit={handleSubmit} */}
          {selectedValue && (
            <form className="custom-form">
              {selectedValue === "sessions"
                ? null
                : field1 && (
                    <input
                      type="text"
                      name={field1}
                      value={inputData[field1] || ""}
                      onChange={handleInputChange}
                      placeholder={`Enter ${field1}`}
                      className="custom-input"
                    />
                  )}

              {selectedValue === "entity-types" && (
                <textarea
                  type="text"
                  name={extraField1}
                  value={inputData[extraField1] || ""}
                  onChange={handleInputChange}
                  placeholder={`Enter ${extraField1}`}
                  className="custom-input"
                />
              )}

              {selectedValue === "roles_permissions" && (
                <select
                  name="entity"
                  value={inputData["entity"] || ""}
                  onChange={handleInputChange}
                  className="custom-select"
                >
                  <option value="">Select Entity</option>
                  {entityData.map((entity) => (
                    <option key={entity.entity_id} value={entity.entity_id}>
                      {entity.entity_name}
                    </option>
                  ))}
                </select>
              )}

              {selectedValue === "roles" && (
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Select Permissions"
                  value={inputData.roles_permissions || []}
                  onChange={(value) =>
                    handleInputChange1("roles_permissions", value)
                  }
                  optionFilterProp="children"
                >
                  {permissionData.map((entity) => (
                    <Select.Option
                      key={entity.permission_id}
                      value={entity.permission_id}
                    >
                      {entity.permission_name} || {entity.entity_name}
                    </Select.Option>
                  ))}
                </Select>
              )}
              {field2 && (
                <select
                  name={field2}
                  value={inputData[field2] || ""}
                  onChange={handleInputChange}
                  className="custom-select"
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              )}
              {selectedValue === "sessions" && field2 && (
                <>
                  <select
                    name="start_year"
                    value={inputData.start_year || ""}
                    onChange={handleInputChange}
                    className="custom-select"
                  >
                    <option value="">Select Start Year</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>

                  <select
                    name="end_year"
                    value={inputData.end_year || ""}
                    onChange={handleInputChange}
                    className="custom-select"
                  >
                    <option value="">Select End Year</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>

                  <select
                    name="start_month"
                    value={inputData.start_month || ""}
                    onChange={handleInputChange}
                    className="custom-select"
                  >
                    <option value="">Select Start Month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                  <select
                    name="end_month"
                    value={inputData.end_month || ""}
                    onChange={handleInputChange}
                    className="custom-select"
                  >
                    <option value="">Select End Month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </>
              )}
              {selectedValue === "user_create" && (
                <form onSubmit={handleSubmit} className="custom-form">
                  <div>
                    <select
                      name="user_role"
                      value={inputData["user_role"] || ""}
                      onChange={handleInputChange}
                      className="custom-select"
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.role_id} value={role.role_id}>
                          {role.role_name}
                        </option>
                      ))}
                    </select>

                    <select
                      name="desig_id"
                      value={inputData["desig_id"] || ""}
                      onChange={handleInputChange}
                      className="custom-select"
                    >
                      <option value="">Select Designation</option>
                      {designations.map((desig) => (
                        <option key={desig.desig_id} value={desig.desig_id}>
                          {desig.desig_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      name="title_id"
                      value={inputData["title_id"] || ""}
                      onChange={handleInputChange}
                      className="custom-select"
                    >
                      <option value="">Select Title</option>
                      {titles.map((title) => (
                        <option key={title.title_id} value={title.title_id}>
                          {title.title_name}
                        </option>
                      ))}
                    </select>

                    <select
                      name="dept_id"
                      value={inputData["dept_id"] || ""}
                      onChange={handleInputChange}
                      className="custom-select"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.dept_id} value={dept.dept_id}>
                          {dept.dept_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="user_name"
                      value={inputData["user_name"] || ""}
                      onChange={handleInputChange}
                      placeholder="Enter Full Name"
                      className="custom-input"
                    />
                    <input
                      type="text"
                      name="username"
                      value={inputData["username"] || ""}
                      onChange={handleInputChange}
                      placeholder="Enter Unique Name"
                      className="custom-input"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      name="user_email"
                      value={inputData["user_email"] || ""}
                      onChange={handleInputChange}
                      placeholder="Enter Email"
                      className="custom-input"
                    />
                    <input
                      type="text"
                      name="emp_code"
                      value={inputData["emp_code"] || ""}
                      onChange={handleInputChange}
                      placeholder="Enter Employee Code"
                      className="custom-input"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      name="user_mobile"
                      value={inputData["user_mobile"] || ""}
                      onChange={handleInputChange}
                      placeholder="Enter Mobile Number"
                      className="custom-input"
                    />
                    <select
                      name="gender"
                      value={inputData["gender"] || ""}
                      onChange={handleInputChange}
                      className="custom-select"
                    >
                      <option value="">Select Gender</option>
                      {genders.map((gender) => (
                        <option key={gender.gender_id} value={gender.gender_id}>
                          {gender.gender_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={inputData["password"] || ""}
                    onChange={handleInputChange}
                    placeholder="Enter Password"
                    className="custom-input"
                  />
                </form>
              )}
              {editMode && selectedValue === "user_create" ? (
                <>
                  {" "}
                  <button
                    onClick={handleEditUser}
                    type="submit"
                    className="custom-btn submit-btn"
                  >
                    Update
                  </button>
                </>
              ) : selectedValue === "roles" ? (
                <button
                onClick={handleRolesSubmit }
                type="submit"
                className="custom-btn submit-btn"
              >
                Create Role
              </button>
              ) : selectedUser === "user_create" ? <button>Add User</button> : (
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="custom-btn submit-btn"
                >
                  Submit
                </button>
              )}
            </form>
          )}
        </div>

        <div className="table-container">
          <h2
            style={{
              fontSize: "15px",
              marginBottom: "15px",
              color: "black",
              fontWeight: "300",
            }}
          >
            {" "}
            Configuration Table
          </h2>
          {loading === true ? (
            <Spin size={40} spinning={loading} />
          ) : (
            <>
              {" "}
              {tableData.length > 0 && (
                <table className="custom-table">
                  <thead>
                    <tr>
                      {selectedValue === "user_create" && (
                        <th
                          style={{
                            color: "black",
                            fontWeight: "200",
                            fontSize: "14px",
                          }}
                        >
                          Name
                        </th>
                      )}
                      <th
                        style={{
                          color: "black",
                          fontWeight: "200",
                          fontSize: "14px",
                        }}
                      >
                        {field1}
                      </th>
                      {selectedValue === "roles_permissions" ? (
                        <th
                          style={{
                            color: "black",
                            fontWeight: "200",
                            fontSize: "14px",
                          }}
                        >
                          Entity Name
                        </th>
                      ) : null}

                      {field2 && (
                        <th
                          style={{
                            color: "black",
                            fontWeight: "200",
                            fontSize: "14px",
                          }}
                        >
                          {field2}
                        </th>
                      )}

                      <th
                        style={{
                          color: "black",
                          fontWeight: "200",
                          fontSize: "14px",
                        }}
                      >
                        Actions
                      </th>
                      {selectedValue === "sessions" ? (
                        <th
                          style={{
                            color: "black",
                            fontWeight: "200",
                            fontSize: "14px",
                          }}
                        >
                          Status
                        </th>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((item, index) => (
                      <tr key={index}>
                        {selectedValue === "user_create" && (
                          <td
                            style={{
                              color: "white",
                              fontWeight: "200",
                              fontSize: "14px",
                            }}
                          >
                            {item?.user_name}
                          </td>
                        )}
                        <td
                          style={{
                            color: "white",
                            fontWeight: "200",
                            fontSize: "14px",
                          }}
                        >
                          {item[field1]}
                        </td>
                        {selectedValue === "roles_permissions" ? (
                          <td>{item?.entity_name}</td>
                        ) : null}
                        {field2 && (
                          <td
                            style={{
                              color: "white",
                              fontWeight: "200",
                              fontSize: "14px",
                            }}
                          >
                            {item[field2]}
                          </td>
                        )}
                        {selectedValue === "sessions" ? (
                          <td>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Switch
                                type="checkbox"
                                checked={item.isActive}
                                onChange={() => handleSwitchClick(item)}
                                checkedChildren="ON"
                                unCheckedChildren="OFF"
                              />
                            </div>
                          </td>
                        ) : null}

                        {selectedValue === "user_create" && (
                          <td>
                            <div
                              style={{
                                color: "green",
                                fontSize: "20px",
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              type="primary"
                              onClick={() => showDrawer(item)}
                            >
                              <IoMdEye />
                            </div>
                          </td>
                        )}
                        {selectedValue !== "user_create" && (
                          <td
                            style={{
                              display: "flex",
                              gap: "10px",
                              justifyContent: "space-around",
                            }}
                          >
                            <div
                              style={{
                                color: "green",
                                fontSize: "20px",
                                cursor: "pointer",
                              }}
                              onClick={() => handleEdit(item)}
                            >
                              <FaRegEdit />
                            </div>
                            <div
                              style={{
                                color: "red",
                                fontSize: "20px",
                                cursor: "pointer",
                              }}
                              onClick={() => handleDelete(item)}
                            >
                              <MdDelete />
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
      <Drawer
        title="User Details"
        placement="right"
        onClose={onClose}
        visible={drawerVisible}
        width={400}
      >
        {selectedUser && (
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Field
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <strong>Full Name:</strong>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {selectedUser.user_name}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <strong>Email:</strong>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {selectedUser.user_email}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <strong>Mobile:</strong>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {selectedUser.user_mobile}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <strong>Department:</strong>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {selectedUser.department_name}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <strong>Designation:</strong>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {selectedUser.designation_name}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <strong>Role:</strong>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {selectedUser.user_role}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <strong>Employee Code:</strong>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {selectedUser.emp_code}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <strong>Status:</strong>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {selectedUser.status}
                  </td>
                </tr>
              </tbody>
            </table>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                background: "#bfbbbb",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "30px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                }}
                type="button"
                onClick={() => handleEdit(selectedUser)}
              >
                <BiSolidEdit />
              </div>
              <div
                style={{
                  fontSize: "30px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                }}
                type="button"
                onClick={() => showDeleteConfirm(selectedUser.id)}
              >
                <MdDelete />
              </div>
            </div>
          </div>
        )}
      </Drawer>
      <Modal
        title="Confirm Deletion"
        visible={isModalVisible}
        onOk={handleDeleteUser}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Are you sure you want to delete this user?</p>
      </Modal>
      {modalVisible && <div className="modal"></div>}
      <Modal
        title="Confirm Activation"
        visible={isModalVisibleSession}
        onOk={confirmActivation}
        onCancel={handleCancelActivation}
      >
        <p>Are you sure you want to make this session active?</p>
      </Modal>
    </>
  );
};

export default MyFormComponent;
