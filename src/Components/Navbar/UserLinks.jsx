import React, { useContext, useState } from "react";
import { Tooltip } from "@material-tailwind/react";
import { Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.jpg";
import { AuthContext } from "../AppContext/AppContext";
import { Link } from "react-router-dom";

const UserLinks = () => {
  const { signOutUser, user, userData } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      type: 'like',
      message: 'John liked your post',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'comment',
      message: 'Sarah commented on your photo',
      time: '15 minutes ago',
      read: false
    },
    {
      id: 3,
      type: 'follow',
      message: 'Mike started following you',
      time: '1 hour ago',
      read: true
    },
    {
      id: 4,
      type: 'mention',
      message: 'You were mentioned in a comment by Alex',
      time: '3 hours ago',
      read: true
    },
    {
      id: 5,
      type: 'share',
      message: 'Emma shared your post',
      time: '5 hours ago',
      read: false
    }
  ]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      case 'mention':
        return '📢';
      case 'share':
        return '🔄';
      default:
        return '🔔';
    }
  };

  return (
    <div className="flex justify-center items-center cursor-pointer">
      <div className="hover:translate-y-1 duration-500 ease-in-out hover:text-blue-500">
        <Link to="/userprofile" className="hover:translate-y-1 duration-500 ease-in-out hover:text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </Link>
      </div>
      <div className="hover:translate-y-1 duration-500 ease-in-out hover:text-blue-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 mx-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
          />
        </svg>
      </div>
      <div className="relative hover:translate-y-1 duration-500 ease-in-out hover:text-blue-500">
        <div onClick={() => setShowNotifications(!showNotifications)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
          {notifications.some(n => !n.read) && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </div>
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <button className="text-sm text-blue-500 hover:text-blue-600">
                Mark all as read
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mx-4 flex items-center">
        <Tooltip content="Profile" placement="bottom">
          <Link to="/userprofile">
            <Avatar
              src={user?.photoURL || avatar}
              size="sm"
              alt="avatar"
              className="cursor-pointer"
            ></Avatar>
          </Link>
        </Tooltip>
        <div className="flex items-center" onClick={signOutUser}>
          <p className="ml-4 font-roboto text-sm text-black font-medium no-underline cursor-pointer">
            {user?.displayName === null && userData?.name !== undefined
              ? userData?.name?.charAt(0)?.toUpperCase() +
                userData?.name?.slice(1)
              : user?.displayName?.split(" ")[0]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLinks;
