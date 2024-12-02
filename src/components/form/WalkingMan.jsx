import React from 'react';
import "./WalkingMan.css"

const WalkingMan = ({ position }) => {
  return (
    <div className={`walking-man ${position}`}>
      <div className="head"></div>
      <div className="body"></div>
      <div className="leg left"></div>
      <div className="leg right"></div>
      <div className="arm left"></div>
      <div className="arm right"></div>
    </div>
  );
};

export default WalkingMan;

