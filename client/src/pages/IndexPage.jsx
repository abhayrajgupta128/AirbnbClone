import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../components/Image";

const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/place/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);
  
  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {places.length > 0 &&
        places.map((place, index) => (
          <div key={index}>
            <Link to={"/place/" + place._id}>
              <div className="flex bg-gray-500 mb-2 rounded-2xl">
                {place.photos?.[0] && (
                  <Image src={place.photos?.[0]} className="rounded-2xl object-cover aspect-square" />
                )}
              </div>
              <h2 className="font-bold">{place.address}</h2>
              <h3 className="text-sm text-gray-500">{place.title}</h3>
              <div className="mt-1">
                <span className="font-bold">${place.price}</span>per night
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default IndexPage;
