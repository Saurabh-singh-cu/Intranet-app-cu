import React, { useEffect, useState } from "react";
import diljeet1 from "../assets/images/diljeet1.png";
import diljeet from "../assets/images/diljeet.png";
import c4 from "../assets/images/c4.png";
import "./AdminDashboard.css";
import Calendar from "./Calendar";
import { useNavigate } from "react-router-dom";
import circle from "../assets/images/circle.svg";
import { PiFlagBanner } from "react-icons/pi";
import { FaBell, FaHouseFlag, FaRegNewspaper, FaUnity } from "react-icons/fa6";
import { BiSolidBuildingHouse } from "react-icons/bi";
import axios from "axios";
import Swal from "sweetalert2";
import vv from "../assets/images/vv.png";
import vvv from "../assets/images/vvv.jpg";
import cf from "../assets/images/cf.jpg";
import am from "../assets/images/am.jpg";
import news1 from "../assets/images/news1.jpg";

const Dashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userName, setUserName] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [dashboardCount, setDashboardCount] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("generic");
  const [activeTab1, setActiveTab1] = useState("AppHolder");
  const [activeAccordion, setActiveAccordion] = useState(null);

  const [filteredData, setFilteredData] = useState({
    club: 0,
    community: 0,
    professionalSociety: 0,
    departmentSociety: 0,
    all: 0,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const navigate = useNavigate();

  const slides = [
    {
      title: (
        <span>
          Live <span style={{ color: "red" }} className="live-icon"></span>
        </span>
      ),
      image: news1,
    },
    { title: "Campus Life", image: diljeet1 },
    { title: "Student Activities", image: diljeet },
    { title: "Academic Excellence", image: c4 },
  ];

  const accordionData = [
    {
      title: "General Discussions",
      content: [
        "• Latest campus news and updates",
        "• Upcoming events and activities",
        "• Student life and experiences",
      ],
    },
    {
      title: "Academic Queries",
      content: [
        "• Course-related questions",
        "• Study tips and resources",
        "• Research opportunities",
      ],
    },
    {
      title: "Career Development",
      content: [
        "• Internship opportunities",
        "• Job market trends",
        "• Resume and interview tips",
      ],
    },
  ];

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const redirectClubs = () => {
    navigate("/clubs");
  };
  const redirectClubsAdmin = () => {
    navigate("/registered-entities");
  };
  const redirectSociety = () => {
    navigate("/department-society");
  };
  const redirectComm = () => {
    navigate("/communities");
  };
  const redirectPro = () => {
    navigate("/professional-society");
  };

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
        "http://172.17.2.176:8080/intranetapp/entity_count/"
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

  const handleSendClick = () => {
    Swal.fire({
      title: "You are not loggedIn",
      icon: "warning",
    });
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  const carouselImages = [
    {
      src: vv,
      alt: "Major Event 1",
      type: "UPCOMING MAJOR EVENT",
      title: "Annual Tech Conference 2024",
    },
    {
      src: vvv,
      alt: "Major Event 2",
      type: "UPCOMING MAJOR EVENT",
      title: "Global Leadership Summit",
    },
    {
      src: diljeet,
      alt: "University Event 1",
      type: "UPCOMING UNIVERSITY EVENT",
      title: "Freshers' Welcome Party",
    },
    {
      src: diljeet1,
      alt: "University Event 2",
      type: "UPCOMING UNIVERSITY EVENT",
      title: "Annual Sports Meet",
    },
    {
      src: cf,
      alt: "University Event 3",
      type: "UPCOMING UNIVERSITY EVENT",
      title: "Career Fair 2024",
    },
    {
      src: am,
      alt: "University Event 4",
      type: "UPCOMING UNIVERSITY EVENT",
      title: "Alumni Reunion",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const tabData = {
    generic: [
      {
        from: "PVC office",
        content:
          "Is AI becoming an integral part of many systems and processes?",
      },
      {
        from: "Student Affairs",
        content: "Reminder: Campus cleanup drive this weekend.",
      },
      // { from: "Library", content: "New books available in the Computer Science section." },
    ],
    club: [
      {
        from: "Robotics Club",
        content: "Join us for the annual robot-building competition!",
      },
      {
        from: "Debate Club",
        content: "Upcoming debate on climate change policies.",
      },
      // { from: "Art Club", content: "Exhibition of student artwork next week." },
    ],
    ps: [
      {
        from: "PS Division",
        content: "Internship opportunities available for 3rd year students.",
      },
      {
        from: "Career Services",
        content: "Resume building workshop on Friday.",
      },
      // { from: "Alumni Cell", content: "Connect with successful alumni in your field of interest." },
    ],
  };

  const tabData1 = {
    AppHolder: [
      {
        from: (
          <span
            style={{ color: "black", fontWeight: "bold", fontSize: "15px" }}
          >
            Faculty Advisor : Spectrum
          </span>
        ),
        content: (
          <span style={{ marginLeft: "14px", marginTop: "5px" }}>
            Club going to organize the workshop. Apply for Volunteer
          </span>
        ),
      },
      {
        from: (
          <span
            style={{ color: "black", fontWeight: "bold", fontSize: "15px" }}
          >
            Student Secretary : CAC
          </span>
        ),
        content: (
          <span style={{ marginLeft: "14px", marginTop: "5px" }}>
            Group Project Discussion going to be held today at 4PM near C3
            Block.
          </span>
        ),
      },
      // { from: "Library", content: "New books available in the Computer Science section." },
    ],
    facultyDept: [
      {
        from: "Co-Curricular Cord : CSE.",
        content: "Registration open for all department society till 10th Dec.",
      },
      {
        from: "HOD : CSE 3rd Year",
        content:
          " Mandatory DCPD workshop going to be organized by Career Department.",
      },
      // { from: "Art Club", content: "Exhibition of student artwork next week." },
    ],
  };

  return (
    <div className="dashboard-home">
      <div className="loggedInAss">
        {userName?.role_name ? userName?.role_name : "User"}
      </div>

      <div className="metric-cards-home">
        <div onClick={redirectClubs} className="metric-card-home card1h">
          <img src={circle} />
          <h2 className="cardCount">{filteredData?.club}</h2>
         
          <div style={{ fontSize: "16px", margin: "10px 0px" }}>
            Co-Curricular
          </div>
          <p style={{ fontSize: "23px", fontWeight: "bold" }}>Club</p>

          <span className="icon-home">
            <PiFlagBanner size={50} />
          </span>
        </div>

        <div onClick={redirectSociety} className="metric-card-home card2h">
          <img src={circle} />
          <h2 className="cardCount">{filteredData?.departmentSociety}</h2>
         
          <div style={{ fontSize: "16px", margin: "10px 0px" }}>
            Co-Curricular
          </div>
          <p style={{ fontSize: "23px", fontWeight: "bold" }}>
            Department Society
          </p>

          <span className="icon-home">
            {" "}
            <FaHouseFlag size={50} />
          </span>
        </div>
        <div onClick={redirectPro} className="metric-card-home card3h">
          <img src={circle} />
          <h2 className="cardCount">{filteredData?.professionalSociety}</h2>
         
          <div style={{ fontSize: "16px", margin: "10px 0px" }}>
            Co-Curricular
          </div>
          <p style={{ fontSize: "23px", fontWeight: "bold" }}>
            Professional Society
          </p>

          <span className="icon-home">
            {" "}
            <BiSolidBuildingHouse size={50} />
          </span>
        </div>
        <div onClick={redirectComm} className="metric-card-home card4h">
          <img src={circle} />
          <h2 className="cardCount">{filteredData?.community}</h2>
         
          <div style={{ fontSize: "16px", margin: "10px 0px" }}>
            Co-Curricular
          </div>
          <p style={{ fontSize: "23px", fontWeight: "bold" }}>Community</p>

          <span className="icon-home">
            {" "}
            <FaUnity size={50} />
          </span>
        </div>
      </div>

      <div className="content-columns-home">
        <div className="left-column-home">
          <div className="announcement-card-home">
            <div
              style={{ justifyContent: "center" }}
              className="card-header-home"
            >
              <h4 style={{ fontWeight: "bold", fontSize: "22px" }}>
                {carouselImages[currentIndex].title}
              </h4>
              {/* <span className="notification-icon-home">🔔</span> */}
            </div>
            <div className="banner-image-home">
              <div className="carousel">
                {carouselImages.map((image, index) => (
                  <div
                    key={index}
                    className={`carousel-item ${
                      index === currentIndex ? "active" : ""
                    }`}
                  >
                    <img src={image.src} alt={image.alt} />
                    <div className="carousel-overlay">
                      <span>{image.type}</span>
                      <h2>{image.title}</h2>
                    </div>
                  </div>
                ))}
                <div className="carousel-indicators">
                  {carouselImages.map((_, index) => (
                    <span
                      key={index}
                      className={`indicator ${
                        index === currentIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
            <div className="announcement-list-home"></div>
          </div>
        </div>

        <div className="right-column-home">
          <div className="calendar-card-home">
            <Calendar />
          </div>
        </div>
      </div>

      <div className="bottom-cards-home">
        <div className="notification-card-home">
          <div
            style={{ justifyContent: "center" }}
            className="card-header-home"
          >
            <h4>Announcement </h4>
      
          </div>
          <div className="notification-list">
            <div
              style={{ display: "flex", padding: "0px" }}
              className="notification-item"
            >
              {Object.keys(tabData1)?.map((tab) => (
                <button
                  key={tab}
                  className={`tab ${activeTab1 === tab ? "active" : ""}`}
                  onClick={() => setActiveTab1(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            {tabData1[activeTab1]?.map((message, index) => (
              <div key={index} className="message">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    overflow: "hidden",
                  }}
                  className="message-header"
                >
                  <h5 className="message-from">From: {message.from}</h5>
                </div>
                <p className="message-content">{message.content}</p>
              </div>
            ))}
          </div>
          <div className="card-footer-home">
            <button className="view-more-btn-home">View More</button>
          </div>
        </div>

        <div className="notification-card-home">
          <div
            style={{ justifyContent: "center" }}
            className="card-header-home"
          >
            <h4>Discussion Forum</h4>
          </div>
          <div className="notification-list">
            {accordionData.map((item, index) => (
              <div key={index} className="accordion-item">
                <button
                  className={`accordion-title ${
                    activeAccordion === index ? "active" : ""
                  }`}
                  onClick={() => toggleAccordion(index)}
                >
                  {item.title}
                  <span className="accordion-icon">
                    {activeAccordion === index ? "−" : "+"}
                  </span>
                </button>
                {activeAccordion === index && (
                  <div className="accordion-content">
                    {item.content.map((point, i) => (
                      <p key={i}>{point}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="card-footer-home">
            <button className="view-more-btn-home">View More</button>
          </div>
        </div>

        <div className="carousel-card-home">
          <div
            style={{ justifyContent: "center" }}
            className="card-header-home"
          >
            <h4>News</h4>
            {/* <span className="notification-icon-home">
              <FaRegNewspaper />
            </span> */}
          </div>
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

export default Dashboard;
