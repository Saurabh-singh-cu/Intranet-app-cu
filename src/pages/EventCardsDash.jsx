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

const EventCardsDash = () => {
  const [editMember, setEditMember] = useState(null);
  const [userDetail, setUserDetail] = useState(null);

  const ongoingEvents = [
    {
      title: "Hackthon",

      image: hackthon,
      registeredCount: "224",
      daysLeft: "11",
      prize: "Register Now",
    },
    {
      title: "Adobe",

      image: c1,
      registeredCount: "10",
      daysLeft: "14",
      prize: "Register Now",
    },
    {
      title: "Content Writing",

      image: tech1,
      registeredCount: "9",
      daysLeft: "3",
      prize: "Register Now",
    },
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

  return (
    <div className="events-container">
      <section className="events-section">
        <div className="section-header-detail">
          <h2>Ongoing Events</h2>
        </div>
        <div className="cards-grid">
          {ongoingEvents.map((event, index) => (
            <div key={index} className="event-card">
              <img
                src={event.image}
                alt={event.title}
                className="event-image"
              />
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <div className="event-company">{event.company}</div>
                <div className="event-stats">
                  <div className="stat">
                    <span className="stat-value">{event.registeredCount}</span>
                    <span className="stat-label">Registered</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{event.daysLeft}</span>
                    <span className="stat-label">days left</span>
                  </div>
                </div>
                <div className="prize-pool">{event.prize}</div>
              </div>
            </div>
          ))}
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
                  layout="fill"
                  objectFit="cover"
                />
                <div className="event-title-overlay">
                  <h3>{event.title}</h3>
                  <p
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "12px",
                    }}
                  >
                    Closed
                  </p>
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
               {userDetail &&  <Button
                  onClick={() => handleEdit(member)}
                  type="primary"
                  className="edit-button"
                >
                  Edit
                </Button>}
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
    </div>
  );
};

export default EventCardsDash;

