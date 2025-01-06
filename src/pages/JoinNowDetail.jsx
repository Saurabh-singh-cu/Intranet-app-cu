import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, Share2, Users, Trophy, Eye, Clock, Tag } from "lucide-react";
import { MdOutlineArrowBack } from "react-icons/md";
import EventCardsDash from "./EventCardsDash";
import Scroller from "../components/Scroller";
import bannerclub from "../assets/images/bannerclub.jpg";

import React, { useEffect, useState } from "react";
import s1 from "../assets/images/s1.png";
import s2 from "../assets/images/s2.png";
import s3 from "../assets/images/s3.png";
import s4 from "../assets/images/s4.png";
import c1 from "../assets/images/c1.png";
import c3 from "../assets/images/c3.png";
import c4 from "../assets/images/c4.png";
import hackthon from "../assets/images/hackthon.jpg";
import clg from "../assets/images/clg.jpg";
import tech1 from "../assets/images/tech1.png";
import "./EventCardsDash.css";
import { FaFacebook, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { CgMail } from "react-icons/cg";
import EventCardEdit from "./EventCardEdit";
import { Button } from "antd";
import Swal from "sweetalert2";
import axios from "axios";
import RegisterModal from "./RegisterModal";
import "./JoinNowDetail.css";

const JoinNowDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mediaData, setMediaData] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [editMember, setEditMember] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const selectedSociety = location.state?.society;
  const reg_id1 = selectedSociety?.reg_id;
  console.log(reg_id1, "REG IDDDD");

  console.log(selectedSociety, "SELECTEDDDDDDDDDDDDDDDDDDD");

  const approvedMedia = async () => {
    if (!selectedSociety || !selectedSociety.reg_id) {
      console.error("No reg_id available");
      return;
    }

    try {
      const response = await axios.get(
        `http://172.17.2.247:8080/intranetapp/entity_media_approved/${selectedSociety.reg_id}/`
      );
      setMediaData(response.data[0]);
      console.log(response.data[0], "FETCH MEDIA");
    } catch (error) {
      console.error("Error fetching approved media:", error);
    }
  };

  const fetchSocieties = async () => {
    try {
      const response = await axios.get(
        "http://172.17.2.247:8080/intranetapp/entity-registration-summary/?entity_id=1"
      );
      setSocieties(response.data);
      console.log(response.data, "Fetched Societies");
    } catch (error) {
      console.error("Error fetching societies:", error);
    }
  };

  useEffect(() => {
    if (selectedSociety && selectedSociety.reg_id) {
      approvedMedia();
      console.log(selectedSociety.reg_id, "Society Reg ID");
    }
    fetchSocieties();
  }, [selectedSociety]);

  if (!selectedSociety) {
    return <div>No society data available</div>;
  }

  const handleBack = () => {
    navigate(-1);
  };

  const categories = [
    { name: "Debate ", color: "#3498db" },
    { name: "Public Speaking", color: "#e74c3c" },
    { name: "Writing and Editing", color: "#2ecc71" },
    { name: "Leadership", color: "#f39c12" },
    { name: "Creative Expression", color: "#9b59b6" },
  ];

  const previousEvents = [
    {
      title: "Brain Battle Season 2",

      image: clg,
    },

    {
      title: "Reverse CodingX",

      image: c3,
    },
    {
      title: "Tech Summit 2023",

      image: c4,
    },
  ];

  const [committeeMembers, setCommitteeMembers] = useState([
    {
      name: "Shivani",
      position: "Secretary",
      image: s1,
      facebook: "",
      instagram: "",
      linkedin: "",
      gmail: "",
    },
    {
      name: "Saksham Gupta",
      position: "Joint Secretary",
      image: s2,
      facebook: "",
      instagram: "",
      linkedin: "",
      gmail: "",
    },
    {
      name: "Shivam Singh",
      position: "Faculty Advisor",
      image: s3,
      facebook: "",
      instagram: "",
      linkedin: "",
      gmail: "",
    },
    {
      name: "Raunak",
      position: "Faculty Co-Advisor",
      image: s4,
      facebook: "",
      instagram: "",
      linkedin: "",
      gmail: "",
    },
  ]);

  const handleEdit = (member) => {
    setEditMember(member);
  };

  const handleCloseDrawer = () => {
    setEditMember(null);
  };

  const getRegId = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return (
      userData?.faculty_advisory_details?.reg_id ||
      userData?.secretary_details?.reg_id
    );
  };

  // helper function

  const getEffectiveRegId = (reg_id1) => {
    const userData = JSON.parse(localStorage?.getItem("user"));
    if (userData) {
      return (
        userData?.faculty_advisory_details?.reg_id ||
        userData?.secretary_details?.reg_id
      );
    }
    return reg_id1;
  };

  const getEvents = async () => {
    try {
      const reg_id = getEffectiveRegId(reg_id1);
      const response = await axios.get(
        `http://172.17.2.247:8080/intranetapp/published-events/${reg_id}/`
      );
      setCurrentEvent(response?.data);
      console.log(response, "RRRRR");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post("api");
      if (response.ok) {
        setCommitteeMembers((prevMembers) =>
          prevMembers.map((member) =>
            member?.name === formData.name ? { ...member, ...formData } : member
          )
        );
        Swal.fire({
          title: "Profile Updated!",
          icon: "success",
        });
        setEditMember(null);
      } else {
        Swal.fire({
          title: "Something Went Wrong",
          icon: "error",
        });
        console.log("error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Something Went Wrong",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    const getuser = JSON.parse(localStorage.getItem("user"));

    console.log(getuser, "USER NAME");

    // Check if the user is a Student Secretary
    if (getuser && getuser.role_name === "Faculty Advisory") {
      setUserDetail(getuser);
    }
  }, []);

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setIsRegisterModalOpen(true);
  };

  return (
    <div className="club-details-page">
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${mediaData?.banner_url})` }}
      >
        <div className="hero-content">
          <h1 className="hero-title">{selectedSociety.registration_name}</h1>
          <div className="hero-tagline">
            <span>Nurturing</span> Excellence,
            <br />
            Strengthening <span>Talent.</span>
          </div>
          <p className="hero-subtitle">Owner : {selectedSociety.dept_name}</p>
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
            <img
              src={mediaData?.logo_url}
              alt="Program Logo"
              className="program-logo"
            />
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
            <span className="price-1">₹ {selectedSociety?.fee}</span>
            <div className="action-buttons">
              <button className="share-button">
                <Share2 />
              </button>
            </div>
          </div>

          <button
            onClick={() =>
              navigate("/join-now", {
                state: { society: location?.state?.society },
              })
            }
            className="register-button"
          >
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

      {/* <EventCardsDash /> */}
      <div>
        <div className="events-container">
          <section className="events-section">
            <div className="section-header-detail">
              <h2>Ongoing Events</h2>
            </div>
            <div className="cards-grid">
              {currentEvent.map((event, index) => {
                const startDate = new Date(event.start_date);
                const endDate = new Date(event.end_date);
                const options = {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                };
                const formattedStartDate = startDate.toLocaleDateString(
                  undefined,
                  options
                );
                const formattedEndDate = endDate.toLocaleDateString(
                  undefined,
                  options
                );
                const daysLeft = Math.ceil(
                  (endDate - new Date()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <div key={index} className="event-card">
                    <img
                      src={event.poster_url}
                      alt={event.event_name}
                      className="event-image"
                    />
                    <div className="event-content">
                      <h3 className="event-title">{event.event_name}</h3>
                      <div className="event-dates">
                        <span>
                          {formattedStartDate} - {formattedEndDate}
                        </span>
                      </div>
                      {/* <div className="event-description">{event.description}</div> */}
                      <div className="event-stats">
                        <div className="stat">
                          <span className="stat-value">
                            {event.limit === "0" ? "No Limit" : event.limit}
                          </span>
                          <span className="stat-label">Spots Left</span>
                        </div>
                        <div className="stat">
                          <span className="stat-value">{daysLeft}</span>
                          <span className="stat-label">Days Left</span>
                        </div>
                      </div>
                      <div className="event-duration">
                        <span>Duration: {event.duration} hours</span>
                      </div>
                      <button
                        className="register-button-e"
                        onClick={() => handleRegisterClick(event)}
                      >
                        Register Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="events-section">
            <div className="section-header-detail">
              <h2>Previous Events</h2>
            </div>
            <div className="cards-grid">
              {previousEvents.map((event, index) => (
                <div key={index} className="event-card previous">
                  <div className="event-image-container">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="event-image"
                    />
                    <div className="event-title-overlay">
                      <h3>{event.title}</h3>
                      <p>Closed</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="events-section">
            <div className="section-header-detail">
              <h2>Core Committee</h2>
            </div>
            <div className="cards-grid-core">
              {committeeMembers.map((member, index) => (
                <div key={index} className="committee-card">
                  <div className="member-image-wrapper">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="member-image"
                    />
                  </div>
                  <div className="member-content">
                    <h3 className="member-name">{member.name}</h3>
                    <div className="member-position">{member.position}</div>
                    <div className="member-social">
                      {member.facebook && <FaFacebook size={20} />}
                      {member.instagram && <FaInstagram size={20} />}
                      {member.linkedin && <FaLinkedinIn size={20} />}
                      {member.gmail && <CgMail size={20} />}
                    </div>
                    {userDetail && (
                      <Button
                        onClick={() => handleEdit(member)}
                        type="primary"
                        className="edit-button"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
          {editMember && (
            <EventCardEdit
              visible={!!editMember}
              onClose={handleCloseDrawer}
              member={editMember}
              onSubmit={handleSubmit}
            />
          )}

          <RegisterModal
            isOpen={isRegisterModalOpen}
            onClose={() => {
              setIsRegisterModalOpen(false);
              setSelectedEvent(null);
            }}
            eventId={selectedEvent?.er_id}
            eventName={selectedEvent?.event_name}
            posterUrl={selectedEvent?.poster_url}
            erId={selectedEvent?.er_id}
          />
        </div>
      </div>
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
