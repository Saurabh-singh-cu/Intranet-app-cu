import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import './CreditModal.css';

const CreditModal = ({ isOpen, onClose, onSubmit }) => {
  const [uid, setUid] = useState('');
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(null);
  const needleRef = useRef(null);
  const modalRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (uid) {
      setShowScore(true);
      animateScore();
    }
  };

  const animateScore = () => {
    const targetScore = 89; // This can be dynamic based on actual data
    let currentScore = 0;
    const duration = 2000; // 2 seconds
    const interval = 20; // Update every 20ms
    const steps = duration / interval;
    const increment = targetScore / steps;

    const timer = setInterval(() => {
      currentScore += increment;
      if (currentScore >= targetScore) {
        clearInterval(timer);
        currentScore = targetScore;
      }
      setScore(Math.round(currentScore));
    }, interval);
  };

  useEffect(() => {
    if (showScore) {
      const rotation = (score / 100) * 180 - 90;
      if (needleRef.current) {
        needleRef.current.style.transform = `rotate(${rotation}deg)`;
      }
      if (scoreRef.current) {
        scoreRef.current.style.setProperty('--score', `${score}`);
      }
    }
  }, [score, showScore]);

  const getScoreColor = () => {
    if (score <= 25) return '#FF4136'; // Red
    if (score <= 50) return '#FFDC00'; // Yellow
    if (score <= 75) return '#0074D9'; // Blue
    return '#2ECC40'; // Green
  };

  const getRating = () => {
    if (score <= 25) return 'Poor';
    if (score <= 50) return 'Fair';
    if (score <= 75) return 'Good';
    return 'Excellent';
  };

  const handleDownload = () => {
    if (modalRef.current) {
      html2canvas(modalRef.current).then(canvas => {
        const link = document.createElement('a');
        link.download = 'credit_report.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-credit">
      <div className="modal-content-credit" ref={modalRef}>
        <button className="modal-close-credit" onClick={onClose}>×</button>
        
        {!showScore ? (
          <div className="uid-form">
            <h2>Enter Your UID</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder="Enter your UID"
                required
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        ) : (
          <div className="score-display">
            <div className="score-header">
              <div className="score-detail">
                <span>UID: {uid}</span>
                <span>Name: {uid}</span>
              </div>
            </div>
            
            <div className="score-circle">
              <div className="circle" ref={scoreRef} style={{ '--score-color': getScoreColor() }}>
                <div className="percentage">{score}%</div>
                <div className="rating">{getRating()}</div>
                <div className="needle" ref={needleRef}></div>
              </div>
            </div>
            
            <div className="score-legend">
              <div className="legend-item">
                <span className="dot poor"></span>
                <span>Poor</span>
              </div>
              <div className="legend-item">
                <span className="dot fair"></span>
                <span>Fair</span>
              </div>
              <div className="legend-item">
                <span className="dot good"></span>
                <span>Good</span>
              </div>
              <div className="legend-item">
                <span className="dot excellent"></span>
                <span>Excellent</span>
              </div>
            </div>
            
            <div className="score-footer">
              <div className="member-info">
                <div>Membership Id: 12548662</div>
                <div>Department Name: DAA</div>
                <div>Name: {uid}</div>
                <div>Date: 20/01/2025</div>
              </div>
              <button className="download-btn" onClick={handleDownload}>Download Report</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditModal;

