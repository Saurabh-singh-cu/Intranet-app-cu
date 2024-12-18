import React, { useCallback, useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Drawer, Form, Input, Button, Modal, message, Tag } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import mail from "../../assets/images/mail.png";
import "./EntityTable.css";
import axios from "axios";

function RegisteredEntities() {
  const [entities, setEntities] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [mailDrawerVisible, setMailDrawerVisible] = useState(false);
  const [editingEntity, setEditingEntity] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [mailForm] = Form.useForm();
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([]);
  const navigate = useNavigate();
  const [viewMoreDrawerVisible, setViewMoreDrawerVisible] = useState(false);
  const [selectedEntityDetails, setSelectedEntityDetails] = useState(null);


  axios.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    axios.get("http://172.17.2.247:8080/intranetapp/entity-registration/")
      .then((response) => {
        setEntities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleEdit = useCallback(
    (params) => {
      setEditingEntity(params.data);
      form.setFieldsValue(params.data);
      setDrawerVisible(true);
    },
    [form]
  );

  const handleDelete = useCallback((params) => {
    console.log("Delete clicked for entity with ID:", params.data.reg_id);
    setEntities((prevEntities) =>
      prevEntities.filter((entity) => entity.reg_id !== params.data.reg_id)
    );
  }, []);

  const handleSendMail = useCallback(
    (params) => {
      setEditingEntity(params.data);
      mailForm.setFieldsValue({
        entity_request_id: params.data.reg_id,
      });
      setMailDrawerVisible(true);
    },
    [mailForm]
  );

  const onDrawerClose = () => {
    setDrawerVisible(false);
    setEditingEntity(null);
    form.resetFields();
  };

  const onMailDrawerClose = () => {
    setMailDrawerVisible(false);
    mailForm.resetFields();
    setEmails([]);
  };

  const onFinish = (values) => {
    console.log("Updated entity:", values);
    setEntities((prevEntities) =>
      prevEntities.map((entity) =>
        entity.reg_id === editingEntity.reg_id
          ? { ...entity, ...values }
          : entity
      )
    );
    onDrawerClose();
  };

  const onMailFinish = (values) => {
    Modal.confirm({
      title: "Are you sure you want to send emails?",
      onOk() {
        const payload = {
          ...values,
          receiver_emails: emails,
          user_id: user?.user_id || null,
        };
        axios
          .post("http://172.17.2.247:8080/intranetapp/send-email/", payload)

          .then((response) => {
            message.success("Email sent successfully");
            onMailDrawerClose();
          })
          .catch((error) => {
            console.error("Error sending email:", error);
            message.error("Failed to send email");
          });
      },
    });
  };

  const handleEmailInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.endsWith(",") || inputValue.endsWith(" ")) {
      const newEmail = inputValue.slice(0, -1).trim();
      if (isValidEmail(newEmail) && !emails.includes(newEmail)) {
        setEmails([...emails, newEmail]);
        e.target.value = "";
      }
    }
  };

  const isValidEmail = (email) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleView = (params) => {
    setEditingEntity(params.data);
    setViewModalVisible(true);
  };

  const handleViewMore = (params) => {
    setSelectedEntityDetails(params.data);
    setViewMoreDrawerVisible(true);
  };

  const onViewMoreDrawerClose = () => {
    setViewMoreDrawerVisible(false);
    setSelectedEntityDetails(null);
  };

  const columnDefs = [
    {
      headerName: "Entity ",
      field: "entity_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Department",
      field: "department_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Registration Code",
      field: "registeration_code",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Registration Name",
      field: "registeration_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Faculty Advisor Name",
      field: "faculty_advisory_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Faculty Advisor Email",
      field: "faculty_advisory_email",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Faculty Co-Advisor Name",
      field: "faculty_co_advisory_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Faculty Co-Advisor Email",
      field: "faculty_co_advisory_email",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Secretary Name",
      field: "Secretary_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Secretary Email",
      field: "Secretary_email",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Joint Secretary Name",
      field: "Joint_Secretary_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Joint Secretary Email",
      field: "Joint_Secretary_email",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Session",
      field: "session_code",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Send Mail",
      cellRenderer: (params) => (
        <button
          className="clear-button"
          onClick={() => handleSendMail(params)}
          title="Send Mail"
        >
          <img style={{ width: "20px" }} src={mail} alt="mail" />
          Send Mail
        </button>
      ),
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => (
        <div className="action-buttons">
          <button
            className="clear-button"
            onClick={() => handleEdit(params)}
            title="Edit"
          >
            Edit
          </button>
          <button
            className="clear-button"
            onClick={() => handleDelete(params)}
            title="Delete"
          >
            Delete
          </button>
        </div>
      ),
    },
    {
      headerName: "Full Result",
      cellRenderer: (params) => (
        <button
          className="clear-button"
          onClick={() => handleViewMore(params)}
          title="View More"
        >
          View Full Result
        </button>
      ),
    },
  ];

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const downloadCSV = () => {
    gridApi.exportDataAsCsv();
  };

  const renderEntityDetailsTable = () => {
    if (!selectedEntityDetails) return null;

    const renderSection = (title, fields) => (
      <>
        <tr className="section-header">
          <td colSpan="2">{title}</td>
        </tr>
        {fields.map(([label, key]) => (
          <tr key={key}>
            <td>{label}</td>
            <td>{selectedEntityDetails[key] || 'N/A'}</td>
          </tr>
        ))}
      </>
    );

    return (
      <table className="entity-details-table">
        <tbody>
          {renderSection("Registration Details", [
            ["Registration Code", "registeration_code"],
            ["Registration Name", "registeration_name"],
            ["Entity", "entity"],
            ["Department", "department"],
            ["Session Code", "session_code"],
            ["Remarks", "remarks"]
          ])}
          {renderSection("Faculty Advisor", [
            ["Name", "faculty_advisory_name"],
            ["Email", "faculty_advisory_email"],
            ["Emp Code", "faculty_advisory_empcode"],
            ["Mobile", "faculty_advisory_mobile"]
          ])}
          {renderSection("Faculty Co-Advisor", [
            ["Name", "faculty_co_advisory_name"],
            ["Email", "faculty_co_advisory_email"],
            ["Emp Code", "faculty_co_advisory_empcode"],
            ["Mobile", "faculty_co_advisory_mobile"]
          ])}
          {renderSection("Secretary", [
            ["Name", "Secretary_name"],
            ["Email", "Secretary_email"],
            ["UID", "Secretary_uid"],
            ["Mobile", "Secretary_mobile"]
          ])}
          {renderSection("Joint Secretary", [
            ["Name", "Joint_Secretary_name"],
            ["Email", "Joint_Secretary_email"],
            ["UID", "Joint_Secretary_uid"],
            ["Mobile", "Joint_Secretary_mobile"]
          ])}
        </tbody>
      </table>
    );
  };


  return (
    <div className="entity-table-container">
      <div className="table-header-entity">
        <div>
          <h2>Registered Entities</h2>
        </div>
        <div className="header-buttons">
          <button className="clear-button" onClick={downloadCSV}>
            Download CSV
          </button>
          <button className="clear-button">Add Entity</button>
        </div>
      </div>
     <div  style={{ height: "20vh", width: "100%" }}>
     <div className="ag-theme-alpine">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={entities}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={10}
          domLayout="autoHeight"
          suppressHorizontalScroll={false}
          enableBrowserTooltips={true}
        />
      </div>
     </div>
      <Drawer
        title="Edit Entity"
        placement="right"
        onClose={onDrawerClose}
        visible={drawerVisible}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="entity_name" label="Entity Name">
            <Input />
          </Form.Item>
          <Form.Item name="department_name" label="Department Name">
            <Input />
          </Form.Item>
          <Form.Item name="registeration_name" label="Registration Name">
            <Input />
          </Form.Item>
          <Form.Item name="registeration_code" label="Registration Code">
            <Input />
          </Form.Item>
       
          <Form.Item name="faculty_advisory_name" label="Faculty Advisor Name">
            <Input />
          </Form.Item>
          <Form.Item name="faculty_advisory_empcode" label="Faculty Advisor Empcode">
            <Input />
          </Form.Item>
          <Form.Item
            name="faculty_advisory_email"
            label="Faculty Advisor Email"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="faculty_advisory_mobile"
            label="Faculty Advisor Mobile"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="faculty_co_advisory_name"
            label="Faculty Co-Advisor Name"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="faculty_co_advisory_email"
            label="Faculty Co-Advisor Email"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="faculty_co_advisory_empcode"
            label="Faculty Co-Advisor Empcode"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="faculty_co_advisory_mobile"
            label="Faculty Co-Advisor Mobile"
          >
            <Input />
          </Form.Item>
          <Form.Item name="Secretary_name" label="Secretary Name">
            <Input />
          </Form.Item>
          <Form.Item name="Secretary_email" label="Secretary Email">
            <Input />
          </Form.Item>
          <Form.Item name="Secretary_mobile" label="Secretary Mobile">
            <Input />
          </Form.Item>
          <Form.Item name="Joint_Secretary_name" label="Joint Secretary Name">
            <Input />
          </Form.Item>
          <Form.Item name="Joint_Secretary_email" label="Joint Secretary Email">
            <Input />
          </Form.Item>
          <Form.Item name="Joint_Secretary_mobile" label="Joint Secretary Mobile">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Entity
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <Drawer
        title="Send Mail"
        placement="right"
        onClose={onMailDrawerClose}
        visible={mailDrawerVisible}
        width={600}
      >
        <Form form={mailForm} layout="vertical" onFinish={onMailFinish}>
          <Form.Item label="Receiver Emails" required>
            <div className="email-input-container">
              {emails.map((email, index) => (
                <Tag key={index} closable onClose={() => removeEmail(email)}>
                  {email}
                </Tag>
              ))}
              <Input
                placeholder="Enter email addresses"
                onChange={handleEmailInputChange}
                style={{
                  background: isValidEmail(
                    mailForm.getFieldValue("receiver_emails")
                  )
                    ? "#e6f7e6"
                    : "white",
                }}
              />
            </div>
          </Form.Item>
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="body" label="Body" rules={[{ required: true }]}>
            <ReactQuill theme="snow" />
          </Form.Item>
          <Form.Item
            name="entity_request_id"
            label="Entity Request ID"
            rules={[{ required: true }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Send Mail
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <Modal
        title="Entity Details"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={600}
      >
        {editingEntity && (
          <div>
            <p>
              <strong>Registration Code:</strong>{" "}
              {editingEntity.registeration_code}
            </p>
            <p>
              <strong>Registration Name:</strong>{" "}
              {editingEntity.registeration_name}
            </p>
            <p>
              <strong>Faculty Advisor:</strong>{" "}
              {editingEntity.faculty_advisory_name}
            </p>
            <p>
              <strong>Faculty Co-Advisor:</strong>{" "}
              {editingEntity.faculty_co_advisory_name}
            </p>
            <p>
              <strong>Secretary:</strong> {editingEntity.Secretary_name}
            </p>
            <p>
              <strong>Joint Secretary:</strong>{" "}
              {editingEntity.Joint_Secretary_name}
            </p>
            <p>
              <strong>Session:</strong> {editingEntity.session_code}
            </p>
          </div>
        )}
      </Modal>
      <Drawer
        title="Full Entity Details"
        placement="right"
        onClose={onViewMoreDrawerClose}
        visible={viewMoreDrawerVisible}
        width={600}
      >
        {renderEntityDetailsTable()}
      </Drawer>
    </div>
  );
}

export default RegisteredEntities;
