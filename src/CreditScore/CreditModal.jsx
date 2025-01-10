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
    const targetScore = 78;
    let currentScore = 0;
    const duration = 1500; // Reduced to 1.5 seconds for snappier feedback
    const interval = 16; // Smoother animation (60fps)
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
      // Synchronize needle and color fill
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
    if (score <= 25) return '#FF4136';
    if (score <= 50) return '#FFDC00';
    if (score <= 75) return '#0074D9';
    return '#2ECC40';
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
             <div style={{display:"flex", justifyContent:"center"}}>
             <button type="submit">Submit</button>
             </div>
            </form>
          </div>
        ) : (
          <div className="score-display">
            <div style={{display:"flex", justifyContent:"center", fontSize:"21px"}} className='score-detail'>Your Credit Score</div>
            <div className="score-header">
              <div className="score-detail">
                <span>UID: {uid}</span>
                <span>Name: {uid}</span>
              </div>
            </div>
            
            <div className="score-circle">
              <div 
                className={`circle ${score <= 25 ? 'blink-poor' : score > 75 ? 'blink-excellent' : ''}`} 
                ref={scoreRef} 
                style={{ '--score-color': getScoreColor() }}
              >
                <div className="meter-background"></div>
                <div className="meter-fill"></div>
                <div className="center-content">
                  <div className="percentage">{score}</div>
                  <div className="rating">{getRating()}</div>
                </div>
                {/* <div className="needle-container">
                  <div className="needle" ref={needleRef}>
                    <div className="needle-head"></div>
                  </div>
                </div> */}
                <div className="meter-marks"></div>
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
                <div>Entity: Eloquence Consortium </div>
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
