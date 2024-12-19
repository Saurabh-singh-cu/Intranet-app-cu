import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { MdCloudUpload, MdInsertDriveFile } from "react-icons/md";
import { Modal, Button, Form, Input, DatePicker, Upload, Drawer, Select, TimePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import styles from "./UploadEventRequest.module.css";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const UploadEventRequest = () => {
  const [file, setFile] = useState(null);
  const [eventName, setEventName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploads, setUploads] = useState([]);
  const fileInputRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();

  axios.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const getRegId = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData?.faculty_advisory_details?.reg_id || null;
  };
  const getEntityId = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData?.faculty_advisory_details?.entity_id || null;
  };

  const validateFile = (file) => {
    if (file && file.type !== "application/pdf") {
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Only PDF files are allowed!",
      });
      return false;
    }
    return true;
  };

  // const handleFileChange = (e) => {
  //   const uploadedFile = e.target.files[0];
  //   if (validateFile(uploadedFile)) {
  //     setFile(uploadedFile);
  //   } else {
  //     setFile(null);
  //   }
  // };
  const handleFileChange = (info) => {
    if (info.file.status === "done") {
      setFile(info.file.originFileObj);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const uploadedFile = e.dataTransfer.files[0];
    if (validateFile(uploadedFile)) {
      setFile(uploadedFile);
    } else {
      setFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (isReplacement = false) => {
    if (!isReplacement && !eventName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Event Name",
        text: "Please enter an event name.",
      });
      return;
    }

    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "No File Selected",
        text: "Please select a PDF file to upload.",
      });
      return;
    }

    const reg_id = getRegId();
    if (!reg_id) {
      Swal.fire({
        icon: "error",
        title: "Missing User Data",
        text: "Registration ID not found!",
      });
      return;
    }

    const formData = new FormData();
    formData.append("pdf_file", file);

    if (isReplacement) {
      formData.append("uploads_id", selectedUpload.uploads_id);
      formData.append("status", "Pending");
    } else {
      formData.append("reg_id", reg_id);
      formData.append("event_name", eventName);
      formData.append("status", "Pending");
    }

    const url = isReplacement
      ? `http://172.17.2.247:8080/intranetapp/replace-event-upload/?reg_id=${reg_id}`
      : `http://172.17.2.247:8080/intranetapp/upload-event-pdf/?reg_id=${reg_id}`;

    Swal.fire({
      title: isReplacement ? "Replace File" : "Upload File",
      text: `Are you sure you want to ${
        isReplacement ? "replace" : "upload"
      } this file?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        axios({
          method: isReplacement ? "put" : "post",
          url: url,
          data: formData,
        })
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: isReplacement
                ? "File Replaced Successfully"
                : "File Uploaded Successfully",
              text:
                response.data.message ||
                `Your file has been ${
                  isReplacement ? "replaced" : "uploaded"
                }.`,
            });
            setFile(null);
            setEventName("");
            fetchUploads();
            if (isReplacement) {
              setIsModalVisible(false);
            }
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: isReplacement ? "Replacement Failed" : "Upload Failed",
              text:
                error.response?.data?.message ||
                `An error occurred while ${
                  isReplacement ? "replacing" : "uploading"
                } the file.`,
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    });
  };

  const handleDropZoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleReplaceFile = (upload) => {
    setSelectedUpload(upload);
    setIsModalVisible(true);
  };

  const handleRegisterEvent = (event) => {
    setSelectedEvent(event);
    setIsRegisterModalVisible(true);
    setIsDrawerVisible(true);
  };

  const handleRegisterSubmit = async (values) => {
    const reg_id = getRegId();
    const entityId = JSON.parse(localStorage.getItem("user"))?.entity_id;

    const payload = {
      ...values,
      upload_id: selectedEvent.uploads_id,
      reg_id: reg_id,
      entity_id: entityId,
    };

    try {
      const response = await axios.post("/api/new-event-register", payload);
      message.success("Event registered successfully");
      setIsDrawerVisible(false);
      fetchUploads();
    } catch (error) {
      console.error("Registration error:", error);
      message.error("Failed to register event");
    }
  };

  useEffect(() => {
    fetchUploads();
    fetchCategories();
  }, []);

  const fetchUploads = () => {
    const reg_id = getRegId();
    if (!reg_id) {
      Swal.fire({
        icon: "error",
        title: "Missing User Data",
        text: "Registration ID not found in local storage.",
      });
      return;
    }

    axios
      .get(
        `http://172.17.2.247:8080/intranetapp/get-events-uploads/?reg_id=${reg_id}`
      )
      .then((response) => {
        setUploads(response.data);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Failed to Load Uploads",
          text: error.response?.data?.message || "Error fetching upload data.",
        });
      });
  };

  const fetchCategories = async () => {
    
    try {
      const entityId = getEntityId();
      // const entityId = JSON.parse(localStorage.getItem("user"))?.entity_id;
      const response = await axios.get(
        `http://172.17.2.247:8080/intranetapp/entity-activities/?entity_id=${entityId}`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to load categories");
    }
  };

  return (
    <div className={styles.uploadPage}>
      <div className={styles.uploadContainer}>
        <h2 className={styles.pageTitle}>Upload Event Request</h2>
        <div className={styles.formContainer}>
          <div className={styles.inputGroup}>
            <label htmlFor="eventName">Event Name</label>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter event name"
            />
          </div>
          <div
            className={`${styles.dropZone} ${file ? styles.hasFile : ""}`}
            onClick={handleDropZoneClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {file ? (
              <>
                <MdInsertDriveFile className={styles.fileIcon} />
                <p className={styles.fileName}>{file.name}</p>
              </>
            ) : (
              <>
                <MdCloudUpload className={styles.uploadIcon} />
                <p>Drag and drop a PDF file here or click to upload</p>
              </>
            )}
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className={styles.fileInput}
            />
          </div>
          <button
            onClick={() => handleSubmit(false)}
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Submit"}
          </button>
        </div>
      </div>

      <div className={styles.uploadsContainer}>
        <h3 className={styles.uploadsTitle}>Uploaded Files</h3>
        <div className={styles.tableContainer}>
          <table className={styles.uploadsTable}>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>File</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {uploads.length > 0 ? (
                uploads.map((upload) => (
                  <tr key={upload.uploads_id}>
                    <td>{upload.event_name}</td>
                    <td>
                      <a
                        href={upload.pdf_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewPdf}
                      >
                        View PDF
                      </a>
                    </td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          styles[upload.status.toLowerCase()]
                        }`}
                      >
                        {upload.status}
                      </span>
                      {upload.status === "Approved" && (
                        <Button
                          onClick={() => handleRegisterEvent(upload)}
                          className={styles.registerButton}
                        >
                          Register Event Now
                        </Button>
                      )}
                    </td>
                    <td>{new Date(upload.uploaded_at).toLocaleString()}</td>
                    <td>
                      <Button
                        onClick={() => handleReplaceFile(upload)}
                        disabled={upload.status === "Approved"}
                      >
                        Replace File
                      </Button>
                    </td>
                    <td>{upload?.remark}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={styles.noFiles}>
                    No files uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title={`Replace File for ${selectedUpload?.event_name}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="replace"
            type="primary"
            onClick={() => handleSubmit(true)}
            disabled={isLoading || !file}
          >
            {isLoading
              ? "Replacing..."
              : `Replace File for ${selectedUpload?.event_name}`}
          </Button>,
        ]}
      >
        <div className={styles.modalContent}>
          <div
            className={`${styles.dropZone} ${file ? styles.hasFile : ""}`}
            onClick={handleDropZoneClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {file ? (
              <>
                <MdInsertDriveFile className={styles.fileIcon} />
                <p className={styles.fileName}>{file.name}</p>
              </>
            ) : (
              <>
                <MdCloudUpload className={styles.uploadIcon} />
                <p>Drag and drop a PDF file here or click to upload</p>
              </>
            )}
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={handleFileChange}
              className={styles.fileInput}
            />
          </div>
        </div>
      </Modal>

      <Drawer
        title={`Register Event: ${selectedEvent?.event_name}`}
        placement="right"
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleRegisterSubmit}>
          <Form.Item
            name="event_name"
            label="Event Name"
            initialValue={selectedEvent?.event_name}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select mode="multiple">
              {categories.map((category) => (
                <Select.Option key={category.act_id} value={category.act_id}>
                  {category.activity_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="date_range"
            label="Date Range"
            rules={[{ required: true }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item
            name="time_range"
            label="Time Range"
            rules={[{ required: true }]}
          >
            <TimePicker.RangePicker />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="poster" label="Poster" rules={[{ required: true }]}>
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Poster</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register Event
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default UploadEventRequest;
