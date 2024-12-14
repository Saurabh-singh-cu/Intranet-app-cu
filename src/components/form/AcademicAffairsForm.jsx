import React, { useEffect, useState } from "react";
import { notification, Checkbox, Spin, Modal } from "antd";
import ReCAPTCHA from "react-google-recaptcha";
import cuimg from "../../assets/images/cuimg.png";
import "./AcademicAffairsForm.css";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AcademicAffairsForm = () => {
  const [activeTab, setActiveTab] = useState("universityBody");
  const [currentSession, setCurrentSession] = useState([]);
  const [formData, setFormData] = useState({
    entity: "",
    proposed_name: "",
    proposed_date: "",
    proposed_by: "",
    proposer_name: "",
    emp_code: "",
    emp_code: "",
    proposer_email: "",
    mobile: "",
    entity_nature: "",
    session_code: "",
    student_sec_1_name: "",
    student_sec_1_email: "",
    student_sec_1_uid: "",
    student_sec_1_mobile: "",
    student_sec_2_name: "",
    student_sec_2_email: "",
    student_sec_2_uid: "",
    student_sec_2_mobile: "",
    student_advsec_1_name: "",
    student_advsec_1_email: "",
    student_advsec_1_uid: "",
    student_advsec_1_mobile: "",
    student_advsec_2_name: "",
    student_advsec_2_email: "",
    student_advsec_2_uid: "",
    student_advsec_2_mobile: "",
    faculty_adv_1_name: "",
    faculty_adv_1_email: "",
    faculty_adv_1_empcode: "",
    faculty_adv_1_mobile: "",
    faculty_adv_2_name: "",
    faculty_adv_2_email: "",
    faculty_adv_2_empcode: "",
    faculty_adv_2_mobile: "",
    faculty_coadv_1_name: "",
    faculty_coadv_1_email: "",
    faculty_coadv_1_empcode: "",
    faculty_coadv_1_mobile: "",
    faculty_coadv_2_name: "",
    faculty_coadv_2_email: "",
    faculty_coadv_2_empcode: "",
    faculty_coadv_2_mobile: "",
    department: "",
    referal: "",
  });

  const [advisoryBoardData, setAdvisoryBoardData] = useState({
    student: {
      advisor1: { name: "", uid: "", phone: "" },
      advisor2: { name: "", uid: "", phone: "" },
    },
    faculty: {
      advisor1: { name: "", eid: "", phone: "" },
      advisor2: { name: "", eid: "", phone: "" },
      coAdvisor1: { name: "", eid: "", phone: "" },
      coAdvisor2: { name: "", eid: "", phone: "" },
    },
  });
  const [acknowledgement, setAcknowledgement] = useState({
    agreed: false,
    captchaValue: null,
    file: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [entityData, setEntityData] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [departments, setDepartments] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEntityClick = (entity) => {
    setSelectedEntity(entity);
    setFormData((prevState) => ({
      ...prevState,
      entity: entity.entity_id,
      type: entity.entity_name,
    }));
  };

  const handleQuillChange = (value) => {
    setFormData((prevState) => ({ ...prevState, referal: value }));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acknowledgement.agreed) {
      notification.error({
        message: "Acknowledgement Required",
        description:
          "Please acknowledge the form submission by checking the box.",
      });
      return;
    }
    // if (!acknowledgement.captchaValue) {
    //   notification.error({
    //     message: "CAPTCHA Required",
    //     description: "Please complete the CAPTCHA verification.",
    //   });
    //   return;
    // }

    setIsLoading(true);
    setIsModalVisible(true);

    try {
      const response = await axios.post(
        "http://13.202.65.103/intranetapp/entity-requests/",
        formData
      );

      setIsLoading(false);
      setIsModalVisible(false);

      if (response.status === 201 || response.status === 200) {
        notification.success({
          message: "Form Submitted",
          description: "Your form has been successfully submitted.",
        });
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      setIsLoading(false);
      setIsModalVisible(false);
      notification.error({
        message: "Submission Error",
        description:
          "There was an error submitting your form. Please try again.",
      });
      console.error("Form submission error:", error);
    }
  };

  const handleAcknowledgementChange = (e) => {
    setAcknowledgement((prev) => ({ ...prev, agreed: e.target.checked }));
  };

  const handleClear = () => {
    setFormData({
      entity: "",
      proposed_name: "",
      proposed_date: "",
      proposed_by: "",
      proposer_name: "",
      emp_code: "",
      emp_code: "",
      proposer_email: "",
      mobile: "",
      entity_nature: "",
      session_code: "042020-082021",
      student_sec_1_name: "",
      student_sec_1_email: "",
      student_sec_1_uid: "",
      student_sec_1_mobile: "",
      student_sec_2_name: "",
      student_sec_2_email: "",
      student_sec_2_uid: "",
      student_sec_2_mobile: "",
      student_advsec_1_name: "",
      student_advsec_1_email: "",
      student_advsec_1_uid: "",
      student_advsec_1_mobile: "",
      student_advsec_2_name: "",
      student_advsec_2_email: "",
      student_advsec_2_uid: "",
      student_advsec_2_mobile: "",
      faculty_adv_1_name: "",
      faculty_adv_1_email: "",
      faculty_adv_1_empcode: "",
      faculty_adv_1_mobile: "",
      faculty_adv_2_name: "",
      faculty_adv_2_email: "",
      faculty_adv_2_empcode: "",
      faculty_adv_2_mobile: "",
      faculty_coadv_1_name: "",
      faculty_coadv_1_email: "",
      faculty_coadv_1_empcode: "",
      faculty_coadv_1_mobile: "",
      faculty_coadv_2_name: "",
      faculty_coadv_2_email: "",
      faculty_coadv_2_empcode: "",
      faculty_coadv_2_mobile: "",
      department: "",
      referal: "",
    });
    setAdvisoryBoardData({
      secretary: [{ name: "", uid: "", phone: "" }],
      jointSecretary: [{ name: "", uid: "", phone: "" }],
      facultyAdvisor: [{ name: "", uid: "", phone: "" }],
      facultyCoAdvisor: [{ name: "", uid: "", phone: "" }],
    });
  };

  const validateUniversityBodyForm = () => {
    const errors = [];
    if (!formData.type) errors.push("Please select a Type");
    if (!formData.entity_nature)
      errors.push("Please select a Nature of Entity");
    if (!formData.proposed_by) errors.push("Please select who proposed");
    if (!formData.proposed_name)
      errors.push("Please enter the Name of university body");
    if (!formData.proposed_date)
      errors.push("Please enter the Date of proposal");
    if (!formData.proposer_name)
      errors.push("Please enter the Name of proposer");
    if (!formData.department)
      errors.push("Please enter the Department of proposer");
    if (formData.proposed_by === "STUDENT") {
      if (!formData.proposer_name) errors.push("Please enter the Student Name");
      if (!formData.emp_code) errors.push("Please enter the Student ID");
      if (!formData.mobile)
        errors.push("Please enter the Student Mobile Number");
    } else if (formData.proposed_by === "FACULTY") {
      if (!formData.proposer_email)
        errors.push("Please enter the Faculty Email");
      if (!formData.mobile)
        errors.push("Please enter the Faculty Mobile Number");
      if (!formData.emp_code) errors.push("Please enter the Employee Code");
    }
    return errors;
  };

  const validateAdvisoryBoardForm = () => {
    const errors = [];
    const roles = [
      "secretary",
      "jointSecretary",
      "facultyAdvisor",
      "facultyCoAdvisor",
    ];
    roles.forEach((role) => {
      advisoryBoardData[role].forEach((member, index) => {
        if (!member.name)
          errors.push(`Please enter the name for ${role} ${index + 1}`);
        if (!member.uid)
          errors.push(`Please enter the UID for ${role} ${index + 1}`);
        if (!member.phone)
          errors.push(`Please enter the phone number for ${role} ${index + 1}`);
      });
    });
    return errors;
  };

  const handleNext = () => {
    let errors = [];
    if (activeTab === "universityBody") {
      errors = validateUniversityBodyForm();
    } else if (activeTab === "advisoryBoard") {
      errors = validateAdvisoryBoardForm();
    }

    if (errors.length > 0) {
      notification.error({
        message: "Validation Error",
        description: (
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        ),
        duration: 0,
      });
    } else {
      if (activeTab === "universityBody") {
        setActiveTab("advisoryBoardStudent");
      } else if (activeTab === "advisoryBoardStudent") {
        setActiveTab("advisoryBoardFaculty");
      } else if (activeTab === "advisoryBoardFaculty") {
        setActiveTab("acknowledgement");
      } else {
        handleSubmit({ preventDefault: () => {} });
      }
    }
  };

  const handleBack = () => {
    if (activeTab === "advisoryBoardStudent") {
      setActiveTab("universityBody");
    } else if (activeTab === "advisoryBoardFaculty") {
      setActiveTab("advisoryBoardStudent");
    } else if (activeTab === "acknowledgement") {
      setActiveTab("advisoryBoardFaculty");
    }
  };

  useEffect(() => {
    const fetchEntityData = async () => {
      const response = await fetch(
        "http://13.202.65.103/intranetapp/entity-types/"
      );
      const data = await response.json();
      setEntityData(data);
    };
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://13.202.65.103/intranetapp/departments/"
        );
        setDepartments(response.data);
        console.log(response.data, "depart");
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchEntityData();
    fetchDepartments();
  
  }, []);

  const getCurrentSession = async () => {
    try{
      const response = await axios.get(
        "http://13.202.65.103/intranetapp/current_session/"
      );
      setCurrentSession(response?.data?.session_code);
    }catch(error) {
      console.log(error)
    }
   
  };

  useEffect(() => {
    getCurrentSession();
  }, []);

  useEffect(() => {
    if (currentSession) {
      setFormData((prevState) => ({
        ...prevState,
        session_code: currentSession,
      }));
    }
  }, [currentSession]);



  return (
    <div style={{ display: "flex", marginTop: "57px" }}>
      <div className="form-container-form">
        <div className="form-header">
          <img src={cuimg} alt="University Logo" className="university-logo" />
          <h3>DEPARTMENT OF ACADEMIC AFFAIRS</h3>
        </div>
        <div className="tab-container">
          <button
            className={`tab ${activeTab === "universityBody" ? "active" : ""}`}
            onClick={() => handleTabClick("universityBody")}
          >
            University Body Details
          </button>
          <button
            className={`tab ${
              activeTab === "advisoryBoardStudent" ? "active" : ""
            }`}
            onClick={() => handleTabClick("advisoryBoardStudent")}
          >
            Advisory Board (Student)
          </button>
          <button
            className={`tab ${
              activeTab === "advisoryBoardFaculty" ? "active" : ""
            }`}
            onClick={() => handleTabClick("advisoryBoardFaculty")}
          >
            Advisory Board (Faculty)
          </button>
          <button
            className={`tab ${activeTab === "acknowledgement" ? "active" : ""}`}
            onClick={() => handleTabClick("acknowledgement")}
          >
            Acknowledgement
          </button>
        </div>


      
        <form className="form-scroller" onSubmit={handleSubmit}>
          {activeTab === "universityBody" && (
            <div className="form-content">
              <div className="form-group">
                <label className="labelName">Type</label>
                <div className="radio-group">
                  {entityData &&
                    entityData?.map((entity) => (
                      <button
                        type="button"
                        onClick={() => handleEntityClick(entity)}
                        className={`btn_choose_sent bg_btn_chose_3 ${
                          formData.entity === entity.entity_id ? "active" : ""
                        }`}
                        key={entity.entity_id}
                      >
                        <input
                          className="inputForm"
                          type="radio"
                          name="entity"
                          value={entity.entity_id}
                          checked={formData.entity === entity.entity_id}
                          onChange={() => handleEntityClick(entity)}
                        />
                        {entity.entity_name}
                      </button>
                    ))}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="labelName" htmlFor="proposed_name">
                    Proposed Name
                  </label>
                  <input
                    className="inputForm"
                    type="text"
                    id="proposed_name"
                    name="proposed_name"
                    value={formData.proposed_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label className="labelName" htmlFor="proposed_date">
                    Proposed Date
                  </label>
                  <input
                    className="inputForm"
                    type="date"
                    id="proposed_date"
                    name="proposed_date"
                    value={formData.proposed_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="labelName">Nature of Entity</label>
                <div className="radio-group">
                  <button
                    type="button"
                    className={`btn_choose_sent bg_btn_chose_3 ${
                      formData.entity_nature === "Domain specific (field based)"
                        ? "active"
                        : ""
                    }`}
                  >
                    <input
                      className="inputForm"
                      type="radio"
                      name="entity_nature"
                      value="Domain specific (field based)"
                      checked={
                        formData.entity_nature ===
                        "Domain specific (field based)"
                      }
                      onChange={handleInputChange}
                    />
                    Domain specific (field based)
                  </button>
                  <button
                    type="button"
                    className={`btn_choose_sent bg_btn_chose_3 ${
                      formData.entity_nature === "Hackathon & challenge"
                        ? "active"
                        : ""
                    }`}
                  >
                    <input
                      className="inputForm"
                      type="radio"
                      name="entity_nature"
                      value="Hackathon & challenge"
                      checked={
                        formData.entity_nature === "Hackathon & challenge"
                      }
                      onChange={handleInputChange}
                    />
                    Hackathon & challenge
                  </button>
                  <button
                    type="button"
                    className={`btn_choose_sent bg_btn_chose_3 ${
                      formData.entity_nature === "Social value & outreach"
                        ? "active"
                        : ""
                    }`}
                  >
                    <input
                      className="inputForm"
                      type="radio"
                      name="entity_nature"
                      value="Social value & outreach"
                      checked={
                        formData.entity_nature === "Social value & outreach"
                      }
                      onChange={handleInputChange}
                    />
                    Social value & outreach
                  </button>
                  <button
                    type="button"
                    className={`btn_choose_sent bg_btn_chose_3 ${
                      formData.entity_nature === "Innovation & incubation"
                        ? "active"
                        : ""
                    }`}
                  >
                    <input
                      className="inputForm"
                      type="radio"
                      name="entity_nature"
                      value="Innovation & incubation"
                      checked={
                        formData.entity_nature === "Innovation & incubation"
                      }
                      onChange={handleInputChange}
                    />
                    Innovation & incubation
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="labelName">Proposed by</label>
                <div className="radio-group">
                  <button
                    type="button"
                    className={`btn_choose_sent bg_btn_chose_3 ${
                      formData.proposed_by === "STUDENT" ? "active" : ""
                    }`}
                  >
                    <input
                      className="inputForm"
                      type="radio"
                      name="proposed_by"
                      value="STUDENT"
                      checked={formData.proposed_by === "STUDENT"}
                      onChange={handleInputChange}
                    />
                    STUDENT
                  </button>
                  <button
                    type="button"
                    className={`btn_choose_sent bg_btn_chose_3  ${
                      formData.proposed_by === "FACULTY" ? "active" : ""
                    }`}
                  >
                    <input
                      className="inputForm"
                      type="radio"
                      name="proposed_by"
                      value="FACULTY"
                      checked={formData.proposed_by === "FACULTY"}
                      onChange={handleInputChange}
                    />
                    FACULTY
                  </button>
                </div>

                {formData.proposed_by === "STUDENT" && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "20px",
                      }}
                    >
                      <div className="form-group">
                        <label className="labelName" htmlFor="proposer_name">
                          Student Name
                        </label>
                        <input
                          className="inputForm"
                          type="text"
                          id="proposer_name"
                          name="proposer_name"
                          value={formData.proposer_name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label className="labelName" htmlFor="proposer_email">
                          Student Email
                        </label>
                        <input
                          className="inputForm"
                          type="email"
                          id="proposer_email"
                          name="proposer_email"
                          value={formData.proposer_email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label className="labelName" htmlFor="emp_code">
                          Student UID
                        </label>
                        <input
                          className="inputForm"
                          type="text"
                          id="emp_code"
                          name="emp_code"
                          value={formData.emp_code}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label className="labelName" htmlFor="mobile">
                          Student Mobile Number
                        </label>
                        <input
                          className="inputForm"
                          type="tel"
                          id="mobile"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </>
                )}
                {formData.proposed_by === "FACULTY" && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "20px",
                      }}
                    >
                      <div className="form-group">
                        <label className="labelName" htmlFor="proposer_name">
                          Faculty Name
                        </label>
                        <input
                          className="inputForm"
                          type="text"
                          id="proposer_name"
                          name="proposer_name"
                          value={formData.proposer_name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label className="labelName" htmlFor="proposer_email">
                          Faculty Email
                        </label>
                        <input
                          className="inputForm"
                          type="email"
                          id="proposer_email"
                          name="proposer_email"
                          value={formData.proposer_email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label className="labelName" htmlFor="emp_code">
                          Employee Code
                        </label>
                        <input
                          className="inputForm"
                          type="text"
                          id="emp_code"
                          name="emp_code"
                          value={formData.emp_code}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label className="labelName" htmlFor="mobile">
                          Faculty Mobile Number
                        </label>
                        <input
                          className="inputForm"
                          type="tel"
                          id="mobile"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="labelName" htmlFor="department">
                    Department of proposer
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="custom-select"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dep) => (
                      <option key={dep.dept} value={dep.dept_id}>
                        {dep.dept_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "advisoryBoardStudent" && (
            <div className="form-content">
              <h3>Student Advisory Board Details</h3>
              <div className="form-row">
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Student secretary name...1"
                  name="student_sec_1_name"
                  value={formData.student_sec_1_name}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Student secretary email...1"
                  name="student_sec_1_email"
                  value={formData.student_sec_1_email}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Student secretary UID...1"
                  name="student_sec_1_uid"
                  value={formData.student_sec_1_uid}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Student secretary Phone No...1"
                  name="student_sec_1_mobile"
                  value={formData.student_sec_1_mobile}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Student secretary name...2"
                  name="student_sec_2_name"
                  value={formData.student_sec_2_name}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Student secretary email...2"
                  name="student_sec_2_email"
                  value={formData.student_sec_2_email}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Student secretary UID...2"
                  name="student_sec_2_uid"
                  value={formData.student_sec_2_uid}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Student secretary Phone No...2"
                  name="student_sec_2_mobile"
                  value={formData.student_sec_2_mobile}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Student advisory name...1"
                  name="student_advsec_1_name"
                  value={formData.student_advsec_1_name}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Student advisory email...1"
                  name="student_advsec_1_email"
                  value={formData.student_advsec_1_email}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Student advisory UID...1"
                  name="student_advsec_1_uid"
                  value={formData.student_advsec_1_uid}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Student advisory Phone No...1"
                  name="student_advsec_1_mobile"
                  value={formData.student_advsec_1_mobile}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Student advisory name...2"
                  name="student_advsec_2_name"
                  value={formData.student_advsec_2_name}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Student advisory email...2"
                  name="student_advsec_2_email"
                  value={formData.student_advsec_2_email}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Student advisory UID...2"
                  name="student_advsec_2_uid"
                  value={formData.student_advsec_2_uid}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Student advisory Phone No...2"
                  name="student_advsec_2_mobile"
                  value={formData.student_advsec_2_mobile}
                  onChange={handleInputChange}
                />
              </div>
              {/* Repeat this pattern for other student advisory board inputs */}
            </div>
          )}

          {activeTab === "advisoryBoardFaculty" && (
            <div className="form-content">
              <h3>Faculty Advisory Board Details</h3>
              <div className="form-row">
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Faculty advisory name...1"
                  name="faculty_adv_1_name"
                  value={formData.faculty_adv_1_name}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Faculty advisory email...1"
                  name="faculty_adv_1_email"
                  value={formData.faculty_adv_1_email}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Faculty advisory ECODE...1"
                  name="faculty_adv_1_empcode"
                  value={formData.faculty_adv_1_empcode}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Faculty advisory Phone No...1"
                  name="faculty_adv_1_mobile"
                  value={formData.faculty_adv_1_mobile}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <input
                  className="inputForm"
                  type="text"
                  placeholder="SFaculty advisory name...2"
                  name="faculty_adv_2_name"
                  value={formData.faculty_adv_2_name}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Faculty advisory email...2"
                  name="faculty_adv_2_email"
                  value={formData.faculty_adv_2_email}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Faculty advisory UID...2"
                  name="faculty_adv_2_empcode"
                  value={formData.faculty_adv_2_empcode}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Faculty advisory Phone No...2"
                  name="faculty_adv_2_mobile"
                  value={formData.faculty_adv_2_mobile}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Faculty co-advisory name...1"
                  name="faculty_coadv_1_name"
                  value={formData.faculty_coadv_1_name}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Faculty co-advisory email...1"
                  name="faculty_coadv_1_email"
                  value={formData.faculty_coadv_1_email}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Faculty co-advisory UID...1"
                  name="faculty_coadv_1_empcode"
                  value={formData.faculty_coadv_1_empcode}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Faculty co-advisory Phone No...1"
                  name="faculty_coadv_1_mobile"
                  value={formData.faculty_coadv_1_mobile}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Faculty co-advisory name...2"
                  name="faculty_coadv_2_name"
                  value={formData.faculty_coadv_2_name}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Faculty co-advisory email...2"
                  name="faculty_coadv_2_email"
                  value={formData.faculty_coadv_2_email}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Faculty co-advisory UID...2"
                  name="faculty_coadv_2_empcode"
                  value={formData.faculty_coadv_2_empcode}
                  onChange={handleInputChange}
                />
                <input
                  className="inputForm"
                  type="text"
                  placeholder="Faculty co-advisory Phone No...2"
                  name="faculty_coadv_2_mobile"
                  value={formData.faculty_coadv_2_mobile}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {activeTab === "acknowledgement" && (
            <div className="form-content-form">
              <h4>Acknowledgement</h4>
              <p>
                I acknowledge that the information provided in this form is
                accurate and complete to the best of my knowledge. I understand
                that submitting false or misleading information may result in
                the rejection of this proposal or other appropriate actions.
              </p>
              <p>Have referral?</p>
              <div style={{ marginBottom: "20px" }}>
                <ReactQuill
                  theme="snow"
                  value={formData.referal}
                  onChange={handleQuillChange}
                  style={{
                    height: "200px",
                    marginBottom: "50px",
                  }}
                />
              </div>
              <Checkbox
                checked={acknowledgement.agreed}
                onChange={(e) =>
                  setAcknowledgement((prev) => ({
                    ...prev,
                    agreed: e.target.checked,
                  }))
                }
              >
                I acknowledge and agree to the above statement
              </Checkbox>
              <div className="captcha-container">
                <ReCAPTCHA
                  sitekey="6LeComoqAAAAAM7fMSrGeagGkmaDdtqdt12MzRjE"
                  onChange={(value) =>
                    setAcknowledgement((prev) => ({
                      ...prev,
                      agreed: value,
                    }))
                  }
                />
              </div>
            </div>
          )}

          <div className="form-actions">
            {activeTab !== "universityBody" && (
              <button
                type="button"
                className="clear-button"
                onClick={handleBack}
              >
                Back
              </button>
            )}
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
            >
              Clear all
            </button>
            <button type="button" className="next-button" onClick={handleNext}>
              {activeTab === "acknowledgement" ? "Submit" : "Next"}
            </button>
          </div>
        </form>
        <Modal
          title="Verifying Form Submission"
          visible={isModalVisible}
          footer={null}
          closable={false}
        >
          <div className="modal-content">
            <Spin spinning={isLoading} />
            <p>Please wait while we verify your form submission...</p>
          </div>
        </Modal>
      </div>
      <div className="entity-card">
        <div className="card-header">
          <h4>Entity Information</h4>
        </div>

        <div className="sider-card">
          <div className="card-header">
            <div className="llogo">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="brain-icon"
              >
                <path
                  d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <span>Guide</span>
            </div>
            <button className="options-button">⋮</button>
          </div>

          {selectedEntity ? (
            <div>
              <h2 className="h2tag">{selectedEntity.entity_name}</h2>
              <p className="ptag">{selectedEntity.entity_guide}</p>
            </div>
          ) : (
            <p>Select an entity to view details</p>
          )}
          <div className="related-questions">
            <h3>Feeling Lost ?</h3>
            <ul>
              <li>Please connect with your coordinator advisory</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicAffairsForm;
