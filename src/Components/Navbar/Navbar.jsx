import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import {
  HomeIcon,
  UserIcon,
  BellIcon,
  ChatBubbleLeftIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAppContext } from "../AppContext/AppContext";

const Navbar = () => {
  const { currentUser, userData, signOutUser } = useAppContext();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAuth = () => {
    if (currentUser) {
      signOutUser();
    } else {
      navigate("/signin");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://res.cloudinary.com/dnsjdvzdn/image/upload/v1744052185/Screenshot_2025-03-13_114708-removebg-preview-Picsart-AiImageEnhancer_tkitlm.png"
              alt="logo"
              className="h-12 w-15 object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              <HomeIcon className="h-6 w-6" />
            </Link>
            <Link to="/messages" className="text-gray-700 hover:text-blue-600">
              <ChatBubbleLeftIcon className="h-6 w-6" />
            </Link>
            <Link to="/notifications" className="text-gray-700 hover:text-blue-600">
              <BellIcon className="h-6 w-6" />
            </Link>

            {currentUser ? (
              <Menu placement="bottom-end">
                <MenuHandler>
                  <Avatar
                    size="sm"
                    variant="circular"
                    src={userData?.profilePictureUrl || currentUser?.photoURL}
                    alt="avatar"
                    className="cursor-pointer"
                  />
                </MenuHandler>
                <MenuList>
                  <MenuItem onClick={() => navigate("/profile")}>
                    <UserIcon className="h-5 w-5 mr-2" />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleAuth}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button size="sm" onClick={handleAuth} color="blue">
                Sign In
              </Button>
            )}
          </div>

          <div className="md:hidden">
            <IconButton variant="text" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </IconButton>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-3 mt-2">
            <Link to="/" className="text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/messages" className="text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
              Messages
            </Link>
            <Link to="/notifications" className="text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
              Notifications
            </Link>
            {currentUser ? (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <Button size="sm" onClick={handleAuth} color="red">
                  Sign Out
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={handleAuth} color="blue">
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
