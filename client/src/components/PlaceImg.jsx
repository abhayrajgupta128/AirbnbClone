import React from "react";

const PlaceImg = ({ place, index = 0, className = null }) => {
  if (!place || !place.photos || !place.photos.length) {
    return null; 
  }
  
  const imgClassName = className ? 'object-cover ' + className : 'object-cover';

  return (
    <img
      className={imgClassName+''}
      src={"http://localhost:4000/uploads/" + place.photos[index]}
      alt=""
    />
  );
};

export default PlaceImg;
