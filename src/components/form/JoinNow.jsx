import React, { useEffect, useState } from "react";
import { message, notification } from "antd";
import barcoder from "../../assets/images/barcode.jpeg";
import joinus from "../../assets/images/joinus.jpg";
import "./JoinNow.css";
import axios from "axios";
import Swal from "sweetalert2";
import LightBulbCharacter from "./WalkingMan";
import WalkingMan from "./WalkingMan";

const JoinNow = () => {
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  const [submitTimer, setSubmitTimer] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [entity, setEntity] = useState("");
  const [entityType, setEntityType] = useState("");
  const [name, setName] = useState("");
  const [uid, setUid] = useState("");
  const [department, setDepartment] = useState("");
  const [otp, setOtp] = useState("");
  const [membershipId, setMembershipId] = useState("");

  const [errors, setErrors] = useState({});

  const [entityData, setEntityData] = useState([]);
  const [entityListData, setEntityListData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [countryCode, setCountryCode] = useState(""); // New state for country code
  const [mobileNumber, setMobileNumber] = useState(""); // New state for mobile number
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  const [walkingManPosition, setWalkingManPosition] = useState("left");
  const [showWalkingMan, setShowWalkingMan] = useState(true);

  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setWalkingManPosition((prev) => (prev === "left" ? "right" : "left"));
    }, 10000); // Change position every 10 seconds

    const hideIntervalId = setInterval(() => {
      setShowWalkingMan((prev) => !prev);
    }, 15000); // Toggle visibility every 15 seconds

    return () => {
      clearInterval(intervalId);
      clearInterval(hideIntervalId);
    };
  }, []);

  const formateTimer = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return (
      <p style={{ color: "red" }}>
        {min} : {sec < 10 ? "0" : ""} {sec}
      </p>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitTimer(10);
    const timer = setInterval(() => {
      setSubmitTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (uid) {
      setEmail(`${uid}`);
    }
  }, [uid]);

  const handleFinalSubmit = async () => {
    try {
      const response = await axios.post(
        "http://172.17.2.176:8080/intranetapp/final_submit/",
        {
          membership_id: membershipId,
          transaction_id: transactionId,
        }
      );
      Swal.fire({
        title: "Payment Success",
        text: "We will be in touch ",
        icon: "success",
      });
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Final submission failed:", error);

      Swal.fire({
        title: "Failed",
        text: `Final submission failed:, ${error}`,
        icon: "error",
      });
      Swal.fire({
        title: `${error}`,
        icon: "error",
      });
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    if (!value.includes("@")) {
      setEmail(value);
    }
  };

  const handleSendOTP = async () => {
    try {
      setIsFormDisabled(true);
      const response = await axios.post(
        "http://172.17.2.176:8080/intranetapp/send_otp_email/",
        {
          member_name: name,
          member_email: `${email}@cumail.in`,
          dept_id: department,
          entity_id: entity,
          reg_id: entityType,
          member_mobile: `${countryCode}${mobileNumber}`,
          member_uid: uid,
        }
      );
      console.log("Email sent ", response?.data);
      Swal.fire({
        title: "OTP sent!",
        text: "OTP sent to your email",
        icon: "success",
      });
      setOtpTimer(120);
      setMembershipId(response?.data?.member_id);
      const timer = setInterval(() => {
        setOtpTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsFormDisabled(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to send OTP:", error);

      Swal.fire({
        title: "Failed to send OTP",
        text: `Please try again!, ${error?.response?.data?.error} `,
        icon: "warning",
      });
      setIsFormDisabled(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post(
        "http://172.17.2.176:8080/intranetapp/verify_otp/",
        {
          membership_id: membershipId,
          otp: otp,
        }
      );
      console.log("OTP verified successfully");
      setIsVerified(true);
      Swal.fire({
        title: "You are genuine",
        text: "OTP verified successfully",
        icon: "success",
      });
      setTimeout(() => {
        setShowPayment(true);
      }, 4000);
    } catch (error) {
      console.error("OTP verification failed:", error);
      Swal.fire({
        title: "Went Wrong",
        text: `${error?.response?.data?.error}`,
        icon: "error",
      });
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!entity) newErrors.entity = "Please select an entity";
    if (!entityType) newErrors.entityType = "Please select an entity type";
    if (!name) newErrors.name = "Please enter your name";
    if (!uid) newErrors.uid = "Please enter your UID";
    if (!department) newErrors.department = "Please select a department";
    if (!email) newErrors.email = "Please enter your email";
    if (!isVerified) newErrors.otp = "Please verify your OTP";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextPage = () => {
    if (validateForm() && isVerified) {
      setShowPayment(true);
    } else {
      message.error(
        "Please fill all fields and verify your email before proceeding."
      );
    }
  };

  const apiUrls = {
    "entity-types": "http://172.17.2.176:8080/intranetapp/entity-types/",
    departments: "http://172.17.2.176:8080/intranetapp/departments/",
    currentSession: "http://172.17.2.176:8080/intranetapp/current_session/",
  };

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiUrls.departments);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntityData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiUrls["entity-types"]);
      setEntityData(response.data);
    } catch (error) {
      console.error("Error fetching entity data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntityList = async (entityId) => {
    setEntityListData([]);

    if (!entityId) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://172.17.2.176:8080/intranetapp/entity-registration-name/?entity_id=${entityId}`
      );
      setEntityListData(response.data);
      console.log(response.data, "Updated entity list");
    } catch (error) {
      console.error("Error fetching entity list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntityData();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (entity) {
      fetchEntityList(entity);
    } else {
      setEntityListData([]);
    }
    setEntityType("");
  }, [entity]);

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;

    if (name === "uid") {
      if (value.length >= 9) {
        const uidPattern = /^\d{2}[A-Za-z]{3}\d{4,5}$/;
        if (!uidPattern.test(value)) {
          setErrors((prev) => ({
            ...prev,
            uid: "UID must start with 2 digits, followed by 3 letters, and end with 4 to 7 digits",
          }));

          Swal.fire({
            title: "Wrong Email",
            text: "UID must start with 2 digits, followed by 3 letters, and end with 4 to 7 digits ",
            icon: "warning",
          });
        } else {
          setErrors((prev) => ({ ...prev, uid: "" }));
        }
      } else {
        setErrors((prev) => ({ ...prev, uid: "" }));
      }
    }
    setter(value);
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  if (showPayment) {
    return (
      <div className="payment-container">
        <div className="payment-content">
          <div className="payment-header">
            <h1>Payment Gateway.</h1>
            <p>
              A simple and responsive payment checkout experience designed by
              CU-Intranet.
            </p>
            <div>
              {timeLeft > 0 ? (
                <h3>
                  Time Left to complete this payment {formateTimer(timeLeft)}
                </h3>
              ) : (
                <h3 style={{ color: "red" }}>
                  Time has expired please go back and fill the form and come
                  here again.
                </h3>
              )}
            </div>
          </div>
          <div className="payment-form">
            <h2>Payment</h2>
            <form onSubmit={handleSubmit}>
              <img src={barcoder} alt="Barcode" />
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter Transaction ID"
                className="input-field-join"
              />
              <button
                style={{ marginTop: "14px" }}
                type="submit"
                className="pay-button"
                disabled={submitTimer > 0}
              >
                {submitTimer > 0
                  ? `Submitting in ${submitTimer}s`
                  : "Submit Payment"}
              </button>
            </form>
            <p className="terms">
              Your personal data will be used to process your order, support
              your experience throughout this website, and for other purposes
              described in our privacy policy.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccessMessage) {
    return (
      <div className="success-message">
        <h2>Registration Successful!</h2>
        <p>
          Thank you for joining CU-Intranet. Your account has been created
          successfully.
        </p>
      </div>
    );
  }

  return (
    <div className="joinnow-container" style={{ width: "100%" }}>
      {/* {showWalkingMan && <WalkingMan position={walkingManPosition} />} */}
      <div className="joinnow-form">
        <div className="form-header">
          <h1>JOIN US</h1>
        </div>

        <form>
          <div className="form-section">
            <div className="section-header">PERSONAL INFORMATION</div>
            <div className="section-content">
              <div className="input-row-joinnow">
                <div className="input-group-joinnow">
                  <label className="label-joinnow" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input-field-join"
                    value={name}
                    onChange={(e) => handleInputChange(e, setName)}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <div className="error-message">{errors.name}</div>
                  )}
                </div>
                <div className="input-group-joinnow">
                  <label className="label-joinnow" htmlFor="uid">
                    UID
                  </label>
                  <input
                    type="text"
                    id="uid"
                    name="uid"
                    className="input-field-join"
                    value={uid}
                    onChange={(e) => handleInputChange(e, setUid)}
                    placeholder="Enter your UID"
                  />
                  {errors.uid && (
                    <div className="error-message">{errors.uid}</div>
                  )}
                </div>
              </div>

              <div className="input-row-joinnow">
                <div className="input-group-joinnow">
                  <label className="label-joinnow" htmlFor="email">
                    Email
                  </label>
                  <div className="email-input">
                    <input
                      type="text"
                      id="email"
                      name="email"
                      className="input-field-join"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter email"
                      disabled
                      style={{ cursor: "not-allowed" }}
                    />
                    <span className="domain">@cuchd.in</span>
                    {isVerified && <span className="verified">✓</span>}
                  </div>
                  {errors.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                </div>
                <div className="input-group-joinnow">
                  <label className="label-joinnow" htmlFor="mobileNumber">
                    Mobile Number
                  </label>
                  <div className="mobile-input">
                    <input
                      type="text"
                      id="mobileNumber"
                      name="mobileNumber"
                      className="input-field-join"
                      value={mobileNumber}
                      onChange={(e) => handleInputChange(e, setMobileNumber)}
                      placeholder="+917291XXXX88"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">ORGANIZATION INFORMATION</div>
            <div className="section-content">
              <div className="input-row-joinnow">
                <div className="input-group-joinnow">
                  <label className="label-joinnow" htmlFor="entity">
                    Entity
                  </label>
                  <select
                    id="entity"
                    name="entity"
                    className="input-field-join"
                    value={entity}
                    onChange={(e) => handleInputChange(e, setEntity)}
                  >
                    <option value="">Select Entity</option>
                    {entityData.map((entity) => (
                      <option key={entity.entity_id} value={entity.entity_id}>
                        {entity.entity_name}
                      </option>
                    ))}
                  </select>
                  {errors.entity && (
                    <div className="error-message">{errors.entity}</div>
                  )}
                </div>
                <div className="input-group-joinnow">
                  <label className="label-joinnow" htmlFor="entityType">
                    Entity Type
                  </label>
                  <select
                    id="entityType"
                    name="entityType"
                    className="input-field-join"
                    value={entityType}
                    onChange={(e) => handleInputChange(e, setEntityType)}
                  >
                    <option value="">Select Entity Type</option>
                    {entityListData.map((entityList) => (
                      <option
                        key={entityList.entity_id}
                        value={entityList.entity_id}
                      >
                        {entityList.registration_name}
                      </option>
                    ))}
                  </select>
                  {errors.entityType && (
                    <div className="error-message">{errors.entityType}</div>
                  )}
                </div>
              </div>

              <div className="input-group-joinnow">
                <label className="label-joinnow" htmlFor="department">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  className="input-field-join"
                  value={department}
                  onChange={(e) => handleInputChange(e, setDepartment)}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.dept_id} value={dept.dept_id}>
                      {dept.dept_name}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <div className="error-message">{errors.department}</div>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">VERIFICATION</div>
            <div className="section-content">
              <div className="input-row-joinnow">
                <div className="input-group-joinnow" style={{ flex: 2 }}>
                  <label className="label-joinnow" htmlFor="email">
                    Email
                  </label>
                  <div className="email-input">
                    <input
                      type="text"
                      id="email"
                      name="email"
                      className="input-field-join"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter email"
                      disabled
                      style={{ cursor: "not-allowed" }}
                    />
                    <span className="domain">@cuchd.in</span>
                    {isVerified && <span className="verified">✓</span>}
                  </div>
                  {errors.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                </div>
                <div className="input-group-joinnow" style={{ flex: 1 }}>
                  <label
                    className="label-joinnow"
                    style={{ visibility: "hidden" }}
                  >
                    Send OTP
                  </label>
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="button-joinnow"
                    disabled={otpTimer > 0 || isFormDisabled}
                    style={{ width: "100%", height: "42px" }}
                  >
                    {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : "Send OTP"}
                  </button>
                </div>
              </div>

              <div className="input-row-joinnow">
                <div className="input-group-joinnow" style={{ flex: 2 }}>
                  <label className="label-joinnow" htmlFor="otp">
                    OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    className="input-field-join"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                  />
                  {errors.otp && (
                    <div className="error-message">{errors.otp}</div>
                  )}
                </div>
                <div className="input-group-joinnow" style={{ flex: 1 }}>
                  <label
                    className="label-joinnow"
                    style={{ visibility: "hidden" }}
                  >
                    Verify OTP
                  </label>
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    className="button-joinnow"
                    style={{ width: "100%", height: "42px" }}
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextPage}
            className="button-joinnow"
            disabled={!isVerified}
            style={{ width: "100%" }}
          >
            Next Page
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinNow;
