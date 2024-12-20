import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import {
  MdCloudUpload,
  MdInsertDriveFile,
  MdOutlineAccessTime,
  MdOutlineCancel,
} from "react-icons/md";
import {
  Modal,
  Button,
  Form,
  Input,
  DatePicker,
  Upload,
  Drawer,
  Select,
  TimePicker,
  InputNumber,
  Slider,
  message,
} from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import styles from "./UploadEventRequest.module.css";
import { FaEyeDropper } from "react-icons/fa";
import { FaCheck, FaRegFilePdf } from "react-icons/fa6";

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
  const [posterFile, setPosterFile] = useState(null);
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
      Swal.fire({
        title: "Uploaded Success",
        text: `${info.file.name} file uploaded successfully`,
        icon: "success",
      });
    } else if (info.file.status === "error") {
      Swal.fire({
        title: "Uploaded Failed",
        text: `${info.file.name} file upload failed.`,
        icon: "error",
      });
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
      Swal.fire({
        title: "Failed to load data!",
        text: `${error?.message}`,
        icon: "error",
      });
    }
  };

  const handleRegisterSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("uploads_id", selectedEvent.uploads_id);
      formData.append("reg_id", getRegId());
      formData.append("act_id", values.category[0]); // Assuming single category selection
      formData.append("event_name", values.event_name);
      formData.append("status", "Pending");
      formData.append("start_date", values.date_range[0].format("YYYY-MM-DD"));
      formData.append("start_time", values.time_range[0].format("HH:mm:ss"));
      formData.append("end_date", values.date_range[1].format("YYYY-MM-DD"));
      formData.append("end_time", values.time_range[1].format("HH:mm:ss"));
      formData.append("limit", values.member_limit);
      formData.append("description", values.description);
 
      if (posterFile) formData.append("poster", posterFile);
      const reg_id = getRegId();

      const response = await axios.post(
        `http://172.17.2.247:8080/intranetapp/event-request/?reg_id=${reg_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        title: "Event registered successfully",

        icon: "success",
      });
      setIsDrawerVisible(false);
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        title: "Failed to register event",
        text: error.response?.data?.message || "Failed to register event",
        icon: "error",
      });
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
        <div className={styles.colorLegend}>
        <span className={styles.legendItem}>
          <span className={styles.colorBox} style={{backgroundColor: '#ffcccb'}}></span>
          Cancelled
        </span>
        <span className={styles.legendItem}>
          <span className={styles.colorBox} style={{backgroundColor: '#ffe5b4'}}></span>
          Pending
        </span>
        <span className={styles.legendItem}>
          <span className={styles.colorBox} style={{backgroundColor: '#90ee90'}}></span>
          Ready for Publishing
        </span>
      </div>
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
                    <td>
                      <span
                        className={`${
                          upload?.status === "Approved"
                            ? styles.greenText
                            : upload?.status === "Pending"
                            ? styles.orangeText
                            : styles.redText
                        }`}
                      >
                        {upload.event_name}
                      </span>
                    </td>
                    <td>
                      <a
                        href={upload.pdf_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewPdf}
                      >
                        <FaRegFilePdf />
                      </a>
                    </td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          styles[upload.status.toLowerCase()]
                        }`}
                      >
                        {upload.status === "Approved" ? (
                          <FaCheck />
                        ) : upload.status === "Pending" ? (
                          <MdOutlineAccessTime />
                        ) : (
                          <MdOutlineCancel />
                        )}
                      </span>
                      {upload.status === "Approved" && (
                        // <Button
                        //   onClick={() => handleRegisterEvent(upload)}
                        //   className={styles.registerButton}
                        // >
                        //   Publish Event
                        // </Button>
                        <p onClick={() => handleRegisterEvent(upload)} className={styles.textPub} >Publish Event</p>
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
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegisterSubmit}
          initialValues={{
            event_name: selectedEvent?.event_name,
            member_limit: 100,
          }}
          className="event-registration-form"
        >
          <Form.Item name="event_name" label="Event Name">
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[
              {
                required: true,
                message: "Please select at least one category",
              },
            ]}
          >
            <Select mode="multiple" placeholder="Select categories">
              {categories.map((category) => (
                <Select.Option key={category.act_id} value={category.act_id}>
                  {category.activity_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="member_limit"
            label="Member Limit"
            rules={[{ required: true, message: "Please set the member limit" }]}
          >
            <Slider
              min={10}
              max={10000}
              marks={{
                10: "10",
                2500: "2.5K",
                5000: "5K",
                7500: "7.5K",
                10000: "10K+",
              }}
              className="member-limit-slider"
            />
          </Form.Item>

          <Form.Item
            name="date_range"
            label="Date Range"
            rules={[
              { required: true, message: "Please select the date range" },
            ]}
          >
            <DatePicker.RangePicker />
          </Form.Item>

          <Form.Item
            name="time_range"
            label="Time Range"
            rules={[
              { required: true, message: "Please select the time range" },
            ]}
          >
            <TimePicker.RangePicker format="HH:mm:ss" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="poster"
            label="Poster"
            rules={[{ required: true, message: "Please upload a poster" }]}
          >
            <Upload.Dragger
              name="poster"
              multiple={false}
              beforeUpload={(file) => {
                setPosterFile(file);
                return false;
              }}
              onChange={(info) => {
                const { status } = info.file;
                if (status === "done") {
                  Swal.fire({
                    title: "Uploaded Success",
                    text: `${info.file.name} poster file uploaded successfully.`,
                    icon: "success",
                  });
                } else if (status === "error") {
                  Swal.fire({
                    title: "Uploaded Failed",
                    text: `${info.file.name} poster file upload failed.`,
                    icon: "error",
                  });
                }
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to upload poster
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Event Request
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default UploadEventRequest;
