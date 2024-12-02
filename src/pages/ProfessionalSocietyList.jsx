import React, { useState, useEffect } from "react";
import { Search, Users, Building, BookOpen, Clock, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./ClubList.css";
import {
  MdGroup,
  MdOutlineArrowBack,
  MdOutlineOutlinedFlag,
} from "react-icons/md";
import { BsActivity } from "react-icons/bs";
import Scroller from "../components/Scroller";
import Footer from "../components/Footer";

const ProfessionalSociety = () => {
  const [societies, setSocieties] = useState([]);
  const [filteredSocieties, setFilteredSocieties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSocieties();
  }, []);

  const fetchSocieties = async () => {
    try {
      const response = await fetch(
        "http://172.17.2.176:8080/intranetapp/entity-registration-summary/?entity_id=3"
      );
      const data = await response.json();
      setSocieties(data);
      setFilteredSocieties(data);
    } catch (error) {
      console.error("Error fetching societies:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = societies.filter((society) =>
      society.registration_name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredSocieties(filtered);
  };

  const handleCardClick = (clubSociety) => {
    navigate("/join-now-detailed-page", { state: { society: clubSociety } });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="club-container">
      {/* Fixed Sidebar */}
      <aside className="sidebar-list-card3h">
        <div className="club-details-list">
          <h2 className="entity-name-head"> Student Chapters</h2>
          <p className="club-description">
            Join our most active Student Chapters and participate in
            exciting events and activities.
          </p>
          <div className="club-stats-list">
            <div className="stat-item-list">
              <MdGroup style={{ color: "white" }} size={20} />
              <span className="member-list-count">
                1000 Active Members in Pro. Soc.
              </span>
            </div>
            <div className="stat-item-list">
              <MdOutlineOutlinedFlag style={{ color: "white" }} size={20} />
              <span>{societies.length} Student Chapters</span>
            </div>
            <div className="stat-item-list">
              <BsActivity style={{ color: "white" }} size={20} />
              <span>50 Activities</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content-list">
        <div className="search-container-list">
          <div className="search-wrapper-list">
            <Search className="search-icon-list" />
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>
        <div className="back-button-card3h">
          <button onClick={handleBack}>
            <MdOutlineArrowBack />
            Back
          </button>
        </div>

        <div className="cards-grid-list">
          {filteredSocieties.map((clubSociety) => (
            <div
              key={clubSociety.registration_code}
              className="club-card-list-card3h"
              onClick={() => handleCardClick(clubSociety)}
            >
              <div className="club-numbers">
                <div className="club-card-image-card3h">
                  <h1>{clubSociety.registration_name?.charAt(0)}</h1>
                </div>
                <div className="card-content-list">
                  <h3>{clubSociety.registration_name}</h3>
                  <p style={{ fontWeight: "bold" }} className="club-location">
                    Owner : {clubSociety.dept_name}
                  </p>
                  <div className="card-stats-list">
                    <div className="stat">
                      <MdGroup size={16} />
                      <span>66 Registered Member</span>
                    </div>
                  </div>
                  <div className="tags"></div>
                </div>
              </div>
              <div className="price">Know More</div>
            </div>
          ))}
        </div>

        <div className="scroller-i">
          <Scroller />
        </div>
      </main>
      <Footer theme="chapTheme" />
    </div>
  );
};

export default ProfessionalSociety;
