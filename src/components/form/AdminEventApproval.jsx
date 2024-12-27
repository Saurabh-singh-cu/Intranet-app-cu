import styles from "./AdminEventApproval.module.css";
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Drawer,
  Input,
  message,
  Select,
  Modal,
  Form,
} from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";

const { TextArea } = Input;

const AdminEventApproval = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  axios.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://172.17.2.247:8080/intranetapp/get-all-events-upload-request"
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to load events. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (record, status) => {
    setSelectedEvent({ ...record, newStatus: status });
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        status: selectedEvent.newStatus,
        remark: values.remark,
      };

      await axios.put(
        `http://172.17.2.247:8080/intranetapp/events-uploads/${selectedEvent.Uploads_id}/update/`,
        payload
      );
      setModalVisible(false);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Event status changed to ${selectedEvent?.newStatus}`,
      });
      fetchEvents();
    } catch (error) {
      console.error("Error changing status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to change event status. Please try again.",
      });
    }
  };
  const showDrawer = (record) => {
    setSelectedEvent(record);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.Event_Name.toLowerCase().includes(
      searchText.toLowerCase()
    );
    const matchesStatus =
      statusFilter === "All" || event.Status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "Event Name",
      dataIndex: "Event_Name",
      key: "Event_Name",
    },
    {
      title: "Entity Name",
      dataIndex: "Entity_Name",
      key: "Entity_Name",
    },
    {
      title: "Fac. Adv. Name",
      dataIndex: "Faculty_Advisory_Name",
      key: "Faculty_Advisory_Name",
    },
    {
      title: "Fac. Adv. Email",
      dataIndex: "Faculty_Advisory_Email",
      key: "Faculty_Advisory_Email",
    },
    // {
    //   title: "Fac. Mobile",
    //   dataIndex: "Faculty_Advisory_Mobile",
    //   key: "Faculty_Advisory_Mobile",
    // },
    {
      title: "Dept. Name",
      dataIndex: "Department_Name",
      key: "Department_Name",
    },
    {
      title: "Cluster Name",
      dataIndex: "Cluster_Name",
      key: "Cluster_Name",
    },

    // {
    //   title: "File",
    //   dataIndex: "PDF_File_URL",
    //   key: "PDF_File_URL",
    //   render: (text) => (
    //     <a
    //       href={text}
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       className={styles.viewPdf}
    //     >
    //       <EyeOutlined />
    //     </a>
    //   ),
    // },
    {
      title: "View Full Detail",
      render: (record) => (
        <Button onClick={() => showDrawer(record)}>
          <EyeOutlined />
        </Button>
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (text) => (
        <span className={`${styles.status} ${styles[text.toLowerCase()]}`}>
          {text}
        </span>
      ),
    },
    // {
    //   title: "Date",
    //   dataIndex: "Date",
    //   key: "Date",
    //   render: (text) => new Date(text).toLocaleString(),
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Select
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record, value)}
          placeholder="Select Status"
        >
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Approved">Approve</Select.Option>
          <Select.Option value="Cancelled">Reject</Select.Option>
        </Select>
      ),
    },
  ];
  return (
    <>
      <div
        style={{ padding: "40px", marginTop: "40px" }}
        className={styles.adminEventApproval}
      >
        <h2 className={styles.pageTitle}>Admin Event Approval</h2>

        <Input
          placeholder="Search by Event Name"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <div style={{ marginBottom: 16 }}>
          <Button
            type={statusFilter === "Approved" ? "primary" : "default"}
            onClick={() => handleStatusFilter("Approved")}
          >
            Approved
          </Button>
          <Button
            type={statusFilter === "Cancelled" ? "primary" : "default"}
            onClick={() => handleStatusFilter("Cancelled")}
            style={{ marginLeft: 8 }}
          >
            Cancelled
          </Button>
          <Button
            type={statusFilter === "Pending" ? "primary" : "default"}
            onClick={() => handleStatusFilter("Pending")}
            style={{ marginLeft: 8 }}
          >
            Pending
          </Button>
          <Button
            type={statusFilter === "All" ? "primary" : "default"}
            onClick={() => handleStatusFilter("All")}
            style={{ marginLeft: 8 }}
          >
            All
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredEvents}
          rowKey="uploads_id"
          loading={loading}
          className={styles.eventTable}
        />
        <Drawer
          title="Event Details"
          placement="right"
          closable={true}
          onClose={closeDrawer}
          visible={drawerVisible}
          width={500}
          className={styles.eventDrawer}
        >
          {selectedEvent && (
            <div className={styles.eventDetails}>
              <h3>{selectedEvent.Event_Name}</h3>
              <p>
                <strong>Entity Name:</strong> {selectedEvent.Entity_Name}
              </p>
              <p>
                <strong>Faculty Advisory:</strong>{" "}
                {selectedEvent.Faculty_Advisory_Name}
              </p>
              <p>
                <strong>Email:</strong> {selectedEvent.Faculty_Advisory_Email}
              </p>
              <p>
                <strong>Mobile:</strong> {selectedEvent.Faculty_Advisory_Mobile}
              </p>
              <p>
                <strong>Department:</strong> {selectedEvent.Department_Name}
              </p>
              <p>
                <strong>Cluster:</strong> {selectedEvent.Cluster_Name}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={styles[selectedEvent.Status.toLowerCase()]}>
                  {selectedEvent.Status}
                </span>
              </p>
              <p>
                <strong>Uploaded At:</strong>{" "}
                {new Date(selectedEvent.uploaded_at).toLocaleString()}
              </p>
              <a
                href={selectedEvent.PDF_File_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pdfLink}
              >
                View PDF
              </a>
            </div>
          )}
        </Drawer>
        <Modal
          title="Change Event Status"
          visible={modalVisible}
          onOk={handleModalOk}
          onCancel={() => setModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please Add Remark",
                },
              ]}
              name="remark"
              label="Give Remark"
            >
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default AdminEventApproval;
