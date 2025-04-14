import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Button } from "@material-tailwind/react";
import { useAppContext } from "../AppContext/AppContext";
import {
  HomeIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const Navbar = () => {
  const { currentUser, userData } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Orbit
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <HomeIcon className="h-6 w-6" />
            </Link>
            <Link
              to="/messages"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ChatBubbleLeftIcon className="h-6 w-6" />
            </Link>
            <Link
              to="/notifications"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <BellIcon className="h-6 w-6" />
            </Link>
            <Link
              to="/profile"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <UserIcon className="h-6 w-6" />
            </Link>
            <Button
              variant="text"
              size="sm"
              className="text-gray-600 hover:text-blue-600"
              onClick={handleLogout}
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
            </Button>
            <Link to="/profile">
              <Avatar
                src={userData?.profilePictureUrl || currentUser?.photoURL}
                alt="profile"
                size="sm"
                variant="circular"
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
