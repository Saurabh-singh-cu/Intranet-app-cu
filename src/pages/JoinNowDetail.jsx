import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart, Share2, Users, Trophy, Eye, Clock, Tag } from "lucide-react";
import bannerclub from "../assets/images/bannerclub.jpg";
import cc1 from "../assets/images/c3.png";
import "./JoinNowDetail.css";
import EventCardsDash from "./EventCardsDash";
import Scroller from "../components/Scroller";
import { MdOutlineArrowBack } from "react-icons/md";

const JoinNowDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { society: selectedSociety } = location.state || {};

  console.log(selectedSociety, "SELECTEDDDDDDDDDDDDDDDDDDD")

  if (!selectedSociety) {
    return <div>No society data available</div>;
  }

  const categories = [
    { name: "Debate ", color: "#3498db" },
    { name: "Public Speaking", color: "#e74c3c" },
    { name: "Writing and Editing", color: "#2ecc71" },
    { name: "Leadership", color: "#f39c12" },
    { name: "Creative Expression", color: "#9b59b6" },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="club-details-page">
     
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${bannerclub})` }}
      >
        <div className="hero-content">
          <h1 className="hero-title">{selectedSociety.registration_name}</h1>
          <div className="hero-tagline">
            <span>Nurturing</span> Excellence,
            <br />
            Strengthening <span>Talent.</span>
          </div>
          <p className="hero-subtitle">{selectedSociety.dept_name}</p>
        </div>
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Details Section */}
      <div className="back-button-joinnow">
          <button onClick={handleBack}>
            <MdOutlineArrowBack />
            Back
          </button>
        </div>
      <div className="details-container">
        <div className="details-content">
          <div className="program-header">
            <img src={cc1} alt="Program Logo" className="program-logo" />
            <div className="program-info">
              <h2>{selectedSociety.registration_name}</h2>
              <div className="program-meta">
                <span className="online-badge">
                  {" "}
                  Registered: {new Date().toLocaleDateString()}
                </span>
                <span className="tag">
                  Code : {selectedSociety.registration_code}
                </span>
              </div>
            </div>
          </div>

          <div className="prize-section">
            <div className="prize-details">
              <div className="prize-label">
                Connecting All Circles is a vibrant community dedicated to
                igniting creativity and encouraging exploration among students.
              </div>
            </div>
          </div>

         

          <div className="category-tags-container">
            <h3 className="category-tags-title">
              <Tag className="category-icon" />
              Categories
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
            <span className="price-1">₹ 100/-</span>
            <div className="action-buttons">
              <button className="like-button">
                <Heart />
              </button>
              <button className="share-button">
                <Share2 />
              </button>
            </div>
          </div>

          <button className="register-button">Join as a New Member</button>

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
      <div className="scroller-i">
        <Scroller />
      </div>

      <footer
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="dashboard-footer"
      >
        <div>@Curriculum Portal</div>
      </footer>
    </div>
  );
};

export default JoinNowDetail;
