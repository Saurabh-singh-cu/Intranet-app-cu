import React, { useState } from "react";
import "./Calendar.css";
import { MdEventAvailable, MdOutlineAvTimer, MdClose } from "react-icons/md";
import c1 from "../assets/images/c1.png";
import c2 from "../assets/images/c2.png";
import c3 from "../assets/images/c3.png";
import c4 from "../assets/images/c4.png";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day) => {
    const clickedDate = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    setSelectedDate(clickedDate);

    if (day === 23 || day === 27) {
      const dummyData =
        day === 23
          ? [
              { title: "Adobe Registration is open!", time: "Just now", logo : c1 },
              { title: "Intranet is on Progress", time: "Stay Tuned", logo : c2 },
            ]
          : [
              { title: "Workshop on Monday ", time: "02/12/2024", logo : c3 },
              { title: "Group Project Meeting", time: "03/12/2024", logo : c4 },
            ];

      setModalContent(dummyData);
      setShowModal(true);
    }
  };

  const renderCalendar = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isSpecialDay = day === 23 || day === 27;
      days.push(
        <div
          key={day}
          className={`calendar-day ${isSpecialDay ? "special-day" : ""}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
          {isSpecialDay && <span className="event-indicator"></span>}
        </div>
      );
    }
    return days;
  };

  const openGoogleForm = () => {
    
  }

  return (
    <div style={{ height: "100%" }} className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h4>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      <div style={{ height: "92%" }} className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>

      {showModal && modalContent && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={() => setShowModal(false)}
            >
              <MdClose />
            </button>
            <h2 className="modal-title">🔔Events</h2>
            {modalContent.map((event, index) => (
              <div key={index} className="notification-message">
                <div className="message-header">
                  <div className="user-info">
                  <div className="avatar">
                      <img 
                        src={event?.logo} 
                        alt="Event icon" 
                        className="event-image"
                      />
                    </div>
                    <div className="user-details">
                      <span className="username">{event.title}</span>
                      <div className="message-meta">
                        <span className="timestamp">{event.time}</span>
                        <span className="tag">Event</span>
                      </div>
                    </div>
                  </div>
               
                </div>
                <div className="message-actions">
                  <button onClick={() => openGoogleForm()} className="action-button approve">Register Now</button>
                 
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
