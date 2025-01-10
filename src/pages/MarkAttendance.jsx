// import React, { useState, useEffect, useRef } from "react";
// import Swal from "sweetalert2";
// import QrScanner from "qr-scanner";
// import axios from "axios";
// import { message, notification } from "antd"; // Ant Design Notification import
// import "./MarkAttendance.css";

// const MarkAttendance = () => {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeAccordion, setActiveAccordion] = useState(null);
//   const [scanning, setScanning] = useState(false);
//   const [hasCamera, setHasCamera] = useState(false);
//   const [permissionGranted, setPermissionGranted] = useState(false);
//   const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
//   const [customMessage, setCustomMessage] = useState("");
//   const [messageType, setMessageType] = useState(""); // "error" or "success"
//   const [scanningInProgress, setScanningInProgress] = useState(false);

//   const [lastScannedTime, setLastScannedTime] = useState(0); // Track the last scan time
//   const [debounceTimeout, setDebounceTimeout] = useState(null); // Timer reference for debouncing

//   const videoRef = useRef(null);
//   const scannerRef = useRef(null);

//   axios.interceptors.request.use((config) => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     const token = user?.access;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   });

//   useEffect(() => {
//     checkForCamera();
//     fetchAttendanceData();
//     return () => {
//       if (scannerRef.current) {
//         scannerRef.current.destroy();
//       }
//     };
//   }, []);

//   const checkForCamera = async () => {
//     try {
//       const devices = await navigator?.mediaDevices?.enumerateDevices();
//       console.log("CAMERA",navigator?.mediaDevices)
//       const videoDevices = devices.filter(
//         (device) => device.kind === "videoinput"
//       );
//       setHasCamera(videoDevices.length > 0);

//       if (videoDevices.length > 0) {
//         await requestCameraPermission();
//       } else {
//         Swal.fire({
//           title: "No Camera Detected",
//           text: "This device doesn't seem to have a camera.",
//           icon: "error",
//         });
//       }
//     } catch (error) {
//       console.error("Error checking for camera:", error);
//       setHasCamera(false);
//     }
//   };

//   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         // Successfully got access to the camera and microphone
//         console.log('Stream:', stream);
//         // You can now attach the stream to a video element to display it
//         const videoElement = document.querySelector('video');
//         videoElement.srcObject = stream;
//       })
//       .catch((error) => {
//         // Handle error (e.g., user denied access)
//         console.error('Error accessing media devices:', error);
//       });
//   } else {
//     console.log('getUserMedia is not supported in this browser.');
//   }

//   const requestCameraPermission = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       stream.getTracks().forEach((track) => track.stop());
//       setPermissionGranted(true);
//     } catch (error) {
//       console.error("Error requesting camera permission:", error);
//       handleCameraError(error);
//     }
//   };

//   const handleCameraError = (error) => {
//     const errorMessages = {
//       NotFoundError:
//         "No camera detected. Ensure your device has a working camera.",
//       NotAllowedError:
//         "You denied camera access. Enable it in your browser settings.",
//       default: "An unexpected error occurred while accessing the camera.",
//     };
//     Swal.fire({
//       title: "Error",
//       text: errorMessages[error.name] || errorMessages.default,
//       icon: "error",
//     });
//   };

//   const fetchAttendanceData = async () => {
//     try {
//       const userData = JSON.parse(localStorage.getItem("user"));
//       const response = await axios.post(
//         "http://172.17.2.247:8080/intranetapp/events/ready-for-attendance/",
//         {
//           reg_id: userData?.secretary_details?.reg_id,
//         }
//       );
//       setAttendanceData(response.data);
//       if (response.data.length > 0) {
//         setActiveAccordion(response.data[0].er_id);
//       }
//     } catch (error) {
//       console.error("Error fetching attendance data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startScanning = async (eventId) => {
//     if (!hasCamera || !permissionGranted) {
//       setCustomMessage(
//         "Ensure your device has a camera and you have granted permission."
//       );
//       setMessageType("error");
//       setTimeout(() => {
//         setCustomMessage("");
//       }, 2000);
//       return;
//     }

//     try {
//       if (scanningInProgress) return;

//       setScanningInProgress(true);
//       setScanning(true);

//       // Stop previous camera stream if exists
//       if (videoRef.current.srcObject) {
//         const tracks = videoRef.current.srcObject.getTracks();
//         tracks.forEach((track) => track.stop());
//         videoRef.current.srcObject = null; // Clear the previous stream
//       }

//       // Get new camera stream
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "environment" },
//       });

//       videoRef.current.srcObject = stream;

//       scannerRef.current = new QrScanner(
//         videoRef.current,
//         (result) => {
//           const currentTime = Date.now();
//           if (!isAttendanceMarked && currentTime - lastScannedTime > 3000) {
//             setIsAttendanceMarked(true);
//             setLastScannedTime(currentTime);
//             handleAttendanceMarking(eventId, result.data);
//           }
//         },
//         { returnDetailedScanResult: true }
//       );

//       await scannerRef.current.start();
//     } catch (error) {
//       console.error("Error accessing camera for scanning:", error);
//       setScanning(false);
//       setCustomMessage("Error accessing camera. Please try again.");
//       setMessageType("error");
//       setTimeout(() => {
//         setCustomMessage("");
//       }, 2000);
//     }
//   };

//   const handleAttendanceMarking = async (eventId, qrCode) => {
//     try {
//       const userData = JSON.parse(localStorage.getItem("user"));
//       const response = await axios.post(
//         "http://172.17.2.247:8080/intranetapp/mark_attendance/",
//         {
//           qr_code: qrCode,
//           er_id: eventId,
//           reg_id: userData?.secretary_details?.reg_id,
//         }
//       );

//       // Show success message for 3 seconds
//       setCustomMessage(`${response?.detail}! QR Code: ${qrCode}`);
//       setMessageType("success");

//       // Clear the success message after 3 seconds
//       setTimeout(() => {
//         setCustomMessage("");
//         setScanningInProgress(false); // Reset scanning flag after success
//       }, 3000);

//       // Allow new scans after a short delay
//       setIsAttendanceMarked(false); // Reset the flag after delay
//     } catch (error) {
//       console.error("Error marking attendance:", error);
//       setCustomMessage(`${error?.response?.data?.detail}`);
//       setMessageType("error");

//       // Clear the error message after 2 seconds
//       setTimeout(() => {
//         setCustomMessage("");
//         setScanningInProgress(false); // Reset scanning flag after failure
//       }, 7000); // 2 seconds for error message

//       setIsAttendanceMarked(false); // Reset the flag in case of an error
//     }
//   };

//   const stopScanning = () => {
//     if (scannerRef.current) {
//       scannerRef.current.stop();
//     }

//     // Stop and clean up video stream
//     if (videoRef.current?.srcObject) {
//       const tracks = videoRef.current.srcObject.getTracks();
//       tracks.forEach((track) => track.stop());
//       videoRef.current.srcObject = null; // Clear the stream
//     }

//     setScanning(false);
//   };

//   const formatTime = (time) => {
//     return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   return (
//     <div className="mark-attendance">
//       <div className="events-container-1">
//         <h2 className="events-title">Ongoing Events</h2>
//         {attendanceData.map((item) => (
//           <div key={item.er_id} className="event-item-1">
//             <button
//               className={`event-header ${
//                 activeAccordion === item.er_id ? "active" : ""
//               }`}
//               onClick={() =>
//                 !scanning &&
//                 setActiveAccordion(
//                   activeAccordion === item.er_id ? null : item.er_id
//                 )
//               }
//               disabled={scanning}
//             >
//               <span className="event-name">{item.event_name}</span>
//               <span
//                 className={`arrow ${
//                   activeAccordion === item.er_id ? "active-1" : ""
//                 }`}
//               >
//                 ▼
//               </span>
//             </button>
//             {activeAccordion === item.er_id && !scanning && (
//               <div className="event-details">
//                 <div className="time-cards">
//                   <div className="time-card check-in">
//                     <div className="card-header check-green">
//                       <span className="card-icon">⏰</span>
//                       Check In
//                     </div>
//                     <div className="card-time">
//                       {formatTime(item.start_time)}
//                     </div>
//                     <div className="card-date">{item.start_date}</div>
//                   </div>
//                   <div className="time-card check-out">
//                     <div className="card-header check-red">
//                       <span className="card-icon">🏁</span>
//                       Check Out
//                     </div>
//                     <div className="card-time">{formatTime(item.end_time)}</div>
//                     <div className="card-date">{item.end_date}</div>
//                   </div>
//                   <div className="time-card mark-attendance">
//                     <div className="card-header">
//                       <span className="card-icon">✅</span>
//                       Mark Attendance
//                     </div>
//                     <button
//                       className="mark-attendance-btn"
//                       onClick={() => startScanning(item.er_id)}
//                     >
//                       Mark Attendance
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//       {scanning && (
//         <div className="scanner-overlay">
//           <div className="scanner-container">
//             <h2 className="scanner-title">Scan QR Code</h2>
//             <div className="qr-container">
//               <div className="qr-scanner-wrapper">
//                 <video
//                   ref={videoRef}
//                   className="qr-video"
//                   autoPlay
//                   playsInline
//                 />
//                 <div className="qr-placeholder-overlay">
//                   <div className="qr-placeholder" />
//                 </div>
//               </div>
//             </div>
//             {customMessage && (
//               <p className={`custom-message ${messageType}`}>{customMessage}</p>
//             )}
//             <button className="cancel-scan-button" onClick={stopScanning}>
//               Cancel Scanning
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MarkAttendance;
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import QrScanner from "qr-scanner";
import axios from "axios";
import { message, notification } from "antd"; // Ant Design Notification import
import "./MarkAttendance.css";

const MarkAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" or "success"
  const [scanningInProgress, setScanningInProgress] = useState(false);

  const [lastScannedTime, setLastScannedTime] = useState(0); // Track the last scan time
  const [debounceTimeout, setDebounceTimeout] = useState(null); // Timer reference for debouncing

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
    fetchAttendanceData();
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
        await requestCameraPermission();
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
      setPermissionGranted(true); // Camera permission granted
      setCustomMessage("Camera permission granted!");
      setMessageType("success");
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
      default: "An unexpected error occurred while accessing the camera.",
    };
    Swal.fire({
      title: "Error",
      text: errorMessages[error.name] || errorMessages.default,
      icon: "error",
    });
    setPermissionGranted(false); // Camera permission denied or failed
  };

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const response = await axios.post(
        "http://172.17.2.247:8080/intranetapp/events/ready-for-attendance/",
        {
          reg_id: userData?.secretary_details?.reg_id,
        }
      );
      setAttendanceData(response.data);
      if (response.data.length > 0) {
        setActiveAccordion(response.data[0].er_id);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const startScanning = async (eventId) => {
    if (!hasCamera || !permissionGranted) {
      setCustomMessage(
        "Ensure your device has a camera and you have granted permission."
      );
      setMessageType("error");

      // Clear the message after 2 seconds
      setTimeout(() => {
        setCustomMessage("");
      }, 2000);

      return;
    }

    try {
      if (scanningInProgress) return; // Prevent scanning if already in progress

      setScanningInProgress(true); // Set scanning flag to true
      setScanning(true); // Start scanning

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      videoRef.current.srcObject = stream;

      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          // Ensure attendance is not marked again if it's already been done
          const currentTime = Date.now();
          if (!isAttendanceMarked && currentTime - lastScannedTime > 3000) {
            // Check for a 3-second debounce
            setIsAttendanceMarked(true); // Set flag to true to prevent further scans
            setLastScannedTime(currentTime); // Update the last scan time
            handleAttendanceMarking(eventId, result.data);
          }
        },
        { returnDetailedScanResult: true }
      );

      await scannerRef.current.start();
    } catch (error) {
      console.error("Error accessing camera for scanning:", error);
      setScanning(false);
      setCustomMessage("Error accessing camera. Please try again.");
      setMessageType("error");

      // Clear the message after 2 seconds
      setTimeout(() => {
        setCustomMessage("");
      }, 2000);
    }
  };

  const handleAttendanceMarking = async (eventId, qrCode) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const response = await axios.post(
        "http://172.17.2.247:8080/intranetapp/mark_attendance/",
        {
          qr_code: qrCode,
          er_id: eventId,
          reg_id: userData?.secretary_details?.reg_id,
        }
      );
      console.log(response, "WWWWW");
      // Show success message for 3 seconds
      setCustomMessage(`${response?.data?.detail}! QR Code: ${qrCode}`);
      setMessageType("success");

      // Clear the success message after 3 seconds
      setTimeout(() => {
        setCustomMessage("");
        setScanningInProgress(false); // Reset scanning flag after success
      }, 3000);

      // Allow new scans after a short delay
      setIsAttendanceMarked(false); // Reset the flag after delay
    } catch (error) {
      console.error("Error marking attendance:", error);
      setCustomMessage(`${error?.response?.data?.detail}`);
      setMessageType("error");

      // Clear the error message after 2 seconds
      setTimeout(() => {
        setCustomMessage("");
        setScanningInProgress(false); // Reset scanning flag after failure
      }, 7000); // 2 seconds for error message

      setIsAttendanceMarked(false); // Reset the flag in case of an error
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
    window.location.reload();
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="mark-attendance">
      <div className="events-container-1">
        <h2 className="events-title">Ongoing Events</h2>
        {loading === true ? (
          <><div style={{}} className="loader"></div></>
        ) : (
          <>
            {" "}
            {attendanceData.map((item) => (
              <div key={item.er_id} className="event-item-1">
                <button
                  className={`event-header ${
                    activeAccordion === item.er_id ? "active" : ""
                  }`}
                  onClick={() =>
                    !scanning &&
                    setActiveAccordion(
                      activeAccordion === item.er_id ? null : item.er_id
                    )
                  }
                  disabled={scanning}
                >
                  <span className="event-name">{item.event_name}</span>
                  <span
                    className={`arrow ${
                      activeAccordion === item.er_id ? "active-1" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {activeAccordion === item.er_id && !scanning && (
                  <div className="event-details">
                    <div className="time-cards">
                      <div className="time-card check-in">
                        <div className="card-header check-green">
                          <span className="card-icon">⏰</span>
                          Check In
                        </div>
                        <div className="card-time">
                          {formatTime(item.start_time)}
                        </div>
                        <div className="card-date">{item.start_date}</div>
                      </div>
                      <div className="time-card check-out">
                        <div className="card-header check-red">
                          <span className="card-icon">🏁</span>
                          Check Out
                        </div>
                        <div className="card-time">
                          {formatTime(item.end_time)}
                        </div>
                        <div className="card-date">{item.end_date}</div>
                      </div>
                      <div className="time-card mark-attendance">
                        <div className="card-header">
                          <span className="card-icon">✅</span>
                          Mark Attendance
                        </div>
                        <button
                          className="mark-attendance-btn"
                          onClick={() => startScanning(item.er_id)}
                        >
                          Mark Attendance
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
      {scanning && (
        <div className="scanner-overlay">
          <div className="scanner-container">
            <h2 className="scanner-title">Scan QR Code</h2>
            <div className="qr-container">
              <div className="qr-scanner-wrapper">
                <video
                  ref={videoRef}
                  className="qr-video"
                  autoPlay
                  playsInline
                />
                <div className="qr-placeholder-overlay">
                  <div className="qr-placeholder" />
                </div>
              </div>
            </div>
            <button className="cancel-scan-button" onClick={stopScanning}>
              Stop Scanning
            </button>
            {customMessage && (
              <div className={`custom-message ${messageType}`}>
                {customMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
