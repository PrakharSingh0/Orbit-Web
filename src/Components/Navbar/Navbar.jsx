import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext/AppContext';

const HomeIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const CompassIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const MailIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const BellIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const NavLink = ({ to, icon, label }) => (
  <Link 
    to={to} 
    className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors group"
  >
    <div className="p-1.5 rounded-lg group-hover:bg-indigo-50 transition-all">
      {icon}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

const Navbar = () => {
  const { currentUser, signOutUser } = useAppContext();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const notifications = [
    { id: 1, message: 'John Doe liked your post', time: '2m ago', read: false },
    { id: 2, message: 'New connection request from Jane Smith', time: '5m ago', read: false },
    { id: 3, message: 'Your post has 10 new comments', time: '1h ago', read: true },
    { id: 4, message: 'Alice Johnson shared your post', time: '3h ago', read: false },
    { id: 5, message: 'New job opportunity at Tech Corp', time: '1d ago', read: true },
  ];

  const messages = [
    { id: 1, sender: 'John Doe', message: 'Hey, how are you doing?', time: '2m ago', unread: true },
    { id: 2, sender: 'Jane Smith', message: 'Can we discuss the project tomorrow?', time: '5m ago', unread: true },
    { id: 3, sender: 'Mike Johnson', message: 'Thanks for the help!', time: '1h ago', unread: false },
    { id: 4, sender: 'Sarah Wilson', message: 'Meeting at 3 PM?', time: '3h ago', unread: false },
    { id: 5, sender: 'David Brown', message: 'Please check the document', time: '1d ago', unread: true },
  ];

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCreatePost = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate('/create-post');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a] text-[#67e8f9] backdrop-blur-md border-b border-gray-100 shadow-sm ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="https://res.cloudinary.com/dnsjdvzdn/image/upload/v1744052185/Screenshot_2025-03-13_114708-removebg-preview-Picsart-AiImageEnhancer_tkitlm.png" 
              alt="Orbit Logo"
              className="h-12 w-auto"
            />
          </Link>
          <div className="hidden md:flex items-center space-x-8 text-[#67e8f9]">
            <NavLink to="/" icon={<HomeIcon />} label="Home" />
           
            <div className="relative">
              <Link 
                to="/messages"
                className="flex items-center space-x-2  hover:text-indigo-600 transition-colors group"
              >
                <div className="p-1.5 rounded-lg group-hover:bg-indigo-50 transition-all">
                  <MailIcon />
                </div>
                <span className="text-sm font-medium">Messages</span>
                {messages.some(m => m.unread) && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-gray-100  hover:text-indigo-600 transition-all relative"
              >
                <BellIcon />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
                <span className="sr-only">Notifications</span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80  rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-medium ">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-indigo-50' : ''}`}
                        >
                          <p className="text-sm ">{notification.message}</p>
                          <p className="text-xs  mt-1">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        No new notifications
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {currentUser ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 focus:outline-none">
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center ">
                      <UserIcon />
                    </div>
                  )}
                  <span className="hidden md:inline-block text-sm font-medium  group-hover:text-indigo-600">
                    {currentUser.displayName || "Profile"}
                  </span>
                </button>

                <div className="absolute right-0 mt-2 w-48  rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link to={`/profile/${currentUser.uid}`} className="block px-4 py-2 text-sm  hover:bg-indigo-50 hover:text-indigo-600">
                    Your Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm t hover:bg-indigo-50 hover:text-indigo-600">
                    Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm  hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium  hover:text-indigo-600">
                Sign In
              </Link>
            )}
            
            <button 
              onClick={handleCreatePost}
              className="hidden md:block bg-gradient-to-r from-indigo-600 to-purple-600  px-4 py-1.5 rounded-full text-sm font-medium hover:shadow-md transition-all"
            >
              Create Post
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
