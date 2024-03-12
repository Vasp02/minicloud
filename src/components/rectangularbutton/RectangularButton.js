import React from 'react';
import './RectangularButton.css'; 
import Icons from '../Icons'; 

const RectangularButton = ({ onClick, iconName }) => {
  const svgIcon = Icons[iconName] || null;

  return (
    <button className="rectangular-button" onClick={onClick}>
      {svgIcon}
    </button>
  );
};

export default RectangularButton;