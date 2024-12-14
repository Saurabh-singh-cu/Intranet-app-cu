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

const Dashboard = () => {
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
        "http://13.202.65.103/intranetapp/entity_count/"
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

  const categories = [
    { name: "Debate ", color: "#3498db" },
    { name: "Public Speaking", color: "#e74c3c" },
    { name: "Writing and Editing", color: "#2ecc71" },
    { name: "Leadership", color: "#f39c12" },
    { name: "Creative Expression", color: "#9b59b6" },
  ];

  const redirectToLogin = () => {
    alert("Redirecting you to login page.");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const giveWarningPrice = () => {
    Swal.fire({
      title: "Permission Denied",
      text: "Permission required from Admin! ",
      icon: "error",
      footer: '<a href="#">Please contact the Admin!</a>',
    });
  };

  const showDrawer = (content) => {
    setDrawerContent(content);
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
    setDrawerContent(null);
  };

  const handleEditContent = () => {
    // Here you would typically send the editContent to your backend
    message.success("Content updated successfully");
    onCloseDrawer();
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
        `http://13.202.65.103/intranetapp/entity_media_approved/${regId}/`
      );
      setMediaData(fetch?.data[0]);
      console.log(fetch?.data[0], "FETCH MEDIA");
    } catch (error) {
      console.log(error);
    }
  };

  const renderDrawerContent = () => {
    if (drawerContent === "media") {
      return (
        <>
          <form>
            <h3>Update Banner</h3>
            <Upload.Dragger
              name="banner"
              className="banner-box"
              multiple={false}
              beforeUpload={(file) => {
                setBannerFile(file);
                return false;
              }}
              onChange={(info) => {
                const { status } = info.file;
                if (status !== "uploading") {
                  console.log(info.file, info.fileList);
                }
                if (status === "done") {
                  message.success(
                    `${info.file.name} banner file ready for upload.`
                  );
                } else if (status === "error") {
                  message.error(
                    `${info.file.name} banner file failed to prepare.`
                  );
                }
              }}
              action="/api/upload"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to upload banner
              </p>
            </Upload.Dragger>

            <Button style={{ marginTop: 16 }} onClick={handleBannerUpload}>
              Update Media
            </Button>
          </form>
        </>
      );
    }
    switch (drawerContent) {
      case "banner":
        return (
          <>
            <Upload.Dragger
              name="bannerImage"
              className="banner-box"
              multiple={false}
              action="/api/upload" // Replace with your actual upload API endpoint
              onChange={(info) => {
                const { status } = info.file;
                if (status === "done") {
                  message.success(
                    `${info.file.name} file uploaded successfully.`
                  );
                } else if (status === "error") {
                  message.error(`${info.file.name} file upload failed.`);
                }
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from
                uploading company data or other sensitive files.
              </p>
            </Upload.Dragger>
            <Button style={{ marginTop: 16 }} onClick={handleEditContent}>
              Update Banner
            </Button>
          </>
        );
      case "logo":
        return (
          <>
            <h3 style={{ marginTop: "20px" }}>Update Logo</h3>
            <Upload.Dragger
              name="logo"
              multiple={false}
              beforeUpload={(file) => {
                setLogoFile(file);
                return false;
              }}
              onChange={(info) => {
                const { status } = info.file;
                if (status !== "uploading") {
                  console.log(info.file, info.fileList);
                }
                if (status === "done") {
                  message.success(
                    `${info.file.name} logo file ready for upload.`
                  );
                } else if (status === "error") {
                  message.error(
                    `${info.file.name} logo file failed to prepare.`
                  );
                }
              }}
              action="/api/upload"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to upload logo
              </p>
            </Upload.Dragger>
            <Button style={{ marginTop: 16 }} onClick={handleLogoUpload}>
              Update Logo
            </Button>
          </>
        );
      case "description":
        return (
          <>
            <ReactQuill
              theme="snow"
              value={editContent}
              onChange={setEditContent}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
            />
            <Button style={{ marginTop: 16 }} onClick={handleEditContent}>
              Update Description
            </Button>
          </>
        );
      case "categories":
        return (
          <>
            <Input.TextArea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Enter categories, separated by commas"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
            <Button style={{ marginTop: 16 }} onClick={handleEditContent}>
              Update Categories
            </Button>
          </>
        );
      case "eligibility":
        return (
          <>
            <ReactQuill
              theme="snow"
              value={editContent}
              onChange={setEditContent}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link"],
                  ["clean"],
                ],
              }}
            />
            <Button style={{ marginTop: 16 }} onClick={handleEditContent}>
              Update Eligibility
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  const handleBannerUpload = async () => {
    const formData = new FormData();
    formData.append("reg_id", userDetails?.secretary_details?.reg_id);

    // Append banner and logo files if they exist
    if (bannerFile) formData.append("banner", bannerFile);

    try {
      const response = await axios.post(
        "http://13.202.65.103/intranetapp/update_entity_media_banner/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        title: "Banner updated successfully",
        icon: "success",
      });
      onCloseDrawer();
    } catch (error) {
      console.error("Error updating Banner:", error);
      message.error("An error occurred while updating Banner");
      Swal.fire({
        title: "An error occurred while updating Banner",
        icon: "error",
      });
    }
  };
  const handleLogoUpload = async () => {
    const formData = new FormData();
    formData.append("reg_id", userDetails?.secretary_details?.reg_id);

    // Append banner and logo files if they exist

    if (logoFile) formData.append("logo", logoFile);

    try {
      const response = await axios.post(
        "http://13.202.65.103/intranetapp/update_entity_media_logo/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        title: "Logo updated successfully",
        icon: "success",
      });
      onCloseDrawer();
    } catch (error) {
      console.error("Error updating Logo:", error);
      Swal.fire({
        title: "An error occurred while updating Logo",
        icon: "error",
      });
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
      <div
        style={{ height: "89vh", overflow: "scroll" }}
        className="dashboard-home"
      >
        {userDetails && (
          <div className="secretary-info-container">
            <div className="secretary-info">
              <div className="secretary-header">
                <h2>Welcome, {userDetails.user_name}!</h2>
                <span className="role-badge">{userName?.role_name}</span>
              </div>
              <div className="secretary-details">
                <div className="detail-item">
                  <span className="detail-label">Entity:</span>
                  <span className="detail-value">
                    {userDetails?.secretary_details?.entity_name}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Registration Code:</span>
                  <span className="detail-value">
                    {userDetails?.secretary_details?.registration_code}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Owner:</span>
                  <span className="detail-value">
                    {userDetails?.secretary_details?.department}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {(isLoggedIn === true && userName?.role_name === "Student Secretary") ||
        userName?.role_name === "Admin" ? (
          <>
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
                    {userDetails?.secretary_details?.registration_name}
                  </h1>
                  <div className="hero-tagline"></div>
                  <p className="hero-subtitle"> </p>
                </div>
                <div>
                  {" "}
                  <Popover
                    title={`Update Banner and Logo for ${userDetails?.secretary_details?.registration_name}`}
                  >
                    <button
                      onClick={() => showDrawer("media")}
                      className="btn-edit btn-1"
                    >
                      Update Banner
                    </button>
                  </Popover>
                  {renderDrawerContent()}
                </div>
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
                    <img
                      src={mediaData?.logo_url}
                      alt="Program Logo"
                      className="program-logo"
                    />
                    <Button
                      onClick={() => showDrawer("logo")}
                      className="editIconS"
                      type="primary"
                      shape="circle"
                    >
                      <Popover
                        title={`Update/Remove Logo for ${userDetails?.secretary_details?.registration_name}`}
                      >
                        {" "}
                        <EditOutlined />
                      </Popover>
                    </Button>
                    <div className="program-info">
                      <h2>
                        {userDetails?.secretary_details?.registration_name}
                      </h2>
                      <div className="program-meta">
                        <span className="online-badge">
                          {" "}
                          Registered: {new Date().toLocaleDateString()}
                        </span>
                        <span className="tag">
                          Code :{" "}
                          {userDetails?.secretary_details?.registration_code}
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
                        Connecting All Circles is a vibrant community dedicated
                        to igniting creativity and encouraging exploration among
                        students.
                        <Button
                          className="editIconS"
                          type="primary"
                          shape="circle"
                        >
                          <Popover
                            title={`Update description for ${userDetails?.secretary_details?.registration_name}`}
                          >
                            {" "}
                            <EditOutlined />
                          </Popover>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="category-tags-container">
                    <h3 className="category-tags-title">
                      <Tag className="category-icon" />
                      Categories{" "}
                      <Button
                        onClick={() => showDrawer("categories")}
                        style={{ marginLeft: "10px" }}
                        type="primary"
                        shape="circle"
                      >
                        <Popover
                          title={`Add/Edit Categories for ${userDetails?.secretary_details?.registration_name}`}
                        >
                          {" "}
                          <EditOutlined />
                        </Popover>
                      </Button>
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
                    <Button
                      style={{ backgroundColor: "grey" }}
                      onClick={giveWarningPrice}
                      className="editIconS"
                      type="primary"
                      shape="circle"
                    >
                      <Popover
                        title={`Update price for ${userDetails?.secretary_details?.registration_name}`}
                      >
                        {" "}
                        <EditOutlined />
                      </Popover>
                    </Button>
                    <div className="action-buttons">
                      <button className="like-button">
                        <Heart />
                      </button>
                      <button className="share-button">
                        <Share2 />
                      </button>
                    </div>
                  </div>

                  <button
                    style={{ display: "none" }}
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
                    <Button
                      onClick={() => showDrawer("eligibility")}
                      type="primary"
                      shape="circle"
                    >
                      <Popover
                        title={`Update the Eligibility for ${userDetails?.secretary_details?.registration_name}`}
                      >
                        {" "}
                        <EditOutlined />
                      </Popover>
                    </Button>
                  </div>
                </div>
              </div>

              <EventCardsDash />
            </div>
          </>
        ) : (
          <>
            {" "}
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

              <div onClick={redirectComm} className="metric-card-home card4h">
                <img src={circle} />
                <h2 className="cardCount">{filteredData?.community}</h2>

                <div style={{ fontSize: "16px", margin: "10px 0px" }}>
                  Co-Curricular
                </div>
                <p style={{ fontSize: "23px", fontWeight: "bold" }}>
                  Community
                </p>

                <span className="icon-home">
                  {" "}
                  <FaUnity size={50} />
                </span>
              </div>

              <div
                onClick={redirectSociety}
                className="metric-card-home card2h"
              >
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
                <h2 className="cardCount">
                  {filteredData?.professionalSociety}
                </h2>

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
                      <button
                        onClick={prevSlide1}
                        className="carousel-button prev"
                      >
                        ❮
                      </button>
                      <button
                        onClick={nextSlide1}
                        className="carousel-button next"
                      >
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
                                activeTab1 === tab
                                  ? "anno-ico-white"
                                  : "anno-ico"
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
                        <p className="announcement-message ">
                          {message.content}
                        </p>
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
                {/* <div className="card-header-home">
                  <h4>News&Views</h4>
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
                </div> */}
                <NewsViews />
              </div>
            </div>
          </>
        )}

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
      <div className="scroller-i">
        <Scroller />
      </div>

      <Drawer
        title="Edit Content"
        placement="right"
        onClose={onCloseDrawer}
        visible={drawerVisible}
        width={400}
      >
        {renderDrawerContent()}
      </Drawer>
    </>
  );
};

export default Dashboard;
