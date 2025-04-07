import React, { useState } from 'react';

const Notification = () => {
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

  const [showNotifications, setShowNotifications] = useState(false);

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
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <span className="text-2xl">🔔</span>
        {notifications.some(n => !n.read) && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

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
  );
};

export default Notification; 