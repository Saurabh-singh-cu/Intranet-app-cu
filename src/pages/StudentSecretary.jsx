import React, { useEffect, useState } from "react";
import diljeet1 from "../assets/images/diljeet1.png";
import diljeet from "../assets/images/diljeet.png";
import c4 from "../assets/images/c4.png";
import "./AdminDashboard.css";
import Calendar from "./Calendar";
import { useNavigate } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";
import circle from "../assets/images/circle.svg";
import {
  MdCardMembership,
  MdEventAvailable,
  MdGroupAdd,
  MdOutlineAttachMoney,
} from "react-icons/md";
import {
  BsBank,
  BsBuildingsFill,
  BsCreditCard2Front,
  BsFillFilePptFill,
} from "react-icons/bs";
import axios from "axios";
import { BsBuildingsFill } from "react-icons/bs";
import { BsFillFilePptFill } from "react-icons/bs";
import { BsBank } from "react-icons/bs";
import { FaMoneyBillTrendUp } from "react-icons/fa6";


const StudentSecretary = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userName, setUserName] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [dashboardCount, setDashboardCount] = useState([]);
  const [filteredData, setFilteredData] = useState({
    club: 0,
    community: 0,
    professionalSociety: 0,
    departmentSociety: 0,
    all: 0,
  });

  const navigate = useNavigate();

  const slides = [
    { title: "Campus Life", image: diljeet1 },
    { title: "Student Activities", image: diljeet },
    { title: "Academic Excellence", image: c4 },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const redirectClubs = () => {
    navigate("/registered-entities");
  };
  const redirectClubsAdmin = () => {
    navigate("/registered-entities");
  };
  const redirectSociety = () => {
    navigate("/registered-entities");
  };
  const redirectComm = () => {
    navigate("/registered-entities");
  };

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  useEffect(() => {
    const getuser = JSON.parse(localStorage.getItem("user"));
    setUserName(getuser);
    console.log(getuser, "USER NAME");
    dashboardCardCount();
  }, []);

  useEffect(() => {
    dashboardCardCount();
  }, []);

  const dashboardCardCount = async () => {
    try {
      const response = await axios.get(
        "http://172.17.2.247:8080/intranetapp/entity_count/"
      );
      setDashboardCount(response.data);
      filterData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterData = (data) => {
    const filtered = {
      club: data.find((item) => item.entity_name === "CLUB")?.entity_count || 0,
      community:
        data.find((item) => item.entity_name === "COMMUNITY")?.entity_count ||
        0,
      professionalSociety:
        data.find((item) => item.entity_name === "PROFESSIONAL SOCIETY")
          ?.entity_count || 0,
      departmentSociety:
        data.find((item) => item.entity_name === "DEPARTMENT SOCIETY")
          ?.entity_count || 0,
      all: data.reduce((sum, item) => sum + item.entity_count, 0),
    };
    setFilteredData(filtered);
  };

  const handleReplyClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="dashboard-home">
       <div className="loggedInAss">{userName?.role_name}</div>
      <div className="metric-cards-home">
        <div  className="metric-card-home card4h">
          <img src={circle} />
          {/* <h2>{filteredData?.club}</h2> */}
          <h2>100+</h2>
          <p>Member</p>

          <span className="icon-home">
            <FaUserFriends  size={50} />
          </span>
        </div>

        <div  className="metric-card-home card4h">
          <img src={circle} />
          {/* <h2>{filteredData?.departmentSociety}</h2> */}
          <h2>Events</h2>
          <p>Proposed 05/10</p>
          {/* <h2>16</h2> */}
          {/* <p>Events</p> */}
          <span className="icon-home">
            {" "}
            <MdEventAvailable  size={50} />
          </span>
        </div>
        <div className="metric-card-home card4h">
          <img src={circle} />
          {/* <h2>{filteredData?.professionalSociety}</h2> */}
          <h2>5000</h2>
          <p>Financial Budget</p>
          {/* <h2>1 Cr</h2> */}
          {/* <p>Final Budget</p> */}
          <span className="icon-home">
            {" "}
            <FaMoneyBillTrendUp   size={50} />
          </span>
        </div>
        <div  className="metric-card-home card4h">
          <img src={circle} />
          {/* <h2>{filteredData?.community}</h2> */}
          <h2>100</h2>
          <p>Credits Earned</p>
          {/* <h2>12</h2> */}
          {/* <p>Credit</p> */}
          <span className="icon-home">
            {" "}
            <BsBank size={50} />
          </span>
        </div>
      </div>

      {isLoggedIn === true && userName?.role_name === "Admin" ? (
        <div className="bottom-cards-home">
          <div className="notification-card-home ">
            <div className="card-header-home">
              <h4>Configuration</h4>
              <span className="notification-icon-home">🔔</span>
            </div>
            <div className="notification-list">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="notification-item"
              >
                <div>
                  <h5>Make User </h5>
                  <p>Create a fresh new user</p>
                </div>
                <div
                  style={{
                    background: "#FFE6A9",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                >
                  Go
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="notification-item"
              >
                <div>
                  <h5>Handle Session </h5>
                  <p>Update current session for Intranet</p>
                </div>
                <div
                  style={{
                    background: "#FFE6A9",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                >
                  Go
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="notification-item"
              >
                <div>
                  <h5>Entity </h5>
                  <p>View Entity Table</p>
                </div>
                <div
                  style={{
                    background: "#FFE6A9",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                >
                  Go
                </div>
              </div>
            </div>
            <div className="card-footer-home">
              <button className="view-more-btn-home">View More</button>
            </div>
          </div>

          <div className="notification-card-home">
            <div className="card-header-home adminPending">
              <h4>Pending Approval</h4>
              <span className="notification-icon-home">🗣️</span>
            </div>
            <div className="notification-list">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="notification-item"
              >
                <div>
                  <h5>Entity Status </h5>
                  <p>Update status of entity request</p>
                </div>
                <div
                  style={{
                    background: "#FFE6A9",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                >
                  Go
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="notification-item"
              >
                <div>
                  <h5>Registered Entity </h5>
                  <p>Registered entity table </p>
                </div>
                <div
                  style={{
                    background: "#FFE6A9",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                >
                  Go
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="notification-item"
              >
                <div>
                  <h5>Entity Form </h5>
                  <p>Entity Registration Form </p>
                </div>
                <div
                  style={{
                    background: "#FFE6A9",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                >
                  Go
                </div>
              </div>
            </div>
            <div className="card-footer-home">
              <button className="view-more-btn-home">View More</button>
            </div>
          </div>

          <div className="notification-card-home">
            <div className="card-header-home adminPending">
              <h4>High Priority</h4>
              <span className="notification-icon-home">🗣️</span>
            </div>
            <div className="notification-list">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="notification-item"
              >
                <div>
                  <h5>PVC task </h5>
                  <p>message from PVC Office </p>
                </div>
                <div
                  style={{
                    background: "#FFE6A9",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                >
                  Go
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="notification-item"
              >
                <div>
                  <h5>Session at 2:20 PM </h5>
                  <p>Zoom Session Meet with PVC </p>
                </div>
                <div
                  style={{
                    background: "#FFE6A9",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                >
                  Go
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="notification-item"
              >
                <div>
                  <h5>Registered Entity </h5>
                  <p>Registered entity table </p>
                </div>
                <div
                  style={{
                    background: "#FFE6A9",
                    padding: "5px",
                    cursor: "pointer",
                  }}
                >
                  Go
                </div>
              </div>
            </div>
            <div className="card-footer-home">
              <button className="view-more-btn-home">View More</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="content-columns-home">
          <div className="left-column-home">
            <div className="announcement-card-home">
              <div className="card-header-home">
                <h4>Feature Event</h4>
                <span className="notification-icon-home">🔔</span>
              </div>
              <div className="banner-image-home">
                <img src={diljeet} alt="IGNITE 2024" />
                <div className="banner-overlay">
                  <span>IGNITE | NEWS</span>
                  <h2>CU FEST Live Concert 2024</h2>
                </div>
              </div>
              <div className="announcement-list-home">
                <div className="announcement-item-home">
                  <img src="/placeholder.svg?height=40&width=40" alt="" />
                  <div className="announcement-content-home"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="right-column-home">
            <div className="calendar-card-home">
              <Calendar />
            </div>
          </div>
        </div>
      )}

      <div className="bottom-cards-home">
        <div className="notification-card-home">
          <div className="card-header-home">
            <h4>Announcement</h4>
            <span className="notification-icon-home">🔔</span>
          </div>
          <div className="notification-list">
            <div className="notification-item">
              <h5>From: Academic Affair</h5>
              <p>CU FEST 2024 will be live today.</p>
            </div>
          </div>
          <div className="card-footer-home">
            <button className="view-more-btn-home">View More</button>
          </div>
        </div>

        <div className="notification-card-home">
          <div className="card-header-home">
            <h4>Discussion Forum</h4>
            <span className="notification-icon-home">🗣️</span>
          </div>
          <div className="notification-list">
            <div style={{ display: "flex" }} className="notification-item">
              <div>
                <h5>From PVC office</h5>
                <p>
                  Is AI has become an integral part of many systems and
                  processes,{" "}
                </p>
              </div>
              <div>
                <button className="reply-button" onClick={handleReplyClick}>
                  Reply
                </button>
              </div>
            </div>
          </div>
          <div className="card-footer-home">
            <button className="view-more-btn-home">View More</button>
          </div>
        </div>

        {isLoggedIn === true && userName?.role_name === "Admin" ? (
          <>
            {" "}
            <div className="calendar-card-home">
              <Calendar />
            </div>
          </>
        ) : (
          <>
            {" "}
            <div className="carousel-card-home">
              <div className="carousel-container">
                <button onClick={prevSlide} className="carousel-button prev">
                  ❮
                </button>
                <div className="carousel-home">
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className={`carousel-slide-home ${
                        index === currentSlide ? "active" : ""
                      }`}
                      style={{ backgroundImage: `url(${slide.image})` }}
                    >
                      <div className="carousel-content">
                        <h4>{slide.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={nextSlide} className="carousel-button next">
                  ❯
                </button>
              </div>
            </div>
          </>
        )}
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
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <h2>Reply to Discussion</h2>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
            />
            <button onClick={handleSendClick}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSecretary;
