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
import {
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
  Tag,
  Upload,
  Users,
} from "lucide-react";
import EventsCard from "./EventCards";
import {
  Badge,
  Button,
  Drawer,
  Input,
  message,
  notification,
  Popover,
  Upload,
  Space,
} from "antd";
import Avatar from "antd/es/avatar/avatar";
import {
  EditOutlined,
  InboxOutlined,
  NotificationOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Scroller from "../components/Scroller";
import bannerclub from "../assets/images/bannerclub.jpg";
import EventCardsDash from "./EventCardsDash";
import cc1 from "../assets/images/c3.png";
import { MdHeight, MdModeEdit } from "react-icons/md";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import expo from "../assets/images/expo.jpg";
import NewsViews from "./NewsViews";
import FacultyDashboard from "./FacultyDashboard";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userName, setUserName] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [dashboardCount, setDashboardCount] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("generic");
  const [activeTab1, setActiveTab1] = useState("Appointment Holder");
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);
  const [editContent, setEditContent] = useState("");

  const [bannerFile, setBannerFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const [regId, setRegId] = useState(null);
  const [mediaData, setMediaData] = useState(null);

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

  axios.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

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

    // Check if the user is a Student Secretary
    if (getuser && getuser.role_name === "Student Secretary") {
      setUserDetails(getuser);
    }
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



  const carouselImages = [
    {
      src: expo,
      alt: "Major Event 1",
      type: "Showcase of Innovation and Excellence",
      title: "CU Projects Expo 2025 ",
    },
    {
      src: vv,
      alt: "Major Event 1",
      type: "UPCOMING UNIVERSITY EVENT",
      title: "Annual Tech Conference 2024",
    },
    {
      src: vvv,
      alt: "Major Event 2",
      type: "UPCOMING CLUB EVENT",
      title: "Global Leadership Summit",
    },
    {
      src: diljeet,
      alt: "University Event 1",
      type: "UPCOMING DEPT. SOCIETY EVENT",
      title: "Freshers' Welcome Party",
    },
    {
      src: diljeet1,
      alt: "University Event 2",
      type: "UPCOMING PROF. SOCIETY EVENT",
      title: "Annual Sports Meet",
    },
    {
      src: cf,
      alt: "University Event 3",
      type: "UPCOMING CO-CURRICULAR EVENT",
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
    }, 12000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const tabData1 = {
    "Appointment Holder": [
      {
        from: "Faculty Advisor : Spectrum",
        content: "Club going to organize the workshop. Apply for Volunteer",
        messageTime: "2hr ago",
      },
      {
        from: "Student Secretary : CAC",
        content:
          "Group Project Discussion going to be held today at 4PM near C3 Block.",
        messageTime: "2hr ago",
      },
    ],
    "Section Management": [
      {
        from: "Co-Curricular Cord : CSE.",
        content: "Registration open for all department society till 10th Dec.",
        messageTime: "2hr ago",
      },
      {
        from: "HOD : CSE 3rd Year",
        content:
          "Mandatory DCPD workshop going to be organized by Career Department.",
        messageTime: "2hr ago",
      },
    ],
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const discussions = [
    {
      title: "Club",
      participants: ["G", "D", "T"],
      additionalCount: 5,
      content: "Discussion about various club activities and events.",
    },
    {
      title: "Community",
      participants: ["A", "Q", "S"],
      additionalCount: 3,
      content:
        "Discussion forum for all Chandigarh University Student Tech Community & Community.",
    },
    {
      title: "Department Society",
      participants: ["C", "D", "P", "J"],
      additionalCount: 2,
      content:
        "Discussion forum for all Chandigarh University Student Department Society.",
    },
    {
      title: "Professional Society (Student Chapters)",
      participants: ["C", "S"],
      additionalCount: 2,
      content:
        "Discussion forum for all Chandigarh University Student Chapters. ",
    },
  ];



  const redirectToLogin = () => {
    alert("Redirecting you to login page.");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };







  useEffect(() => {
    const getUserData = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          if (
            parsedUserData &&
            parsedUserData.secretary_details &&
            parsedUserData.secretary_details.reg_id
          ) {
            setRegId(parsedUserData.secretary_details.reg_id);
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





  // carousel button
  const nextSlide1 = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide1 = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change interval as needed
    return () => clearInterval(interval);
  }, [currentIndex, carouselImages.length]);
  return (
    <>
  <div style={{marginTop:"77px", overflow:"scroll", height:"100vh"}}>
  <div  className="metric-cards-home">
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
            Professional Society
          </div>
          <p style={{ fontSize: "23px", fontWeight: "bold" }}>
            Student Chapters
          </p>

          <span className="icon-home">
            {" "}
            <BiSolidBuildingHouse size={50} />
          </span>
        </div>
      </div>
      <div className="content-columns-home">
        <div className="left-column-home">
          <div className="announcement-card-home">
            <div
              style={{
                justifyContent: "center",
                padding: "5px",
                marginBottom: "0px",
              }}
              className="card-header-home"
            >
              <h4 style={{ fontWeight: "bold", fontSize: "22px" }}>
                {carouselImages[currentIndex].title}
              </h4>
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
                      <span style={{ textTransform: "uppercase" }}>
                        {image.type}
                      </span>
                      <h2>{image.title}</h2>
                    </div>
                  </div>
                ))}
                <button onClick={prevSlide1} className="carousel-button prev">
                  ❮
                </button>
                <button onClick={nextSlide1} className="carousel-button next">
                  ❯
                </button>
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
          <div className="card-header-home">
            <h4>Announcement</h4>
          </div>
          <div className="notification-list">
            <div
              style={{ display: "flex", padding: "0px" }}
              className="notification-item"
            >
              {Object.keys(tabData1)?.map((tab) => (
                <button
                  key={tab}
                  className={`tab ${activeTab1 === tab ? "activee" : ""}`}
                  onClick={() => setActiveTab1(tab)}
                >
                  <div style={{ fontSize: "15px" }}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
                  </div>
                  <div>
                    {" "}
                    <Badge style={{ marginBottom: "5px" }} count={2}>
                      <NotificationOutlined
                        className={`${
                          activeTab1 === tab ? "anno-ico-white" : "anno-ico"
                        }`}
                        style={{
                          fontSize: 16,
                          color: "white",
                        }}
                      />
                    </Badge>
                  </div>
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
                  <p className="announcement-message ">{message.content}</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p className="author-name">From: {message.from}</p>
                  <p className="author-name">{message?.messageTime}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card-footer-home">
            <button className="view-more-btn-home">View More</button>
          </div>
        </div>

        <div className="notification-card-home">
          <div className="card-header-home">
            <h4>Discussion Forum</h4>
          </div>
          <div className="discussion-wrapper">
            {discussions.map((discussion, index) => (
              <div key={index} className="accordion-item">
                <button
                  className={`accordion-title ${
                    activeAccordion === index ? "active" : ""
                  }`}
                  onClick={() => toggleAccordion(index)}
                >
                  <span>{discussion.title}</span>
                  <div className="accordion-right">
                    <div className="participants">
                      <div className="avatar-stack">
                        {discussion.participants.map((letter, i) => (
                          <div
                            key={i}
                            className="participant-avatar"
                            style={{
                              cursor: "pointer",
                              backgroundColor: getRandomColor(),
                            }}
                          >
                            {letter}
                          </div>
                        ))}
                      </div>
                      {discussion.additionalCount > 0 && (
                        <span className="additional-count">
                          +{discussion.additionalCount}
                        </span>
                      )}
                    </div>
                    <span className="accordion-icon">
                      {activeAccordion === index ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </span>
                  </div>
                </button>
                {activeAccordion === index && (
                  <div className="accordion-content">
                    <p
                      onClick={() => redirectToLogin()}
                      style={{ cursor: "pointer" }}
                    >
                      {discussion.content}
                    </p>
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
          <NewsViews />
        </div>
      </div>
  </div>
    </>
  );
};

export default Home;
