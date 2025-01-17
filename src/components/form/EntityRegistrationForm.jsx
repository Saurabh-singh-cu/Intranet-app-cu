import React, { useEffect, useState } from "react";
import "./EntityRegistrationForm.css";
import axios from "axios";
import { Modal, notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const EntityRegistrationForm = () => {
  const [entityData, setEntityData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [currentSession, setCurrentSession] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    entity: "",
    registeration_code: "",
    department: "",
    registeration_name: "",
    faculty_advisory_name: "",
    faculty_advisory_empcode: "",
    faculty_advisory_email: "",
    faculty_advisory_mobile: "",
    faculty_co_advisory_name: "",
    faculty_co_advisory_empcode: "",
    faculty_co_advisory_email: "",
    faculty_co_advisory_mobile: "",
    Secretary_name: "",
    Secretary_uid: "",
    Secretary_email: "",
    Secretary_mobile: "",
    Joint_Secretary_name: "",
    Joint_Secretary_uid: "",
    Joint_Secretary_email: "",
    Joint_Secretary_mobile: "",
    remarks: "",
  });

  const apiUrls = {
    "entity-types": "http://172.17.2.176:8080/intranetapp/entity-types/",
    departments: "http://172.17.2.176:8080/intranetapp/departments/",
    currentSession: "http://172.17.2.176:8080/intranetapp/current_session/",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const showConfirm = () => {
    confirm({
      title: 'Do you want to submit this registration?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      onOk() {
        handleSubmit();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://172.17.2.176:8080/intranetapp/entity-registration/", {
        ...formData,
        session_code: currentSession,
      });
      if (response.status === 201) {
        notification.success({
          message: 'Success',
          description: 'Form submitted successfully!',
        });
      } else {
        notification.error({
          message: 'Error',
          description: 'Failed to submit form. Please try again.',
        });
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: 'Error',
        description: 'An error occurred. Please try again later.',
      });
    }
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

  const getCurrentSession = async () => {
    try {
      const response = await axios.get(apiUrls.currentSession);
      setCurrentSession(response.data.session_code);
    } catch (error) {
      console.error("Error fetching current session:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchEntityData();
    getCurrentSession();
  }, []);

  return (
    <div className="form-wrapper-reg">
      <div className="required-legend">* Required Fields</div>

      <form onSubmit={(e) => { e.preventDefault(); showConfirm(); }}>
        <h1 className="reg-h1">Entity Registration Form</h1>

        <div className="form-row">
          <div className="form-group">
            <label className="level-reg" htmlFor="entity">
              Entity <span className="required">*</span>
            </label>
            <select
              className="input-reg"
              id="entity"
              name="entity"
              value={formData.entity}
              onChange={handleChange}
              required
            >
              <option value="">Select Entity</option>
              {entityData.map((entity) => (
                <option key={entity.entity_id} value={entity.entity_id}>
                  {entity.entity_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="level-reg" htmlFor="registeration_code">
              Registration Code <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="text"
              id="registeration_code"
              name="registeration_code"
              value={formData.registeration_code}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="level-reg" htmlFor="department">
              Department <span className="required">*</span>
            </label>
            <select
              className="input-reg"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.dept_id} value={dept.dept_id}>
                  {dept.dept_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="level-reg" htmlFor="registeration_name">
              Registration Name <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="text"
              id="registeration_name"
              name="registeration_name"
              value={formData.registeration_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <h2 className="reg-h2">Faculty Advisory Details</h2>

        <div className="form-row">
          <div className="form-group">
            <label className="level-reg" htmlFor="faculty_advisory_name">
              Name <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="text"
              id="faculty_advisory_name"
              name="faculty_advisory_name"
              value={formData.faculty_advisory_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="level-reg" htmlFor="faculty_advisory_empcode">
              Employee Code <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="text"
              id="faculty_advisory_empcode"
              name="faculty_advisory_empcode"
              value={formData.faculty_advisory_empcode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="level-reg" htmlFor="faculty_advisory_email">
              Email <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="email"
              id="faculty_advisory_email"
              name="faculty_advisory_email"
              value={formData.faculty_advisory_email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="level-reg" htmlFor="faculty_advisory_mobile">
              Mobile <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="tel"
              id="faculty_advisory_mobile"
              name="faculty_advisory_mobile"
              value={formData.faculty_advisory_mobile}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <h2 className="reg-h2">Faculty Co-Advisory Details</h2>

        <div className="form-row">
          <div className="form-group">
            <label className="level-reg" htmlFor="faculty_co_advisory_name">
              Name <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="text"
              id="faculty_co_advisory_name"
              name="faculty_co_advisory_name"
              value={formData.faculty_co_advisory_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="level-reg" htmlFor="faculty_co_advisory_empcode">
              Employee Code <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="text"
              id="faculty_co_advisory_empcode"
              name="faculty_co_advisory_empcode"
              value={formData.faculty_co_advisory_empcode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="level-reg" htmlFor="faculty_co_advisory_email">
              Email <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="email"
              id="faculty_co_advisory_email"
              name="faculty_co_advisory_email"
              value={formData.faculty_co_advisory_email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="level-reg" htmlFor="faculty_co_advisory_mobile">
              Mobile <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="tel"
              id="faculty_co_advisory_mobile"
              name="faculty_co_advisory_mobile"
              value={formData.faculty_co_advisory_mobile}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <h2 className="reg-h2">Secretary Details</h2>

        <div className="form-row">
          <div className="form-group">
            <label className="level-reg" htmlFor="Secretary_name">
              Name <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="text"
              id="Secretary_name"
              name="Secretary_name"
              value={formData.Secretary_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="level-reg" htmlFor="Secretary_uid">
              UID <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="text"
              id="Secretary_uid"
              name="Secretary_uid"
              value={formData.Secretary_uid}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="level-reg" htmlFor="Secretary_email">
              Email <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="email"
              id="Secretary_email"
              name="Secretary_email"
              value={formData.Secretary_email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="level-reg" htmlFor="Secretary_mobile">
              Mobile <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="tel"
              id="Secretary_mobile"
              name="Secretary_mobile"
              value={formData.Secretary_mobile}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <h2 className="reg-h2">Joint Secretary Details</h2>

        <div className="form-row">
          <div className="form-group">
            <label className="level-reg" htmlFor="Joint_Secretary_name">
              Name <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="text"
              id="Joint_Secretary_name"
              name="Joint_Secretary_name"
              value={formData.Joint_Secretary_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="level-reg" htmlFor="Joint_Secretary_uid">
              UID <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="text"
              id="Joint_Secretary_uid"
              name="Joint_Secretary_uid"
              value={formData.Joint_Secretary_uid}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="level-reg" htmlFor="Joint_Secretary_email">
              Email <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="email"
              id="Joint_Secretary_email"
              name="Joint_Secretary_email"
              value={formData.Joint_Secretary_email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="level-reg" htmlFor="Joint_Secretary_mobile">
              Mobile <span className="required">*</span>
            </label>
            <input
              className="input-reg"
              type="tel"
              id="Joint_Secretary_mobile"
              name="Joint_Secretary_mobile"
              value={formData.Joint_Secretary_mobile}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label className="level-reg" htmlFor="remarks">
              Remarks
            </label>
            <textarea
              className="input-reg"
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div className="form-row">
          <button className="reg-button" type="submit">
            Submit Registration
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntityRegistrationForm;