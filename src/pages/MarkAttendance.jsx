import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import QrScanner from "qr-scanner";
import "./MarkAttendance.css";
import axios from "axios";

const MarkAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const [hasCamera, setHasCamera] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  axios.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  useEffect(() => {
    checkForCamera();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
      }
    };
  }, []);

  const checkForCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setHasCamera(videoDevices.length > 0);

      if (videoDevices.length > 0) {
        requestCameraPermission();
      } else {
        Swal.fire({
          title: "No Camera Detected",
          text: "This device doesn't seem to have a camera.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error checking for camera:", error);
      setHasCamera(false);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setPermissionGranted(true);

      Swal.fire({
        title: "Permission Granted",
        text: "Camera access granted successfully.",
        icon: "success",
      });
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      handleCameraError(error);
    }
  };

  const handleCameraError = (error) => {
    const errorMessages = {
      NotFoundError:
        "No camera detected. Ensure your device has a working camera.",
      NotAllowedError:
        "You denied camera access. Enable it in your browser settings.",
    };
    Swal.fire({
      title: "Error",
      text:
        errorMessages[error.name] ||
        "An unexpected error occurred while accessing the camera.",
      icon: "error",
    });
  };

  const startScanning = async () => {
    if (!hasCamera || !permissionGranted) {
      Swal.fire({
        title: "Camera Unavailable",
        text: "Ensure your device has a camera and you have granted permission.",
        icon: "error",
      });
      return;
    }

    try {
      setScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      videoRef.current.srcObject = stream;

      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log(result, "RESULT AFTER SCANNING");
          stopScanning();
          Swal.fire({
            title: "Success!",
            text: `Attendance marked successfully! QR Code: ${result}`,
            icon: "success",
          });
        },
        { returnDetailedScanResult: true }
      );

      await scannerRef.current.start();
    } catch (error) {
      console.error("Error accessing camera for scanning:", error);
      setScanning(false);
      handleCameraError(error);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setScanning(false);
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const response = await axios.post(
        "http://172.17.2.247:8080/intranetapp/events/ready-for-attendance/",
        {
          reg_id: userData?.secretary_details?.reg_id,
        }
      );
      console.log(response.data, "API Response"); // Log the actual data structure
      setAttendanceData(response.data); // Adjust this if the response structure is different
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleMarkAttendance = async (eventId) => {
    if (!hasCamera || !permissionGranted) {
      Swal.fire({
        title: "Camera Unavailable",
        text: "Ensure your device has a camera and you have granted permission.",
        icon: "error",
      });
      return;
    }

    setActiveAccordion(eventId); // Open the accordion for the event
    setScanning(true); // Start scanning
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      videoRef.current.srcObject = stream;

      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log(result, "Scanned Result");
          stopScanning(); // Stop scanning after success
          Swal.fire({
            title: "Attendance Marked!",
            text: `QR Code: ${result}`,
            icon: "success",
          });

          // Optionally, make an API call to mark attendance here
          // Example:
          // markAttendanceForEvent(eventId, result);
        },
        { returnDetailedScanResult: true }
      );

      await scannerRef.current.start();
    } catch (error) {
      console.error("Error accessing camera for scanning:", error);
      setScanning(false);
      handleCameraError(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="attendance-container">
        {/* <h1 className="attendance-title">Mark Attendance</h1> */}
        <button
          className="scan-button"
          onClick={scanning ? stopScanning : startScanning}
          disabled={!hasCamera || !permissionGranted}
        >
          {scanning ? "Stop Scanning" : "Scan QR Code"}
        </button>
        <div className="qr-container">
          {scanning ? (
            <div className="qr-scanner-wrapper">
              <video ref={videoRef} className="qr-video" autoPlay playsInline />
              <div className="qr-placeholder-overlay">
                <div className="qr-placeholder" />
              </div>
            </div>
          ) : (
            <div className="qr-placeholder"></div>
          )}
        </div>
      </div>
      <h1 className="attendance-title">Mark Attendance</h1>
      <div className="events-container">
        {attendanceData.map((item) => (
          <div key={item.er_id} className="event-item-1">
            <button
              className="event-header"
              onClick={() => toggleAccordion(item.er_id)}
            >
              <span className="event-name">
                {item.event_name.toUpperCase()}
              </span>
              <span
                className={`arrow ${
                  activeAccordion === item.er_id ? "active-1" : ""
                }`}
              >
                ▼
              </span>
            </button>
            {activeAccordion === item.er_id && (
              <div className="event-details">
                <div className="time-cards">
                  <div className="time-card check-in">
                    <div className="card-header">
                      <span className="card-icon">⏰</span>
                      Check In
                    </div>
                    <div className="card-time">
                      {formatTime(item.start_time)}
                    </div>
                    <div className="card-date">{item.start_date}</div>
                  </div>
                  <div className="time-card check-out">
                    <div className="card-header">
                      <span className="card-icon">🏁</span>
                      Check Out
                    </div>
                    <div className="card-time">{formatTime(item.end_time)}</div>
                    <div className="card-date">{item.end_date}</div>
                  </div>
                  <div className="time-card mark-attendance">
                    <div className="card-header">
                      <span className="card-icon">✅</span>
                      Mark Attendance
                    </div>
                    <button
                      className="mark-attendance-btn"
                      onClick={() => handleMarkAttendance(item.er_id)}
                    >
                      Mark Attendance
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default MarkAttendance;
