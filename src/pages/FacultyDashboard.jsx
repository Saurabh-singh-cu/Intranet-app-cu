import React, { useEffect, useState } from "react";

import "./FacultyDashboard.css";
import axios from "axios";
import { Tag } from "antd";
import { Heart, Share2, Users } from "lucide-react";
import EventCardsDash from "./EventCardsDash";
import cc1 from "../assets/images/c3.png";
import bannerclub from "../assets/images/bannerclub.jpg";

const FacultyDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
    const [regId, setRegId] = useState(null);
    const [mediaData, setMediaData] = useState(null);

  axios.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    const getuser = JSON.parse(localStorage.getItem("user"));

    console.log(getuser, "USER NAME");
    if (getuser && getuser.role_name === "Faculty Advisory") {
      setUserDetails(getuser);
    }
  }, []);

  const categories = [
    { name: "Debate ", color: "#3498db" },
    { name: "Public Speaking", color: "#e74c3c" },
    { name: "Writing and Editing", color: "#2ecc71" },
    { name: "Leadership", color: "#f39c12" },
    { name: "Creative Expression", color: "#9b59b6" },
  ];


  useEffect(() => {
    const getUserData = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          if (
            parsedUserData &&
            parsedUserData.faculty_advisory_details &&
            parsedUserData.faculty_advisory_details.reg_id
          ) {
            setRegId(parsedUserData.faculty_advisory_details.reg_id);
          } else {
            throw new Error("reg_id not found in user data");
          }
        } else {
          throw new Error("User data not found in localStorage");
        }
      } catch (err) {
        console.log(`Failed to get user data: ${err.message}`);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    if (regId) {
      approvedMedia(regId);
      console.log(regId, "RRRRRRRRRRRRRRRRRRRRRRRRR");
    }
  }, [regId]);

  const approvedMedia = async (regId) => {
    try {
      const fetch = await axios.get(
        `http://172.17.2.247:8080/intranetapp/entity_media_approved/${regId}/`
      );
      setMediaData(fetch?.data[0]);
      console.log(fetch?.data[0], "FETCH MEDIA");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
     <div style={{height:"100vh", overflow:"scroll"}}>
     <div style={{ padding: "5rem" }} className="secretary-info-container">
        <div className="secretary-info">
          <div className="secretary-header">
            <h2>Welcome, {userDetails?.user_name}!</h2>

            <span className="role-badge">{userDetails?.role_name}</span>
          </div>
          <div className="secretary-details">
            <div className="detail-item">
              <span className="detail-label">Entity:</span>
              <span className="detail-value">
                {userDetails?.faculty_advisory_details?.entity_name}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Registration Name:</span>
              <span className="detail-value">
                {userDetails?.faculty_advisory_details?.registration_name}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Department:</span>
              <span className="detail-value">
                {userDetails?.faculty_advisory_details?.department}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "-27px" }} className="club-details-page">
        <div
          className="hero-section"
          style={{
            backgroundImage: `url(${mediaData?.banner_url})`,
            height: "250px",
            justifyContent: "space-between",
            display: "flex",
          }}
        >
          <div className="hero-content">
            <h1 className="hero-title">
              {userDetails?.faculty_advisory_details?.registration_name}
            </h1>
            <div className="hero-tagline"></div>
            <p className="hero-subtitle"> </p>
          </div>
          <div> </div>
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        {/* Details Section */}
        <div className="details-container">
          <div className="details-content">
            <div className="program-header">
              <img src={mediaData?.logo_url} alt="Program Logo" className="program-logo" />

              <div className="program-info">
                <h2>
                  {userDetails?.faculty_advisory_details?.registration_name}
                </h2>
                <div className="program-meta">
                  <span className="online-badge">
                    {" "}
                    Registered: {new Date().toLocaleDateString()}
                  </span>
                  <span className="tag">
                    Code :{" "}
                    {userDetails?.faculty_advisory_details?.registration_code}
                  </span>
                </div>
              </div>
            </div>

            <div className="prize-section">
              <div className="prize-details">
                <div
                  onClick={() => showDrawer("description")}
                  style={{ display: "flex" }}
                  className="prize-label"
                >
                  Connecting All Circles is a vibrant community dedicated to
                  igniting creativity and encouraging exploration among
                  students.
                </div>
              </div>
            </div>

            <div className="category-tags-container">
              <h3 className="category-tags-title">
                <Tag className="category-icon" />
                Categories{" "}
              </h3>

              <div className="category-tags">
                {categories.map((category, index) => (
                  <span
                    key={index}
                    className="category"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="details-sidebar">
            <div className="price-section">
              <span style={{ cursor: "no-drop" }} className="price-1">
                ₹ 100/-
              </span>

              <div className="action-buttons">
                <button className="like-button">
                  <Heart />
                </button>
                <button className="share-button">
                  <Share2 />
                </button>
              </div>
            </div>

            <button style={{ display: "none" }} className="register-button">
              Join as a New Member
            </button>

            <div className="stats-list">
              <div className="stat-item">
                <Users className="stat-icon" />
                <div className="stat-details">
                  <span className="stat-label">Member Registered</span>
                  <span className="stat-value">230</span>
                </div>
              </div>
            </div>

            <div className="eligibility-section">
              <h3>Eligibility</h3>
              <p>Open for any Disciplane Students.</p>
            </div>
          </div>
        </div>

        <EventCardsDash />
      </div>
     </div>
    </>
  );
};

export default FacultyDashboard;












