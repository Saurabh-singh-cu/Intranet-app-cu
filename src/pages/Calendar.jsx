import React, { useState } from "react";
import "./Calendar.css";
import { MdEventAvailable, MdOutlineAvTimer, MdClose } from "react-icons/md";

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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    setSelectedDate(clickedDate);

    if (day === 23 || day === 27) {
      const dummyData = day === 23
        ? [
            { title: "Thanks for visiting our Blog!", time: "Just now" },
            { title: "Intranet is on Progress", time: "Stay Tuned" }
          ]
        : [
            { title: "Project Deadline", time: "5:00 PM" },
            { title: "Team Meeting", time: "2:00 PM" }
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

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h4>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h4>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        {renderCalendar()}
      </div>

      {showModal && modalContent && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowModal(false)}>
              <MdClose />
            </button>
            <h2 className="modal-title">Events for {selectedDate}</h2>
            {modalContent.map((event, index) => (
              <div key={index} className="notification-card-modal">
                <div className="icon-container-modal">
                  <MdEventAvailable />
                </div>
                <div className="content-modal">
                  <div className="title-modal">{event.title}</div>
                  <div className="timestamp-modal">
                    <MdOutlineAvTimer />
                    <span>{event.time}</span>
                  </div>
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

