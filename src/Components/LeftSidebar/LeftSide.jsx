import React, { useRef, useState, useEffect, useContext } from "react";
import { Avatar, Tooltip } from "@material-tailwind/react";
import { AuthContext } from "../AppContext/AppContext";
import nature from "../../assets/images/nature.jpg";
import avatar from "../../assets/images/avatar.jpg";
import location from "../../assets/images/location.png";
import job from "../../assets/images/job.png";
import facebook from "../../assets/images/facebook.png";
import twitter from "../../assets/images/twitter.png";
import laptop from "../../assets/images/laptop.jpg";
import media from "../../assets/images/media.jpg";
import apps from "../../assets/images/apps.jpg";
import tik from "../../assets/images/tik.jpg";

const LeftSide = () => {
  const [currentAd, setCurrentAd] = useState({});
  const adIndex = useRef(0);
  const { user, userData } = useContext(AuthContext);

  const ads = [laptop, media, apps, tik];

  useEffect(() => {
    setCurrentAd(ads[0]);

    const adInterval = setInterval(() => {
      adIndex.current = (adIndex.current + 1) % ads.length;
      setCurrentAd(ads[adIndex.current]);
    }, 2000);

    return () => clearInterval(adInterval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white border-2 rounded-r-xl shadow-lg pb-4">
      <div className="relative">
        <img src={nature} alt="nature" className="h-28 w-full rounded-r-xl" />
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <Tooltip content="Profile" placement="top">
            <Avatar size="md" src={user?.photoURL || avatar} alt="avatar" />
          </Tooltip>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-700 font-medium">{user?.email || userData?.email}</p>
        <p className="text-gray-600 text-sm mt-1">Access premium insights</p>
        <button className="text-blue-600 font-semibold mt-2">Try App</button>
      </div>

      <div className="mt-6 pl-4">
        <div className="flex items-center mb-4">
          <img src={location} alt="location" className="h-8 mr-3" />
          <span className="font-semibold text-lg">California</span>
        </div>

        <div className="flex items-center">
          <img src={job} alt="job" className="h-8 mr-3" />
          <span className="font-semibold text-lg">React Developer</span>
        </div>
      </div>

      <div className="flex justify-around mt-6 text-blue-600 font-semibold">
        <button>Events</button>
        <button>Groups</button>
        <button>Follow</button>
        <button>More</button>
      </div>

      <div className="mt-8 pl-4">
        <p className="font-semibold text-lg">Social Profiles</p>
        <div className="flex items-center mt-4">
          <img src={facebook} alt="facebook" className="h-8 mr-3" />
          <span className="text-blue-500">Facebook</span>
        </div>

        <div className="flex items-center mt-4">
          <img src={twitter} alt="twitter" className="h-8 mr-3" />
          <span className="text-blue-500">Twitter</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="font-semibold text-lg mb-4">Sponsored Ad</p>
        <img src={currentAd} alt="advertisement" className="h-36 rounded-lg" />
      </div>
    </div>
  );
};

export default LeftSide;
