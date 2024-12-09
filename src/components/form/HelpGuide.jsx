import React, { useState } from "react";
import lost from "../../assets/images/lost.png";
import "./HelpGuide.css";

const HelpGuide = () => {
  const [activeSection, setActiveSection] = useState("universityBody");

  const guideContent = {
    universityBody: {
      title: "University Body Details",
      steps: [
        "Select the type of entity you want to register",
        "Enter the proposed name and date for your entity",
        "Choose the nature of your entity (Domain specific, Hackathon, etc.)",
        "Specify whether the entity is proposed by a student or faculty",
        "Fill in the proposer's details including name, email, and contact information",
        "Select the relevant department from the dropdown",
      ],
    },
    advisoryBoardStudent: {
      title: "Student Advisory Board",
      steps: [
        "Enter details for two Student Secretaries including:",
        "- Full names",
        "- University email addresses",
        "- Student UIDs",
        "- Mobile numbers",
        "Fill in information for two Student Advisors with the same details",
      ],
    },
    advisoryBoardFaculty: {
      title: "Faculty Advisory Board",
      steps: [
        "Provide information for two Faculty Advisors:",
        "- Full names",
        "- Official email addresses",
        "- Employee codes",
        "- Contact numbers",
        "Add details for two Faculty Co-Advisors with the same information",
      ],
    },
    acknowledgement: {
      title: "Acknowledgement",
      steps: [
        "Review all entered information",
        "Add any referral information if applicable",
        "Read and check the acknowledgement statement",
        "Complete the CAPTCHA verification",
        "Submit the form",
      ],
    },
  };

  return (
    <div className="help-guide">
      <div>
        <img style={{width:"300px"}} src={lost} />
      </div>
      <div>
        <h2>Form Filling Guide</h2>

        <div className="guide-tabs">
          {Object.keys(guideContent).map((section) => (
            <button
              key={section}
              className={`guide-tab ${
                activeSection === section ? "active" : ""
              }`}
              onClick={() => setActiveSection(section)}
            >
              {guideContent[section].title}
            </button>
          ))}
        </div>

        <div className="guide-content">
          <h3>{guideContent[activeSection].title}</h3>
          <ol>
            {guideContent[activeSection].steps.map((step, index) => (
              <li key={index} className="guide-step">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default HelpGuide;
