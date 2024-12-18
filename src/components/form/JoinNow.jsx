import React, { useEffect, useState } from "react";
import { message } from "antd";
import barcoder from "../../assets/images/barcode.jpeg";
import "./JoinNow.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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
  const [mobileNumber, setMobileNumber] = useState("");
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  const [timeLeft, setTimeLeft] = useState(300);

  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

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
    handleFinalSubmit();
  };

  useEffect(() => {
    if (uid) {
      setEmail(`${uid}`);
    }
  }, [uid]);

  const handleFinalSubmit = async () => {
    try {
      const response = await axios.post(
        "http://172.17.2.247:8080/intranetapp/final_submit/",
        {
          membership_id: membershipId,
          transaction_id:
            entity === "1" ? transactionId : "No Payment Required",
        }
      );
      Swal.fire({
        title: entity === "1" ? "Payment Success" : "Registration Success",
        text: "We will be in touch ",
        icon: "success",
      });
      setShowSuccessMessage(true);
      navigate("/");
    } catch (error) {
      console.error("Final submission failed:", error);
      Swal.fire({
        title: "Failed",
        text: `Final submission failed: ${error}`,
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
        "http://172.17.2.247:8080/intranetapp/send_otp_email/",
        {
          member_name: name,
          member_email: `${email}@cumail.in`,
          dept_id: department,
          entity_id: entity,
          reg_id: entityType,
          member_mobile: mobileNumber,
          member_uid: uid,
        }
      );
      setIsOtpSent(true);
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
        text: `Please try again! ${error?.response?.data?.error}`,
        icon: "warning",
      });
      setIsFormDisabled(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post(
        "http://172.17.2.247:8080/intranetapp/verify_otp/",
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
      setShowPayment(true);
    } catch (error) {
      console.error("OTP verification failed:", error);
      Swal.fire({
        title: "Went Wrong",
        text: `${error?.response?.data?.error}`,
        icon: "error",
      });
    }
  };

  const handleBeforeUnload = (e) => {
    if (isOtpSent) {
      e.preventDefault();
      e.returnValue = "";
    }
  };

  useEffect(() => {
    if (isOtpSent) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isOtpSent]);

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
      if (entity === "1") {
        setShowPayment(true);
      } else {
        setShowPayment(false);
        handleFinalSubmit();
      }
    } else {
      message.error(
        "Please fill all fields and verify your email before proceeding."
      );
    }
  };

  const apiUrls = {
    "entity-types": "http://172.17.2.247:8080/intranetapp/entity-types/",
    departments: "http://172.17.2.247:8080/intranetapp/departments/",
    currentSession: "http://172.17.2.247:8080/intranetapp/current_session/",
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

  const fetchEntityList = async (entity) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://172.17.2.247:8080/intranetapp/entity-registration-name/?entity_id=${entity}`
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
      <>
        {entity === "1" ? (
          <div className="payment-container">
            <div className="payment-form-wrapper">
              <h2>Complete Your Payment</h2>
              <p>Secure and easy payment process</p>
              <p>
                {" "}
                Time Left to complete this payment {formateTimer(timeLeft)}
              </p>
              <p>
                {" "}
                Time has expired please go back and fill the form and come here
                again.
              </p>

              <form className="payment-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    id="card-number"
                    name="card-number"
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter Transaction ID"
                  />
                </div>
                {/* <div className="form-group-row">
            <input
              id="expiry-date"
              name="expiry-date"
              type="text"
              required
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
            <input
              id="cvv"
              name="cvv"
              type="text"
              required
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </div> */}
                <button type="submit" className="pay-button">
                  <span className="lock-icon">🔒</span>
                  Pay Now
                </button>
              </form>
              <div className="secure-payment-info">
                <span className="credit-card-icon">💳</span>
                <p>Secure payment processed by Stripe</p>
              </div>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit}>
            <div className="no-payment-container">
            <div className="no-payment-content">
              <h2>Checkout Page</h2>
              <p>Make sure to submit this form and wait!</p>
              <div className="free-features">
               
              </div>
           
              <button type="submit" className="pay-button">
                  <span className="lock-icon">🎁</span>
                  Submit Form
                </button>
              <div className="learn-more">
                <a href="#">
                 Welcome Onboard
                  <span className="arrow-icon">→</span>
                </a>
              </div>
            </div>
          </div>
        </form>
        )}
      </>
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
    <div className="registration-container">
      <div className="border-line">
        <div className="sidebar-joinnow">
          <h2>Join As a New Member</h2>
          <p className="subtitle">
            Fill out the form below to create your profile and become a part of
            our amazing community.
          </p>
          <ul className="requirements-list">
            <li>
              Membership: 1 Club and 1 Prof. Soc./Dept. Soc./ Comm./Ind.Tech
              Comm.
            </li>
            <li>
              Participation: 2 Activities/Events per year (minimum 25 hours in a
              year)
            </li>
            <li>Academic Credits: Minimum Earn at least 1 GP Credit in AY.</li>
            <li>Mandatory All Fields to become member of any entity.</li>
            <li>A student can be member of multiple entity</li>
            <li>There is a membership fee for Club as per university norms</li>
            <li>
              The membership fee for professional society / Student chapter is
              as per governed outside bodies.
            </li>
            <li>
              After successfully Registration a E-Membership card is generated
              on official mail id.
            </li>
          </ul>
        </div>

        <div className="main-content">
          <form>
            <section className="form-section">
              <h3>Personal Information</h3>
              <div className="input-grid">
                <div className="input-group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => handleInputChange(e, setName)}
                    placeholder="Name"
                    className="form-input"
                    disabled={isOtpSent}
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div className="input-group">
                  <input
                    type="text"
                    id="uid"
                    name="uid"
                    value={uid}
                    onChange={(e) => handleInputChange(e, setUid)}
                    placeholder="UID"
                    className="form-input"
                    disabled={isOtpSent}
                  />
                  {errors.uid && <span className="error">{errors.uid}</span>}
                </div>

                <div className="input-group">
                  <select
                    id="department"
                    name="department"
                    value={department}
                    onChange={(e) => handleInputChange(e, setDepartment)}
                    className="form-select"
                    disabled={isOtpSent}
                  >
                    <option value="">Department</option>
                    {departments.map((dept) => (
                      <option key={dept.dept_id} value={dept.dept_id}>
                        {dept.dept_name}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <span className="error">{errors.department}</span>
                  )}
                </div>

                <div className="input-group">
                  <input
                    type="text"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={mobileNumber}
                    onChange={(e) => handleInputChange(e, setMobileNumber)}
                    placeholder="Phone Number"
                    className="form-input"
                    disabled={isOtpSent}
                  />
                </div>
              </div>
            </section>

            <section className="form-section">
              <h3>Select Entity & Department</h3>
              <div className="input-grid">
                <div className="input-group">
                  <select
                    id="entity"
                    name="entity"
                    value={entity}
                    onChange={(e) => handleInputChange(e, setEntity)}
                    className="form-select"
                    disabled={isOtpSent}
                  >
                    <option value="">Entity Type</option>
                    {entityData.map((entity) => (
                      <option key={entity.entity_id} value={entity.entity_id}>
                        {entity.entity_name}
                      </option>
                    ))}
                  </select>
                  {errors.entity && (
                    <span className="error">{errors.entity}</span>
                  )}
                </div>

                <div className="input-group">
                  <select
                    id="entityType"
                    name="entityType"
                    value={entityType}
                    onChange={(e) => handleInputChange(e, setEntityType)}
                    className="form-select"
                    disabled={isOtpSent}
                  >
                    <option value="">Select Entity Category</option>
                    {entityListData.map((entity, index) => (
                      <option
                        key={`${entity.reg_id}-${index}`}
                        value={entity.reg_id}
                      >
                        {entity.registration_name}
                      </option>
                    ))}
                  </select>
                  {errors.entityType && (
                    <span className="error">{errors.entityType}</span>
                  )}
                </div>
              </div>
            </section>

            <section className="form-section">
              <h3>Verification</h3>
              <div className="verification-grid">
                <div className="email-group">
                  <div className="email-input-container">
                    <input
                      type="text"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Email ID"
                      disabled
                      className="form-input"
                    />
                    <span className="domain">@cumail.in</span>
                    {isVerified && <span className="verified-badge">✓</span>}
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="otp-button"
                    disabled={otpTimer > 0 || isFormDisabled}
                  >
                    {otpTimer > 0 ? `Resend OTP (${otpTimer}s)` : "Send OTP"}
                  </button>
                </div>

                <div className="otp-group">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="OTP"
                    className="form-input"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    className="verify-button"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </section>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                type="button"
                onClick={handleNextPage}
                className="register-button-joinnow"
                disabled={!isVerified}
              >
                {entity === "1" ? "Make Payment" : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinNow;
