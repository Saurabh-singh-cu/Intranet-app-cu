import React, { useState, useEffect } from 'react';
import './StudentSecretaryPage.css';
import { FaUserFriends } from 'react-icons/fa';
import { MdEventAvailable } from 'react-icons/md';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { BsBank } from 'react-icons/bs';
import diljeet from "../../assets/images/diljeet.png";
import diljeet1 from "../../assets/images/diljeet1.png";

const StudentUpdatedPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [userName, setUserName] = useState({ role_name: 'Student' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  const slides = [
    { title: 'Campus Life', image: diljeet },
    { title: 'Student Activities', image: diljeet1 },
    { title: 'Academic Excellence', image: '/placeholder.svg?height=200&width=400' },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleReplyClick = () => {
    setIsModalOpen(true);
  };

  const handleSendClick = () => {
    // Implement send functionality here
    setIsModalOpen(false);
    setReplyText('');
  };

  return (
    <div className="updated-dashboard">
      <div className="updated-logged-in-role">{userName.role_name}</div>
      
      <div className="updated-metric-cards">
        <div className="updated-metric-card">
          <img src="/placeholder.svg?height=100&width=100" alt="Circle background" />
          <h2>100+</h2>
          <p>Member</p>
          <span className="updated-icon">
            <FaUserFriends size={50} />
          </span>
        </div>
        <div className="updated-metric-card">
          <img src="/placeholder.svg?height=100&width=100" alt="Circle background" />
          <h2>Events</h2>
          <p>Proposed 05/10</p>
          <span className="updated-icon">
            <MdEventAvailable size={50} />
          </span>
        </div>
        <div className="updated-metric-card">
          <img src="/placeholder.svg?height=100&width=100" alt="Circle background" />
          <h2>5000</h2>
          <p>Financial Budget</p>
          <span className="updated-icon">
            <FaMoneyBillTrendUp size={50} />
          </span>
        </div>
        <div className="updated-metric-card">
          <img src="/placeholder.svg?height=100&width=100" alt="Circle background" />
          <h2>100</h2>
          <p>Credits Earned</p>
          <span className="updated-icon">
            <BsBank size={50} />
          </span>
        </div>
      </div>

      <div className="updated-content-columns">
        <div className="updated-left-column">
          <div className="updated-announcement-card">
            <div className="updated-card-header">
              <h4>Feature Event</h4>
              <span className="updated-notification-icon">🔔</span>
            </div>
            <div className="updated-banner-image">
              <img src="/placeholder.svg?height=200&width=400" alt="IGNITE 2024" />
              <div className="updated-banner-overlay">
                <span>IGNITE | NEWS</span>
                <h2>CU FEST Live Concert 2024</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="updated-right-column">
          <div className="updated-calendar-card">
            {/* Add Calendar component here */}
            <h4>Calendar</h4>
            <p>Calendar component placeholder</p>
          </div>
        </div>
      </div>

      <div className="updated-bottom-cards">
        <div className="updated-notification-card">
          <div className="updated-card-header">
            <h4>Announcement</h4>
            <span className="updated-notification-icon">🔔</span>
          </div>
          <div className="updated-notification-list">
            <div className="updated-notification-item">
              <h5>From: Academic Affair</h5>
              <p>CU FEST 2024 will be live today.</p>
            </div>
          </div>
          <div className="updated-card-footer">
            <button className="updated-view-more-btn">View More</button>
          </div>
        </div>

        <div className="updated-notification-card">
          <div className="updated-card-header">
            <h4>Discussion Forum</h4>
            <span className="updated-notification-icon">🗣️</span>
          </div>
          <div className="updated-notification-list">
            <div className="updated-notification-item">
              <h5>From PVC office</h5>
              <p>Is AI has become an integral part of many systems and processes?</p>
              <button className="updated-view-more-btn" onClick={handleReplyClick}>Reply</button>
            </div>
          </div>
          <div className="updated-card-footer">
            <button className="updated-view-more-btn">View More</button>
          </div>
        </div>

        <div className="updated-carousel-card">
          <div className="updated-carousel-container">
            <button onClick={prevSlide} className="updated-carousel-button prev">❮</button>
            <div className="updated-carousel">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`updated-carousel-slide ${index === currentSlide ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="updated-carousel-content">
                    <h4>{slide.title}</h4>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={nextSlide} className="updated-carousel-button next">❯</button>
          </div>
        </div>
      </div>

      <footer className="updated-dashboard-footer">
        <div>@Curriculum Portal</div>
      </footer>

      {isModalOpen && (
        <div className="updated-modal-overlay">
          <div className="updated-modal-content">
            <button className="updated-modal-close" onClick={() => setIsModalOpen(false)}>×</button>
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

export default StudentUpdatedPage;

