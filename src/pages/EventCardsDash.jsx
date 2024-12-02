import React from 'react';
import s1 from "../assets/images/s1.png"
import s2 from "../assets/images/s2.png"
import s3 from "../assets/images/s3.png"
import s4 from "../assets/images/s4.png"
import c1 from "../assets/images/c1.png"
import c2 from "../assets/images/c2.png"
import c3 from "../assets/images/c3.png"
import c4 from "../assets/images/c4.png"
import hackthon from "../assets/images/hackthon.jpg"
import hack from "../assets/images/hack.png"
import tech1 from "../assets/images/tech1.png"
import tech2 from "../assets/images/tech2.png"
// import con from "../assets/images/con.jpg"
import './EventCardsDash.css';
import { FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';
import { CgMail } from "react-icons/cg";




const EventCardsDash = () => {
  const ongoingEvents = [
    {
      title: "Hackthon",
     
      image: hackthon,
      registeredCount: "224",
      daysLeft: "11",
      prize: "Register Now"
    },
    {
      title: "AI and Me",
     
      image: tech1,
      registeredCount: "10",
      daysLeft: "14",
      prize: "Register Now"
    },
    {
      title: "Content Writing",
     
      image: con,
      registeredCount: "9",
      daysLeft: "3",
      prize: "Register Now"
    },

  ];

  const previousEvents = [
    {
      title: "Brain Battle Season 2",
     
      image: c1,
     
    },
   
    {
      title: "Reverse CodingX",
      
      image: c3,
     
    },
    {
      title: "Tech Summit 2023",
     
      image: c4,
     
    }
  ];

  const committeeMembers = [
    {
      name: "Shivani",
      position: "Secretary",
      image: s1,
     
      website :<div><FaFacebook size={20} /> {" "} <CgMail size={20} />{" "} <FaInstagram size={20} />{" "}<FaLinkedinIn size={20} /> </div>
    },
    {
      name: "Saksham Gupta",
      position: "Joint Secretary",
      image:s2,
     
      website : <div><FaFacebook size={20} /> {" "} <CgMail size={20} />{" "} <FaInstagram size={20} />{" "}<FaLinkedinIn size={20} /> </div>
    },
    {
      name: "Shivam Singh",
      position: "Faculty Advisor",
      image: s3,
      
      website : <div><FaFacebook size={20} /> {" "} <CgMail size={20} />{" "} <FaInstagram size={20} />{" "}<FaLinkedinIn size={20} /> </div>
    },
    {
      name: "Raunak",
      position: "Faculty Co-Advisor",
      image: s4,
     
      website : <div><FaFacebook size={20} /> {" "} <CgMail size={20} />{" "} <FaInstagram size={20} />{" "}<FaLinkedinIn size={20} /> </div>
    }
  ];

  return (
    <div className="events-container">
      <section className="events-section">
        <div className="section-header-detail">
          <h2>Ongoing Events</h2>
         
        </div>
        <div className="cards-grid">
          {ongoingEvents.map((event, index) => (
            <div key={index} className="event-card">
              <img src={event.image} alt={event.title} className="event-image" />
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
                <img src={event.image} alt={event.title} layout="fill" objectFit="cover" />
                <div className="event-title-overlay">
                  <h3>{event.title}</h3>
                  <p style={{display:"flex", justifyContent:"center", color:"white", fontSize:"12px"}}>Closed</p>
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
                <img src={member.image} alt={member.name} className="member-image" />
              </div>
              <div className="member-content">
                <h3 className="member-name">{member.name}</h3>
                <div className="member-position">{member.position}</div>
                
                <a href="" className="website-link">{member?.website}</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventCardsDash;