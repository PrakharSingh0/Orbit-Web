import React from "react";
import { Link } from "react-router-dom";
import { Avatar, Button } from "@material-tailwind/react";
import { useAppContext } from "../AppContext/AppContext";
import { HomeIcon, UserIcon, BellIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const { currentUser, userData } = useAppContext();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">Orbit</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
              <HomeIcon className="h-6 w-6" />
            </Link>
            <Link to="/messages" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
              <ChatBubbleLeftIcon className="h-6 w-6" />
            </Link>
            <Link to="/notifications" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
              <BellIcon className="h-6 w-6" />
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
              <UserIcon className="h-6 w-6" />
            </Link>
            <Link to="/profile">
              <Avatar
                size="sm"
                variant="circular"
                src={userData?.profilePictureUrl || currentUser?.photoURL}
                alt="avatar"
                className="cursor-pointer"
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
