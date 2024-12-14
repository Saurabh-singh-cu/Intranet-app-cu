import React, { useEffect, useState } from "react";
import "./NewsViews.css";
import cc from "../assets/images/c1.png";
import c2 from "../assets/images/c2.png";
import c3 from "../assets/images/c3.png";
import ad1 from "../assets/images/ad1.png";
import aman from "../assets/images/aman.png";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const NewsViews = () => {
  const newsItems = [
    {
      image: ad1,
      title:
        "Chandigarh University becomes India's First ABET Accredited Private University",
      description:
        "CU has earned the Accreditation Board for Engineering and Technology (ABET) recognition for its nine engineering programmes, highest in India.",
      date: "23 Nov 2024",
    },
    {
      image: aman,
      title: "IGNITE 2024",
      description:
        "Aman Gupta Inspires at IGNITE 2024: A Celebration of Innovation and Entrepreneurship at Chandigarh University! On 23rd October 2024, Chandigarh University officially launched IGNITE 2024.",
      date: "24 Oct 2024",
    },
    {
      image: c3,
      title: "International Conference 2024",
      description:
        "Global academic leaders to converge at CU for the annual international conference on emerging technologies.",
      date: "December 3, 2023",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide1 = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide1 = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? newsItems.length - 1 : prevIndex - 1
    );
  };

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
      }, 10000);

      return () => clearInterval(timer);
    }, []);

  return (
    <div className="news-container">
      <div className="card-header-home">
        <h4>News & Views</h4>
      </div>
      <div className="news-content">
        {newsItems.map((item, index) => (
          <div
            key={index}
            className={`news-item ${index === currentIndex ? "active" : ""}`}
          >
            <div className="news-image">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="news-text">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="news-footer">
               
                <button onClick={prevSlide1} className="leftRightArrow prev">
                <FaAngleUp />
              </button>

              <button onClick={nextSlide1} className="leftRightArrow next">
                <FaAngleDown />
              </button>
              </div>
             
            </div>
        
             
            </div>
         
        ))}
      </div>
    </div>
  );
};

export default NewsViews;
