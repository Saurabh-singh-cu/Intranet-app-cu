import React from "react";
import s1 from "../assets/images/s1.png";
import s2 from "../assets/images/s2.png";
import s3 from "../assets/images/s3.png";
import s4 from "../assets/images/s4.png";
import c1 from "../assets/images/c1.png";
import c2 from "../assets/images/c2.png";
import c3 from "../assets/images/c3.png";
import c4 from "../assets/images/c4.png";
import "./SpecificCard.css";

const SpecificCard = () => {
  const monthlyEvents = [
    { month: "Jun", count: 8 },
    { month: "Jul", count: 4 },
    { month: "Aug", count: 3 },
    { month: "Sep", count: 5 },
    { month: "Oct", count: 9 },
    { month: "Nov", count: 4 },
    { month: "Dec", count: 6 },
  ];

  const ongoingEvents = [
    {
      id: 1,
      title: "Modern marketing strategies",
      date: "23/07/2024",
      image: c1,
    },
    {
      id: 2,
      title: "NASA Space challenge Mode Part 1",
      date: "25/07/2024",
      image: c2,
    },
    {
      id: 3,
      title: "Modern marketing workshop",
      date: "27/07/2024",
      image: c3,
    },
    {
        id: 1,
        title: "Modern marketing strategies",
        date: "23/07/2024",
        image: c1,
      },
    {
      id: 2,
      title: "NASA Space challenge Mode Part 2",
      date: "25/07/2024",
      image: c2,
    },
    {
      id: 3,
      title: "Modern marketing workshop",
      date: "27/07/2024",
      image: c3,
    },
    {
        id: 2,
        title: "NASA Space challenge Mode Part 3",
        date: "25/07/2024",
        image: c2,
      },
  ];

  const renderBarChart = () => {
    const maxCount = Math.max(...monthlyEvents.map((event) => event.count));
    const barWidth = 100 / monthlyEvents.length;

    return (
      <svg className="chart" viewBox={`0 0 100 100`}>
        {monthlyEvents.map((event, index) => {
          const height = (event.count / maxCount) * 80;
          const x = index * barWidth;
          return (
            <g key={event.month}>
              <rect
                className="chart-bar"
                x={x + barWidth * 0.1}
                y={100 - height}
                width={barWidth * 0.8}
                height={height}
              />
              <text
                x={x + barWidth / 2}
                y="98"
                textAnchor="middle"
                fontSize="4"
              >
                {event.month}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="stats-grid">
        <div className="stat-card-spe events">
          <div className="stat-number-spe">03</div>
          <div className="stat-details-spe">
            <div>
              <div>Flagship: 03</div>
              <div>Periodic: 25</div>
              <div>Monthly: 10</div>
            </div>
            <div>Total Events</div>
          </div>
        </div>
        <div className="stat-card-spe members">
          <div className="stat-number-spe">178</div>
          <div className="stat-details-spe">
            <div>
              <div>Male: 50</div>
              <div>Female: 55</div>
              <div>Others: 69</div>
            </div>
            <div>Total Members</div>
          </div>
        </div>
        <div className="stat-card-spe funds">
          <div className="stat-number-spe">30,000</div>
          <div className="stat-details-spe">
            <div>Funds Utilized</div>
          </div>
        </div>
      </div>

      <div className="chart-calendar-grid">
        <div className="chart-container">
          <h3>Club CU</h3>
          {/* {renderBarChart()} */}
          <img style={{width:"100%", height:"300px"}} src={c4} />
        </div>

        <div className="calendar-container">
          <h3>Nov 2024</h3>
          <table className="calendar">
            <thead>
              <tr>
                <th>Sun</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, weekIndex) => (
                <tr key={weekIndex}>
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const day = weekIndex * 7 + dayIndex - 1;
                    return (
                      <td key={dayIndex}>
                        {day > 0 && day <= 31 && (
                          <div className={day === 19 ? "highlight" : ""}>
                            {day}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ongoing-events">
        <h3>Ongoing Events</h3>
        <div className="events-grid">
          {ongoingEvents.map((event) => (
            <div key={event.id} className="event-card">
              <img
                src={event.image}
                alt={event.title}
                className="event-image"
              />
              <div className="event-details">
                <div className="event-title">{event.title}</div>
                <div className="event-date">{event.date}</div>
                <button className="invite-button">Invite</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecificCard;
