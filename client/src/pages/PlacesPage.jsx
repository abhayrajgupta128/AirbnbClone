import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AccountNavigation, PlaceImg } from "../components";

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/place/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  return (
    <div>
      <AccountNavigation />

      <div className="text-center">
        <Link
          className=" inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new place
        </Link>
      </div>
      <div className="mt-4">
        {places.length > 0 &&
          places.map((place) => (
            <Link key={place._id} to={"/account/places/" + place._id} className="flex flex-col sm:flex-row gap-4 bg-gray-200 rounded-2xl mt-2 p-4 ">
              {/* <div className=""> */}
                <div className="flex w-32 h-32 bg-gray-300 shrink-0 grow rounded-xl">
                  <PlaceImg place={place} className="rounded-xl" />
                </div>
                <div className="grow-0 shrink">
                  <h2 className="text-xl">{place.title}</h2>
                  <p className="text-sm mt-2">{place.description}</p>
                </div>
              {/* </div> */}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default PlacesPage;
