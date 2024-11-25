import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  Drawer,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Modal,
  message,
  Tag,
} from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import mail from "../../assets/images/mail.png";
import "./EntityTable.css";
import { useCallback, useEffect, useState } from "react";
import { Color } from "antd/es/color-picker";

const { TextArea } = Input;

function EntityTable() {
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
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [selectedEntityId, setSelectedEntityId] = useState(null);

  useEffect(() => {
    fetch("http://172.17.2.176:8080/intranetapp/entity-requests/")
      .then((response) => response.json())
      .then((data) => setEntities(data))
      .catch((error) => console.error("Error fetching data:", error));

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
      form.setFieldsValue({
        ...params.data,
        proposed_date: moment(params.data.proposed_date),
      });
      setDrawerVisible(true);
    },
    [form]
  );

  const handleDelete = useCallback((params) => {
    console.log("Delete clicked for entity with ID:", params.data.entcr_id);
    setEntities((prevEntities) =>
      prevEntities.filter((entity) => entity.entcr_id !== params.data.entcr_id)
    );
  }, []);

  const handleSendMail = useCallback(
    (params) => {
      setEditingEntity(params.data);
      mailForm.setFieldsValue({
        entity_request_id: params.data.entcr_id,
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
        entity.entcr_id === editingEntity.entcr_id
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
        fetch("http://172.17.2.176:8080/intranetapp/send-email/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
          .then((response) => response.json())
          .then((data) => {
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
    setEditingEntity(params.data); // Set the entity data to be viewed
    setViewModalVisible(true); // Show the modal
  };

  async function updateStatusAPI(entityId, newStatus) {
    try {
      const response = await fetch("/api/update-status", {
        // Replace with your actual API endpoint
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entity_id: entityId, // Assuming each row has an 'id' field
          status: newStatus, // The new status selected
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Status updated successfully:", result);
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  const handleViewMore = (params) => {
    setSelectedEntityDetails(params.data); // Set the entity data to be viewed
    setViewMoreDrawerVisible(true); // Show the drawer with details
  };

  const onViewMoreDrawerClose = () => {
    setViewMoreDrawerVisible(false);
    setSelectedEntityDetails(null);
  };

  useEffect(() => {
    fetch("http://172.17.2.176:8080/intranetapp/entity-requests/")
      .then((response) => response.json())
      .then((data) => setEntities(data))
      .catch((error) => console.error("Error fetching data:", error));

    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Use parsedUser if needed
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);
  

  const handleStatusChange = useCallback((params) => {
    setSelectedEntityId(params.data.entcr_id);
    setSelectedStatus(params.value);
    setStatusModalVisible(true);
  }, []);

  const handleStatusConfirm = useCallback(async () => {
    try {
      const response = await fetch(`http://172.17.2.176:8080/intranetapp/entity-request/${selectedEntityId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: selectedStatus,
          remark: remark,
        }),
      });

      if (response.ok) {
        message.success('Status updated successfully');

        setEntities((prevEntities) =>
          prevEntities.map((entity) =>
            entity.entcr_id === selectedEntityId
              ? { ...entity, status: selectedStatus }
              : entity
          )
        );
      } else {
        message.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('An error occurred while updating status');
    }

    setStatusModalVisible(false);
    setRemark('');
  }, [selectedStatus, remark, selectedEntityId]);

  const StatusCellRenderer = (props) => {
    const statusOptions = ['Pending', 'Approved', 'Interview Scheduled', 'Rejected', 'Request Hold'];
    
    return (
      <Select
        value={props.value}
        onChange={(value) => handleStatusChange({ data: props.data, value })}
        style={{ width: '100%' }}
      >
        {statusOptions.map((status) => (
          <Select.Option  key={status} value={status}>
            {status}
          </Select.Option>
        ))}
      </Select>
    );
  };

  const columnDefs = [
    {
      headerName: "Proposed Name",
      field: "proposed_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Proposed Date",
      field: "proposed_date",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Proposed By",
      field: "proposed_by",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Proposer Name",
      field: "proposer_name",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Entity Nature",
      field: "entity_nature",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      cellRenderer: StatusCellRenderer,
    },
    {
      headerName: "Entity Name",
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

    { headerName: "Session", field: "session", sortable: true, filter: true },
    {
      headerName: "Proposed By Email",
      field: "proposer_email",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Proposer Contact",
      field: "mobile",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Send Mail",
      field: "actions",
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
      headerName: "View Referal",
      field: "actions",
      cellRenderer: (params) => (
        <button
          className="clear-button"
          onClick={() => handleView(params)}
          title="View"
        >
          View Referal
        </button>
      ),
    },
    {
      headerName: "Actions",
      field: "actions",
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
      field: "actions",
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




  const renderSection = (title, fields) => (
    <>
      <tr className="section-header">
        <td colSpan="2">{title}</td>
      </tr>
      {fields.map(([label, key]) => (
        <tr key={key}>
          <td>{label}</td>
          <td>{selectedEntityDetails?.[key] || 'N/A'}</td>
        </tr>
      ))}
    </>
  );


  return (
    <div className="entity-table-container">
      <div className="table-header-entity">
        <div>
          <h2>Entities Status</h2>
        </div>
        <div className="header-buttons">
          <button className="clear-button" onClick={downloadCSV}>
            Download CSV
          </button>
          <button className="clear-button">Add Entity</button>
        </div>
      </div>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
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
      <Drawer
        title="Edit Entity"
        placement="right"
        onClose={onDrawerClose}
        visible={drawerVisible}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="proposed_name" label="Proposed Name">
            <Input />
          </Form.Item>
          <Form.Item name="proposed_date" label="Proposed Date">
            <DatePicker />
          </Form.Item>
          <Form.Item name="proposed_by" label="Proposed By">
            <Input />
          </Form.Item>
          <Form.Item name="proposer_name" label="Proposer Name">
            <Input />
          </Form.Item>
          <Form.Item name="entity_nature" label="Entity Nature">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="entity_name" label="Entity Name">
            <Input />
          </Form.Item>
          <Form.Item name="department_name" label="Department">
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
        title="Referral"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={600}
      >
        <div
          dangerouslySetInnerHTML={{ __html: editingEntity?.referal || "" }}
        />
      </Modal>
      <Drawer
        title="Entity Details"
        placement="right"
        onClose={onViewMoreDrawerClose}
        visible={viewMoreDrawerVisible}
        width={600}
      >
        {/* <Form layout="vertical">
          <Form.Item label="Proposed Name">
            {selectedEntityDetails?.proposed_name}
          </Form.Item>
          <Form.Item label="Proposed Date">
            {selectedEntityDetails?.proposed_date}
          </Form.Item>
          <Form.Item label="Proposed By">
            {selectedEntityDetails?.proposed_by}
          </Form.Item>
          <Form.Item label="Proposer Name">
            {selectedEntityDetails?.proposer_name}
          </Form.Item>
          <Form.Item label="Entity Nature">
            {selectedEntityDetails?.entity_nature}
          </Form.Item>
          <Form.Item label="Status">{selectedEntityDetails?.status}</Form.Item>
          <Form.Item label="Entity Name">
            {selectedEntityDetails?.entity_name}
          </Form.Item>
          <Form.Item label="Department">
            {selectedEntityDetails?.department_name}
          </Form.Item>

         
          <Form.Item label="Student Section 1 Name">
            {selectedEntityDetails?.student_sec_1_name}
          </Form.Item>
          <Form.Item label="Student Section 1 Email">
            {selectedEntityDetails?.student_sec_1_email}
          </Form.Item>
          <Form.Item label="Student Section 1 UID">
            {selectedEntityDetails?.student_sec_1_uid}
          </Form.Item>
          <Form.Item label="Student Section 1 Mobile">
            {selectedEntityDetails?.student_sec_1_mobile}
          </Form.Item>

          <Form.Item label="Student Section 2 Name">
            {selectedEntityDetails?.student_sec_2_name}
          </Form.Item>
          <Form.Item label="Student Section 2 Email">
            {selectedEntityDetails?.student_sec_2_email}
          </Form.Item>
          <Form.Item label="Student Section 2 UID">
            {selectedEntityDetails?.student_sec_2_uid}
          </Form.Item>
          <Form.Item label="Student Section 2 Mobile">
            {selectedEntityDetails?.student_sec_2_mobile}
          </Form.Item>

          <Form.Item label="Student Advisor Section 1 Name">
            {selectedEntityDetails?.student_advsec_1_name}
          </Form.Item>
          <Form.Item label="Student Advisor Section 1 Email">
            {selectedEntityDetails?.student_advsec_1_email}
          </Form.Item>
          <Form.Item label="Student Advisor Section 1 UID">
            {selectedEntityDetails?.student_advsec_1_uid}
          </Form.Item>
          <Form.Item label="Student Advisor Section 1 Mobile">
            {selectedEntityDetails?.student_advsec_1_mobile}
          </Form.Item>

          <Form.Item label="Student Advisor Section 2 Name">
            {selectedEntityDetails?.student_advsec_2_name}
          </Form.Item>
          <Form.Item label="Student Advisor Section 2 Email">
            {selectedEntityDetails?.student_advsec_2_email}
          </Form.Item>
          <Form.Item label="Student Advisor Section 2 UID">
            {selectedEntityDetails?.student_advsec_2_uid}
          </Form.Item>
          <Form.Item label="Student Advisor Section 2 Mobile">
            {selectedEntityDetails?.student_advsec_2_mobile}
          </Form.Item>

          <Form.Item label="Faculty Advisor 1 Name">
            {selectedEntityDetails?.faculty_adv_1_name}
          </Form.Item>
          <Form.Item label="Faculty Advisor 1 Email">
            {selectedEntityDetails?.faculty_adv_1_email}
          </Form.Item>
          <Form.Item label="Faculty Advisor 1 Emp Code">
            {selectedEntityDetails?.faculty_adv_1_empcode}
          </Form.Item>
          <Form.Item label="Faculty Advisor 1 Mobile">
            {selectedEntityDetails?.faculty_adv_1_mobile}
          </Form.Item>

          <Form.Item label="Faculty Advisor 2 Name">
            {selectedEntityDetails?.faculty_adv_2_name}
          </Form.Item>
          <Form.Item label="Faculty Advisor 2 Email">
            {selectedEntityDetails?.faculty_adv_2_email}
          </Form.Item>
          <Form.Item label="Faculty Advisor 2 Emp Code">
            {selectedEntityDetails?.faculty_adv_2_empcode}
          </Form.Item>
          <Form.Item label="Faculty Advisor 2 Mobile">
            {selectedEntityDetails?.faculty_adv_2_mobile}
          </Form.Item>

          <Form.Item label="Faculty Co-Advisor 1 Name">
            {selectedEntityDetails?.faculty_coadv_1_name}
          </Form.Item>
          <Form.Item label="Faculty Co-Advisor 1 Email">
            {selectedEntityDetails?.faculty_coadv_1_email}
          </Form.Item>
          <Form.Item label="Faculty Co-Advisor 1 Emp Code">
            {selectedEntityDetails?.faculty_coadv_1_empcode}
          </Form.Item>
          <Form.Item label="Faculty Co-Advisor 1 Mobile">
            {selectedEntityDetails?.faculty_coadv_1_mobile}
          </Form.Item>

          <Form.Item label="Faculty Co-Advisor 2 Name">
            {selectedEntityDetails?.faculty_coadv_2_name}
          </Form.Item>
          <Form.Item label="Faculty Co-Advisor 2 Email">
            {selectedEntityDetails?.faculty_coadv_2_email}
          </Form.Item>
          <Form.Item label="Faculty Co-Advisor 2 Emp Code">
            {selectedEntityDetails?.faculty_coadv_2_empcode}
          </Form.Item>
          <Form.Item label="Faculty Co-Advisor 2 Mobile">
            {selectedEntityDetails?.faculty_coadv_2_mobile}
          </Form.Item>
        </Form> */}
         {viewMoreDrawerVisible && (
        <div className="drawer-overlay" onClick={onViewMoreDrawerClose}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <h2>Entity Details</h2>
            <table className="entity-details-table">
              <tbody>
                {renderSection("Entity Information", [
                  ["Proposed Name", "proposed_name"],
                  ["Proposed Date", "proposed_date"],
                  ["Proposed By", "proposed_by"],
                  ["Proposer Name", "proposer_name"],
                  ["Entity Nature", "entity_nature"],
                  ["Status", "status"],
                  ["Entity Name", "entity_name"],
                  ["Department", "department_name"]
                ])}

                {renderSection("Student Section 1", [
                  ["Name", "student_sec_1_name"],
                  ["Email", "student_sec_1_email"],
                  ["UID", "student_sec_1_uid"],
                  ["Mobile", "student_sec_1_mobile"]
                ])}

                {renderSection("Student Section 2", [
                  ["Name", "student_sec_2_name"],
                  ["Email", "student_sec_2_email"],
                  ["UID", "student_sec_2_uid"],
                  ["Mobile", "student_sec_2_mobile"]
                ])}

                {renderSection("Student Advisor Section 1", [
                  ["Name", "student_advsec_1_name"],
                  ["Email", "student_advsec_1_email"],
                  ["UID", "student_advsec_1_uid"],
                  ["Mobile", "student_advsec_1_mobile"]
                ])}

                {renderSection("Student Advisor Section 2", [
                  ["Name", "student_advsec_2_name"],
                  ["Email", "student_advsec_2_email"],
                  ["UID", "student_advsec_2_uid"],
                  ["Mobile", "student_advsec_2_mobile"]
                ])}

                {renderSection("Faculty Advisor 1", [
                  ["Name", "faculty_adv_1_name"],
                  ["Email", "faculty_adv_1_email"],
                  ["Emp Code", "faculty_adv_1_empcode"],
                  ["Mobile", "faculty_adv_1_mobile"]
                ])}

                {renderSection("Faculty Advisor 2", [
                  ["Name", "faculty_adv_2_name"],
                  ["Email", "faculty_adv_2_email"],
                  ["Emp Code", "faculty_adv_2_empcode"],
                  ["Mobile", "faculty_adv_2_mobile"]
                ])}

                {renderSection("Faculty Co-Advisor 1", [
                  ["Name", "faculty_coadv_1_name"],
                  ["Email", "faculty_coadv_1_email"],
                  ["Emp Code", "faculty_coadv_1_empcode"],
                  ["Mobile", "faculty_coadv_1_mobile"]
                ])}

                {renderSection("Faculty Co-Advisor 2", [
                  ["Name", "faculty_coadv_2_name"],
                  ["Email", "faculty_coadv_2_email"],
                  ["Emp Code", "faculty_coadv_2_empcode"],
                  ["Mobile", "faculty_coadv_2_mobile"]
                ])}
              </tbody>
            </table>
            <button className="close-button" onClick={onViewMoreDrawerClose}>Close</button>
          </div>
        </div>
      )}
      </Drawer>

      <Modal
        title="Confirm Status Change"
        visible={statusModalVisible}
        onOk={handleStatusConfirm}
        onCancel={() => setStatusModalVisible(false)}
      >
        <p>Are you sure you want to change the status to {selectedStatus}?</p>
        <Form.Item label="Remark">
          <TextArea
            rows={4}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter your remark here"
          />
        </Form.Item>
      </Modal>
    </div>
  );
}

export default EntityTable;
