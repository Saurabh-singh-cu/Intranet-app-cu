import React, { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import ReactQuill from 'react-quill';
import axios from 'axios';
import './RegisterNewEntity.css';
import 'react-quill/dist/quill.snow.css';
import cuimg from '../../assets/images/cuimg.png';

const RegisterNewEntity = () => {
  const [activeTab, setActiveTab] = useState("universityBody");
  const [currentSession, setCurrentSession] = useState([]);
  const [formData, setFormData] = useState({
    entity: "",
    proposed_name: "",
    proposed_date: "",
    proposed_by: "",
    proposer_name: "",
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

  const [acknowledgement, setAcknowledgement] = useState({
    agreed: false,
    captchaValue: null,
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
      alert("Please acknowledge the form submission by checking the box.");
      return;
    }
    if (!acknowledgement.captchaValue) {
      alert("Please complete the CAPTCHA verification.");
      return;
    }

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
        alert("Your form has been successfully submitted.");
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      setIsLoading(false);
      setIsModalVisible(false);
      alert("There was an error submitting your form. Please try again.");
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
      proposer_email: "",
      mobile: "",
      entity_nature: "",
      session_code: currentSession,
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
  };

  const handleNext = () => {
    if (activeTab === "universityBody") {
      setActiveTab("advisoryBoardStudent");
    } else if (activeTab === "advisoryBoardStudent") {
      setActiveTab("advisoryBoardFaculty");
    } else if (activeTab === "advisoryBoardFaculty") {
      setActiveTab("acknowledgement");
    } else {
      handleSubmit({ preventDefault: () => {} });
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
      try {
        const response = await axios.get("http://13.202.65.103/intranetapp/entity-types/");
        setEntityData(response.data);
      } catch (error) {
        console.error("Error fetching entity data:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://13.202.65.103/intranetapp/departments/");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    const getCurrentSession = async () => {
      try {
        const response = await axios.get("http://13.202.65.103/intranetapp/current_session/");
        setCurrentSession(response.data.session_code);
      } catch (error) {
        console.error("Error fetching current session:", error);
      }
    };

    fetchEntityData();
    fetchDepartments();
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
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo-container">
          <img src={cuimg} alt="University Logo" className="university-logo" />
        </div>
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'universityBody' ? 'active' : ''}`}
            onClick={() => handleTabClick('universityBody')}
          >
            University Body Details
          </button>
          <button 
            className={`nav-tab ${activeTab === 'advisoryBoardStudent' ? 'active' : ''}`}
            onClick={() => handleTabClick('advisoryBoardStudent')}
          >
            Advisory Board (Student)
          </button>
          <button 
            className={`nav-tab ${activeTab === 'advisoryBoardFaculty' ? 'active' : ''}`}
            onClick={() => handleTabClick('advisoryBoardFaculty')}
          >
            Advisory Board (Faculty)
          </button>
          <button 
            className={`nav-tab ${activeTab === 'acknowledgement' ? 'active' : ''}`}
            onClick={() => handleTabClick('acknowledgement')}
          >
            Acknowledgement
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <div className="form-container">
          <header className="form-header">
            <h1 className="form-title">Department of Academic Affairs</h1>
          </header>

          <form onSubmit={handleSubmit}>
            {activeTab === 'universityBody' && (
              <div className="form-section">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <div className="radio-group">
                    {entityData && entityData.map((entity) => (
                      <button
                        type="button"
                        key={entity.entity_id}
                        className={`radio-button ${formData.entity === entity.entity_id ? 'active' : ''}`}
                        onClick={() => handleEntityClick(entity)}
                      >
                        {entity.entity_name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="proposed_name">Proposed Name</label>
                    <input
                      className="form-input"
                      type="text"
                      id="proposed_name"
                      name="proposed_name"
                      value={formData.proposed_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="proposed_date">Proposed Date</label>
                    <input
                      className="form-input"
                      type="date"
                      id="proposed_date"
                      name="proposed_date"
                      value={formData.proposed_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Nature of Entity</label>
                  <div className="radio-group">
                    {['Domain specific (field based)', 'Hackathon & challenge', 'Social value & outreach', 'Innovation & incubation'].map((nature) => (
                      <button
                        type="button"
                        key={nature}
                        className={`radio-button ${formData.entity_nature === nature ? 'active' : ''}`}
                        onClick={() => handleInputChange({ target: { name: 'entity_nature', value: nature } })}
                      >
                        {nature}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Proposed by</label>
                  <div className="radio-group">
                    {['STUDENT', 'FACULTY'].map((proposer) => (
                      <button
                        type="button"
                        key={proposer}
                        className={`radio-button ${formData.proposed_by === proposer ? 'active' : ''}`}
                        onClick={() => handleInputChange({ target: { name: 'proposed_by', value: proposer } })}
                      >
                        {proposer}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.proposed_by && (
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="proposer_name">{formData.proposed_by === 'STUDENT' ? 'Student' : 'Faculty'} Name</label>
                      <input
                        className="form-input"
                        type="text"
                        id="proposer_name"
                        name="proposer_name"
                        value={formData.proposer_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="proposer_email">{formData.proposed_by === 'STUDENT' ? 'Student' : 'Faculty'} Email</label>
                      <input
                        className="form-input"
                        type="email"
                        id="proposer_email"
                        name="proposer_email"
                        value={formData.proposer_email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="emp_code">{formData.proposed_by === 'STUDENT' ? 'Student UID' : 'Employee Code'}</label>
                      <input
                        className="form-input"
                        type="text"
                        id="emp_code"
                        name="emp_code"
                        value={formData.emp_code}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="mobile">{formData.proposed_by === 'STUDENT' ? 'Student' : 'Faculty'} Mobile Number</label>
                      <input
                        className="form-input"
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="department">Department of proposer</label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="custom-select"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dep) => (
                      <option key={dep.dept_id} value={dep.dept_id}>
                        {dep.dept_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'advisoryBoardStudent' && (
              <div className="form-section">
                <h2 className="section-title">Student Advisory Board Details</h2>
                {['1', '2'].map((num) => (
                  <div key={`student_sec_${num}`} className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor={`student_sec_${num}_name`}>Student Secretary Name {num}</label>
                      <input
                        className="form-input"
                        type="text"
                        id={`student_sec_${num}_name`}
                        name={`student_sec_${num}_name`}
                        value={formData[`student_sec_${num}_name`]}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor={`student_sec_${num}_email`}>Student Secretary Email {num}</label>
                      <input
                        className="form-input"
                        type="email"
                        id={`student_sec_${num}_email`}
                        name={`student_sec_${num}_email`}
                        value={formData[`student_sec_${num}_email`]}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor={`student_sec_${num}_uid`}>Student Secretary UID {num}</label>
                      <input
                        className="form-input"
                        type="text"
                        id={`student_sec_${num}_uid`}
                        name={`student_sec_${num}_uid`}
                        value={formData[`student_sec_${num}_uid`]}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor={`student_sec_${num}_mobile`}>Student Secretary Mobile {num}</label>
                      <input
                        className="form-input"
                        type="tel"
                        id={`student_sec_${num}_mobile`}
                        name={`student_sec_${num}_mobile`}
                        value={formData[`student_sec_${num}_mobile`]}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                ))}
                {['1', '2'].map((num) => (
                  <div key={`student_advsec_${num}`} className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor={`student_advsec_${num}_name`}>Student Advisory Name {num}</label>
                      <input
                        className="form-input"
                        type="text"
                        id={`student_advsec_${num}_name`}
                        name={`student_advsec_${num}_name`}
                        value={formData[`student_advsec_${num}_name`]}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor={`student_advsec_${num}_email`}>Student Advisory Email {num}</label>
                      <input
                        className="form-input"
                        type="email"
                        id={`student_advsec_${num}_email`}
                        name={`student_advsec_${num}_email`}
                        value={formData[`student_advsec_${num}_email`]}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor={`student_advsec_${num}_uid`}>Student Advisory UID {num}</label>
                      <input
                        className="form-input"
                        type="text"
                        id={`student_advsec_${num}_uid`}
                        name={`student_advsec_${num}_uid`}
                        value={formData[`student_advsec_${num}_uid`]}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor={`student_advsec_${num}_mobile`}>Student Advisory Mobile {num}</label>
                      <input
                        className="form-input"
                        type="tel"
                        id={`student_advsec_${num}_mobile`}
                        name={`student_advsec_${num}_mobile`}
                        value={formData[`student_advsec_${num}_mobile`]}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'advisoryBoardFaculty' && (
              <div className="form-section">
                <h2 className="section-title">Faculty Advisory Board Details</h2>
                {['1', '2'].map((num) => (
                  <div key={`faculty_adv_${num}`} className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor={`faculty_adv_${num}_name`}>Faculty Advisor Name {num}</label>
                      <input
                        className="form-input"
                        type="text"
                        id={`faculty_adv_${num}_name`}
                        name={`faculty_adv_${num}_name`}
                        value={formData[`faculty_adv_${num}_name`]}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor={`faculty_adv_${num}_email`}>Faculty Advisor Email {num}</label>
                      <input
                        className="form-input"
                        type="email"
                        id={`faculty_adv_${num}_email`}
                        name={`faculty_adv_${num}_email`}
                        value={formData[`faculty_adv_${num}_email`]}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor={`faculty_adv_${num}_empcode`}>Faculty Advisor Employee Code {num}</label>
                      <input
                        className="form-input"
                        type="text"
                        id={`faculty_adv_${num}_empcode`}
                        name={`faculty_adv_${num}_empcode`}
                        value={formData[`faculty_adv_${num}_empcode`]}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor={`faculty_adv_${num}_mobile`}>Faculty Advisor Mobile {num}</label>
                      <input
                        className="form-input"
                        type="tel"
                        id={`faculty_adv_${num}_mobile`}
                        name={`faculty_adv_${num}_mobile`}
                        value={formData[`faculty_adv_${num}_mobile`]}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                ))}
                {['1', '2'].map((num) => (
                  <div key={`faculty_coadv_${num}`} className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor={`faculty_coadv_${num}_name`}>Faculty Co-Advisor Name {num}</label>
                      <input
                        className="form-input"
                        type="text"
                        id={`faculty_coadv_${num}_name`}
                        name={`faculty_coadv_${num}_name`}
                        value={formData[`faculty_coadv_${num}_name`]}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor={`faculty_coadv_${num}_email`}>Faculty Co-Advisor Email {num}</label>
                      <input
                        className="form-input"
                        type="email"
                        id={`faculty_coadv_${num}_email`}
                        name={`faculty_coadv_${num}_email`}
                        value={formData[`faculty_coadv_${num}_email`]}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor={`faculty_coadv_${num}_empcode`}>Faculty Co-Advisor Employee Code {num}</label>
                      <input
                        className="form-input"
                        type="text"
                        id={`faculty_coadv_${num}_empcode`}
                        name={`faculty_coadv_${num}_empcode`}
                        value={formData[`faculty_coadv_${num}_empcode`]}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor={`faculty_coadv_${num}_mobile`}>Faculty Co-Advisor Mobile {num}</label>
                      <input
                        className="form-input"
                        type="tel"
                        id={`faculty_coadv_${num}_mobile`}
                        name={`faculty_coadv_${num}_mobile`}
                        value={formData[`faculty_coadv_${num}_mobile`]}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'acknowledgement' && (
              <div className="acknowledgement-container">
                <h2 className="section-title">Acknowledgement</h2>
                <p>
                  I acknowledge that the information provided in this form is accurate and complete
                  to the best of my knowledge. I understand that submitting false or misleading
                  information may result in the rejection of this proposal or other appropriate actions.
                </p>
                
                <div className="form-group">
                  <label className="form-label">Have referral?</label>
                  <div className="quill-editor">
                    <ReactQuill
                      theme="snow"
                      value={formData.referal}
                      onChange={handleQuillChange}
                    />
                  </div>
                </div>

                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="acknowledge"
                    checked={acknowledgement.agreed}
                    onChange={handleAcknowledgementChange}
                  />
                  <label htmlFor="acknowledge">
                    I acknowledge and agree to the above statement
                  </label>
                </div>

                <div className="captcha-container">
                  <ReCAPTCHA
                    sitekey="6LeComoqAAAAAM7fMSrGeagGkmaDdtqdt12MzRjE"
                    onChange={(value) => setAcknowledgement(prev => ({
                      ...prev,
                      captchaValue: value
                    }))}
                  />
                </div>
              </div>
            )}

            <div className="form-actions">
              {activeTab !== 'universityBody' && (
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleBack}
                >
                  Back
                </button>
              )}
              <button
                type="button"
                className="button button-secondary"
                onClick={handleClear}
              >
                Clear all
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={handleNext}
              >
                {activeTab === 'acknowledgement' ? 'Submit' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterNewEntity;

