// import React, { useState, useEffect } from 'react';
// import { Table, Button, Drawer, Input, message, Select, Modal, Form } from 'antd';
// import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import styles from './AdminEventApproval.module.css';
// import TextArea from 'antd/es/input/TextArea';

// const EventPublishedRequest = () => {
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [drawerVisible, setDrawerVisible] = useState(false);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [searchText, setSearchText] = useState('');
//     const [modalVisible, setModalVisible] = useState(false);
//     const [form] = Form.useForm();
  
//     axios.interceptors.request.use((config) => {
//       const user = JSON.parse(localStorage.getItem("user"));
//       const token = user?.access;
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     });
  
//     useEffect(() => {
//       fetchEvents();
//     }, []);
  
//     const fetchEvents = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get('http://172.17.2.247:8080/intranetapp/get_all_event_request/');
//         console.log(response, "AAAAHH AAHA AHAA AHA ")
//         setEvents(response.data);
//       } catch (error) {
//         console.error('Error fetching events:', error);
//         Swal.fire({
//           icon: 'error',
//           title: 'Oops...',
//           text: 'Failed to load events. Please try again later.',
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     const handleStatusChange = async (record, status) => {
//       setSelectedEvent({ ...record, newStatus: status });
//       setModalVisible(true);
//     };
  
//     const handleModalOk = async () => {
//       try {
//         const values = await form.validateFields();
//         await axios.put(`http://172.17.2.247:8080/intranetapp/events-uploads/${selectedEvent.Uploads_id}/update/`, {
//           status: selectedEvent.newStatus,
//           remark: values.remark
//         });
//         setModalVisible(false);
//         Swal.fire({
//           icon: 'success',
//           title: 'Success',
//           text: `Event status changed to ${selectedEvent?.newStatus}`,
//         });
//         fetchEvents(); 
//       } catch (error) {
//         console.error('Error changing status:', error);
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: 'Failed to change event status. Please try again.',
//         });
//       }
//     };
  
//     const showDrawer = (record) => {
//       setSelectedEvent(record);
//       setDrawerVisible(true);
//     };
  
//     const closeDrawer = () => {
//       setDrawerVisible(false);
//     };
  
//     const handleSearch = (value) => {
//       setSearchText(value);
//     };
  
//     const filteredEvents = events.filter((event) =>
//       event.Event_Name.toLowerCase().includes(searchText.toLowerCase())
//     );
  
//   const columns = [
//     {
//       title: "Event Name",
//       dataIndex: "event_name",
//       key: "event_name",
//     },

//     {
//       title: "Start Date",
//       dataIndex: "start_date",
//       key: "start_date",
//     },
//     {
//       title: "End Date",
//       dataIndex: "end_date",
//       key: "end_date",
//     },
//     {
//       title: "Start Time",
//       dataIndex: "start_time",
//       key: "start_time",
//     },
//     {
//       title: "End Date",
//       dataIndex: "end_date",
//       key: "end_date",
//     },
//     {
//       title: "Member Limit",
//       dataIndex: "limit",
//       key: "limit",
//     },
//     {
//       title: "Dept. Name",
//       dataIndex: "Department_Name",
//       key: "Department_Name",
//     },
//     {
//       title: "Cluster Name",
//       dataIndex: "Cluster_Name",
//       key: "Cluster_Name",
//     },
  
//     {
//       title: "File",
//       dataIndex: "PDF_File_URL",
//       key: "PDF_File_URL",
//       render: (text) => (
//         <a
//           href={text}
//           target="_blank"
//           rel="noopener noreferrer"
//           className={styles.viewPdf}
//         >
//           <EyeOutlined />
//         </a>
//       ),
//     },
//     {
//       title: "View Full Detail",
//       render: (record) => (
//           <Button onClick={() => showDrawer(record)} >
//         <EyeOutlined />
//         </Button>
//       ),
//     },
//     {
//       title: "Status",
//       dataIndex: "Status",
//       key: "Status",
//       render: (text) => (
//         <span className={`${styles.status} ${styles[text.toLowerCase()]}`}>
//           {text}
//         </span>
//       ),
//     },
//     {
//       title: "Date",
//       dataIndex: "uploaded_at",
//       key: "uploaded_at",
//       render: (text) => new Date(text).toLocaleString(),
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <Select
         
//           style={{ width: 120 }}
//           onChange={(value) => handleStatusChange(record, value)}
//           placeholder="Select Status"
//         >
         
//           <Select.Option value="Pending">Pending</Select.Option>
//           <Select.Option value="Approved">Approve</Select.Option>
//           <Select.Option value="Cancelled">Reject</Select.Option>
//         </Select>
//       ),
//     },
//   ];
//     return (
//       <div style={{padding:"70px"}} className={styles.adminEventApproval}>
//       <h2 className={styles.pageTitle}> Event Published Request</h2>
//       <Input
//         placeholder="Search by Event Name"
//         prefix={<SearchOutlined />}
//         onChange={(e) => handleSearch(e.target.value)}
//         style={{ marginBottom: 16 }}
//       />
//       <Table
//         columns={columns}
//         dataSource={filteredEvents}
//         rowKey="uploads_id"
//         loading={loading}
//         className={styles.eventTable}
//       />
//       <Drawer
//         title="Event Details"
//         placement="right"
//         closable={true}
//         onClose={closeDrawer}
//         visible={drawerVisible}
//         width={500}
//         className={styles.eventDrawer}
//       >
//         {selectedEvent && (
//           <div className={styles.eventDetails}>
//             <h3>{selectedEvent.Event_Name}</h3>
//             <p><strong>Entity Name:</strong> {selectedEvent.Entity_Name}</p>
//             <p><strong>Faculty Advisory:</strong> {selectedEvent.Faculty_Advisory_Name}</p>
//             <p><strong>Email:</strong> {selectedEvent.Faculty_Advisory_Email}</p>
//             <p><strong>Mobile:</strong> {selectedEvent.Faculty_Advisory_Mobile}</p>
//             <p><strong>Department:</strong> {selectedEvent.Department_Name}</p>
//             <p><strong>Cluster:</strong> {selectedEvent.Cluster_Name}</p>
//             <p><strong>Status:</strong> <span className={styles[selectedEvent.Status.toLowerCase()]}>{selectedEvent.Status}</span></p>
//             <p><strong>Uploaded At:</strong> {new Date(selectedEvent.uploaded_at).toLocaleString()}</p>
//             <a href={selectedEvent.PDF_File_URL} target="_blank" rel="noopener noreferrer" className={styles.pdfLink}>
//               View PDF
//             </a>
//           </div>
//         )}
//       </Drawer>
//       <Modal
//           title="Change Event Status"
//           visible={modalVisible}
//           onOk={handleModalOk}
//           onCancel={() => setModalVisible(false)}
//         >
//           <Form form={form} layout="vertical">
//             <Form.Item name="remark" label="Remark">
//               <TextArea rows={4} />
//             </Form.Item>
//           </Form>
//         </Modal>
//     </div>
//     );
//   };

// export default EventPublishedRequest

import React, { useState, useEffect } from 'react';
import { Table, Button, Drawer, Input, Select, Modal, Form } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import styles from './EventPublishedRequest.module.css';

const { TextArea } = Input;

const EventPublishedRequest = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchText, setSearchText] = useState('');
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
      const response = await axios.get('http://172.17.2.247:8080/intranetapp/get_all_event_request/');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to load events. Please try again later.',
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
      await axios.put(`http://172.17.2.247:8080/intranetapp/events-uploads/${selectedEvent.uploads_id}/update/`, {
        status: selectedEvent.newStatus,
        remark: values.remark
      });
      setModalVisible(false);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Event status changed to ${selectedEvent?.newStatus}`,
      });
      fetchEvents();
    } catch (error) {
      console.error('Error changing status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to change event status. Please try again.',
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

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredEvents = events.filter((event) =>
    event.event_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
   
    {
      title: "Event Name",
      dataIndex: "event_name",
      key: "event_name",
    },
  
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      key: "start_time",
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      key: "end_time",
    },
   
    {
      title: "Member Limit",
      dataIndex: "limit",
      key: "limit",
    },
    {
      title: "PDF File",
      dataIndex: "pdf_file_url",
      key: "pdf_file_url",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer" className={styles.viewPdf}>
          <EyeOutlined />
        </a>
      ),
    },
    {
      title: "Poster",
      dataIndex: "poster_url",
      key: "poster_url",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer" className={styles.viewPoster}>
          <EyeOutlined />
        </a>
      ),
    },
    {
      title: "Department",
      dataIndex: ["reg_details", "department"],
      key: "department",
    },
    {
      title: "Entity",
      dataIndex: ["reg_details", "entity"],
      key: "entity",
    },
    {
      title: "Registration Name",
      dataIndex: ["reg_details", "registeration_name"],
      key: "registeration_name",
    },
   
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span className={`${styles.status} ${styles[text.toLowerCase()]}`}>
          {text}
        </span>
      ),
    },
   
   
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
    {
      title: "View Full Detail",
      render: (record) => (
        <Button onClick={() => showDrawer(record)}>
          <EyeOutlined />
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.adminEventApproval}>
      <h2 className={styles.pageTitle}>Event Published Request</h2>
      <Input
        placeholder="Search by Event Name"
        prefix={<SearchOutlined />}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={filteredEvents}
        rowKey="uploads_id"
        loading={loading}
        className={styles.eventTable}
        scroll={{ x: true }}
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
            <h3>{selectedEvent.event_name}</h3>
            <p><strong>Act ID:</strong> {selectedEvent.act_id}</p>
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            <p><strong>Duration:</strong> {Number(selectedEvent.duration) / 60000} minutes</p>
            <p><strong>Start Date:</strong> {selectedEvent.start_date}</p>
            <p><strong>End Date:</strong> {selectedEvent.end_date}</p>
            <p><strong>Start Time:</strong> {selectedEvent.start_time}</p>
            <p><strong>End Time:</strong> {selectedEvent.end_time}</p>
            <p><strong>ER ID:</strong> {selectedEvent.er_id}</p>
            <p><strong>Member Limit:</strong> {selectedEvent.limit}</p>
            <p><strong>Entity:</strong> {selectedEvent.reg_details.entity}</p>
            <p><strong>Registration Name:</strong> {selectedEvent.reg_details.registeration_name}</p>
            <p><strong>Department:</strong> {selectedEvent.reg_details.department}</p>
            <p><strong>Status:</strong> <span className={styles[selectedEvent.status.toLowerCase()]}>{selectedEvent.status}</span></p>
            <p><strong>Uploads ID:</strong> {selectedEvent.uploads_id}</p>
            <p><strong>Created At:</strong> {new Date(selectedEvent.created_at).toLocaleString()}</p>
            <p><strong>Remark:</strong> {selectedEvent.remark || 'N/A'}</p>
            <a href={selectedEvent.pdf_file_url} target="_blank" rel="noopener noreferrer" className={styles.pdfLink}>
              View PDF
            </a>
            <br />
            <a href={selectedEvent.poster_url} target="_blank" rel="noopener noreferrer" className={styles.posterLink}>
              View Poster
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
          <Form.Item name="remark" label="Remark">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EventPublishedRequest;
