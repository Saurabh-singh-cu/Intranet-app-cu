import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import QrScanner from "qr-scanner"; // We'll use this for QR scanning
import "./MarkAttendance.css";

const MarkAttendance = () => {
  const [hasCamera, setHasCamera] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cameraList, setCameraList] = useState([]); // For storing camera devices
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

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
      const videoDevices = devices.filter((device) => device.kind === "videoinput");
      setHasCamera(videoDevices.length > 0);

      if (videoDevices.length > 0) {
        setCameraList(videoDevices); // Store camera devices
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
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop()); // Stop camera after permission check
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
    if (error.name === "NotFoundError") {
      Swal.fire({
        title: "Camera Not Found",
        text: "No camera detected. Ensure your device has a working camera.",
        icon: "error",
      });
    } else if (error.name === "NotAllowedError") {
      Swal.fire({
        title: "Permission Denied",
        text: "You denied camera access. Enable it in your browser settings.",
        icon: "error",
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred while accessing the camera.",
        icon: "error",
      });
    }
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
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = stream;

      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log("QR Code detected:", result);
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

      Swal.fire({
        title: "Scanning...",
        text: "Point your camera at the QR code.",
        icon: "info",
        timer: 3000,
        timerProgressBar: true,
      });
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
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setScanning(false);
  };

  return (
    <div className="attendance-container">
      <h1 className="attendance-title">Mark Attendance</h1>
      <p className="camera-status">
        {hasCamera ? "Camera detected" : "No camera detected"}
        {hasCamera && (permissionGranted ? " - Permission granted" : " - Permission needed")}
      </p>
      {hasCamera && cameraList.length > 0 && (
        <div className="camera-info">
          <h3>Available Cameras:</h3>
          <ul>
            {cameraList.map((camera, index) => (
              <li key={index}>
                {camera.label || `Camera ${index + 1}`} - Device ID: {camera.deviceId}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        className="scan-button"
        onClick={scanning ? stopScanning : startScanning}
        disabled={!hasCamera || !permissionGranted}
      >
        {scanning ? "Stop Scanning" : "Scan QR Code"}
      </button>
      <div className="qr-container">
        {scanning ? (
          <video ref={videoRef} className="qr-video" autoPlay playsInline />
        ) : (
          <div className="qr-placeholder">QR Code will appear here</div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
