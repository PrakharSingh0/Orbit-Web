import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
  Badge,
} from "@material-tailwind/react";
import {
  HomeIcon,
  UserIcon,
  BellIcon,
  ChatBubbleLeftIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAppContext } from "../AppContext/AppContext";

const Navbar = () => {
  const { currentUser, userData, signOutUser } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate notifications for demo purposes
    if (currentUser) {
      setNotifications([
        { id: 1, text: "John liked your post", read: false, time: "2m ago" },
        { id: 2, text: "Sarah commented on your photo", read: false, time: "1h ago" },
        { id: 3, text: "New follower: TechGuru", read: true, time: "3h ago" },
      ]);
      setUnreadCount(2);
    }
  }, [currentUser]);

  const handleAuth = () => {
    if (currentUser) {
      signOutUser();
    } else {
      navigate("/login");
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900 shadow-lg z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://res.cloudinary.com/dnsjdvzdn/image/upload/v1744052185/Screenshot_2025-03-13_114708-removebg-preview-Picsart-AiImageEnhancer_tkitlm.png"
              alt="logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex flex-col items-center ${
                isActive("/") ? "text-green-500" : "text-gray-400 hover:text-green-400"
              }`}
            >
              <HomeIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link 
              to="/messages" 
              className={`flex flex-col items-center ${
                isActive("/messages") ? "text-green-500" : "text-gray-400 hover:text-green-400"
              }`}
            >
              <ChatBubbleLeftIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Messages</span>
            </Link>
            <Link 
              to="/notifications" 
              className={`flex flex-col items-center ${
                isActive("/notifications") ? "text-green-500" : "text-gray-400 hover:text-green-400"
              }`}
            >
              <div className="relative">
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">Notifications</span>
            </Link>

            {currentUser ? (
              <Menu placement="bottom-end">
                <MenuHandler>
                  <Avatar
                    size="sm"
                    variant="circular"
                    src={userData?.profilePictureUrl || currentUser?.photoURL}
                    alt="avatar"
                    className="cursor-pointer border-2 border-green-500"
                  />
                </MenuHandler>
                <MenuList className="bg-gray-800 border border-gray-700">
                  <MenuItem 
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 text-gray-300 hover:bg-gray-700"
                  >
                    <UserIcon className="h-5 w-5" />
                    Profile
                  </MenuItem>
                  <MenuItem 
                    onClick={() => navigate("/settings")}
                    className="flex items-center gap-2 text-gray-300 hover:bg-gray-700"
                  >
                    <Cog6ToothIcon className="h-5 w-5" />
                    Settings
                  </MenuItem>
                  <hr className="border-gray-700 my-2" />
                  <MenuItem 
                    onClick={handleAuth}
                    className="flex items-center gap-2 text-red-400 hover:bg-gray-700"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button 
                size="sm" 
                onClick={handleAuth} 
                color="green"
                className="rounded-full"
              >
                Sign In
              </Button>
            )}
          </div>

          <div className="md:hidden">
            <IconButton 
              variant="text" 
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-400 hover:text-white"
            >
              {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </IconButton>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-3 py-3 border-t border-gray-800">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                isActive("/") ? "bg-gray-800 text-green-500" : "text-gray-300 hover:bg-gray-800"
              }`} 
              onClick={() => setMenuOpen(false)}
            >
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link 
              to="/messages" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                isActive("/messages") ? "bg-gray-800 text-green-500" : "text-gray-300 hover:bg-gray-800"
              }`} 
              onClick={() => setMenuOpen(false)}
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span>Messages</span>
            </Link>
            <Link 
              to="/notifications" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                isActive("/notifications") ? "bg-gray-800 text-green-500" : "text-gray-300 hover:bg-gray-800"
              }`} 
              onClick={() => setMenuOpen(false)}
            >
              <div className="relative">
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span>Notifications</span>
            </Link>
            {currentUser ? (
              <>
                <Link 
                  to="/profile" 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    isActive("/profile") ? "bg-gray-800 text-green-500" : "text-gray-300 hover:bg-gray-800"
                  }`} 
                  onClick={() => setMenuOpen(false)}
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <Link 
                  to="/settings" 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    isActive("/settings") ? "bg-gray-800 text-green-500" : "text-gray-300 hover:bg-gray-800"
                  }`} 
                  onClick={() => setMenuOpen(false)}
                >
                  <Cog6ToothIcon className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
                <button 
                  onClick={() => {
                    handleAuth();
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-400 hover:bg-gray-800"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  handleAuth();
                  setMenuOpen(false);
                }}
                className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
