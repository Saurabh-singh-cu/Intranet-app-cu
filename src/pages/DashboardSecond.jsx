import React from "react";
import { GrAnnounce } from 'react-icons/gr';
import { MdQuestionAnswer } from 'react-icons/md';
import { FaClipboardList } from 'react-icons/fa';
import "./DashboardSecond.css";

const DashboardSecond = () => {

  const attendanceData = [
    {
      date: "18 Nov 24",
      day: "Mon",
      inTime: "09:08:25",
      outTime: "X",
      status: "-",
    },
    {
      date: "17 Nov 24",
      day: "Sun",
      inTime: "Week Off",
      outTime: "Week Off",
      status: "Sunday",
    },
    {
      date: "16 Nov 24",
      day: "Sat",
      inTime: "09:10:16",
      outTime: "16:44:39",
      status: "Present",
    },
    {
      date: "15 Nov 24",
      day: "Fri",
      inTime: "Holiday",
      outTime: "Holiday",
      status: "Holiday",
    },
    {
      date: "14 Nov 24",
      day: "Thu",
      inTime: "09:03:37",
      outTime: "16:47:29",
      status: "Present",
    },
  ];



  return (
    <div className="dashboard-container-2">
      <div className="card important-message-2">
        <div className="card-header-2">
          <GrAnnounce className="icon-2" />
          <h4>Important Message</h4>
        </div>
        <div className="card-content-2">
          <p>
            1.Earned Leave applied from date 04 Nov 2024 to 09 Nov 2024 rejected
            by Vinay Kumar Mittal:E15298
          </p>
          <p className="small-text-2">Administrator (Nov 18 2024 2:42PM)</p>
        </div>
      </div>

      <div className="card my-queries-2">
        <div className="card-header-2">
          <MdQuestionAnswer className="icon-2" />
          <h4>My Question Or Queries</h4>
        </div>
        <div className="card-content-2">
          <table>
            <thead>
              <tr>
                <th>Total</th>
                <th>Closed</th>
                <th>Open</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
          <div className="feedback-section-2">
            <h3>FeedBack To Answer</h3>
            <table>
              <thead>
                <tr>
                  <th>Staff</th>
                  <th>0</th>
                  <th>0</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Student</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card attendance-log-2">
        <div className="card-header-2">
          <FaClipboardList className="icon-2" />
          <h4>Attendance Log</h4>
          <span className="view-more-2">View More</span>
        </div>
        <div className="card-content-2">
          <table className="table-2">
            <thead>
              <tr >
                <th className="th-2">Date</th>
                <th className="th-2">Day</th>
                <th  className="th-2">In Time</th>
                <th className="th-2">Out Time</th>
                <th> className="th-2"Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((row, index) => (
                <tr key={index}>
                  <td className="th-2">{row.date}</td>
                  <td className="th-2">{row.day}</td>
                  <td className="th-2">{row.inTime}</td>
                  <td className="th-2">{row.outTime}</td>
                  <td className="th-2">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="last-updated-2">
            Last updated as on: 17-Nov-2024 11:30 PM
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSecond;
