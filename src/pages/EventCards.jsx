import React from 'react';
import './EventCard.css';

const EventCard = () => {
  const events = [
    { id: 1, title: 'Tech Conference', date: '2023-06-15', time: '09:00 AM', location: 'Main Auditorium' },
   
  
  ];

  return (
 
     
      <div className="events-list">
        {events.map((event) => (
          <div key={event.id} className="event-item">
            <div className="event-date">
              <span className="event-day">{new Date(event.date).getDate()}</span>
              <span className="event-month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div className="event-details">
              <h3 className="event-title">{event.title}</h3>
              <p className="event-time">{event.time}</p>
              <p className="event-location">{event.location}</p>
            </div>
          </div>
        ))}
      </div>
    
  
  );
};

export default EventCard;

