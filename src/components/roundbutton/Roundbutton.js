import React from 'react';
import './RoundButton.css'; 
import Icons from '../Icons'; 

const RoundButton = ({ onClick, iconName }) => {
  const svgIcon = Icons[iconName] || null; 

  return (
    <button className="round-button" onClick={onClick}>
      {svgIcon}
    </button>
  );
};

export default RoundButton;