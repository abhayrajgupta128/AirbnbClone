import React from "react";
import Image from "./Image";

const PlaceImg = ({ place, index = 0, className = null }) => {
  if (!place || !place.photos || !place.photos.length) {
    return null; 
  }
  
  const imgClassName = className ? 'object-cover ' + className : 'object-cover';

  return (
    <Image src={place.photos[index]} className={imgClassName+''} />
  );
};

export default PlaceImg;
