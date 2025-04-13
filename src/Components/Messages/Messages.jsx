import React, { useState } from 'react';
import { Avatar } from '@material-tailwind/react';
import avatar from '../../assets/images/avatar.jpg';
import { Link } from 'react-router-dom';

const Messages = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  const messages = [
    { 
      id: 1, 
      sender: 'Rahul Sharma',
      senderImage: avatar,
      message: 'Hey, how are you doing?', 
      time: '2m ago', 
      unread: true,
      conversation: [
        { sender: 'Rahul Sharma', message: 'Hey there!', time: '2m ago' },
        { sender: 'You', message: 'Hi! I\'m good, thanks!', time: '1m ago' },
        { sender: 'Rahul Sharma', message: 'Great to hear!', time: 'Just now' }
      ]
    },
    { 
      id: 2, 
      sender: 'Priya Patel',
      senderImage: avatar,
      message: 'Can we discuss the project tomorrow?', 
      time: '5m ago', 
      unread: true,
      conversation: [
        { sender: 'Priya Patel', message: 'Hi, are you free tomorrow?', time: '5m ago' },
        { sender: 'You', message: 'Yes, what time works for you?', time: '4m ago' },
        { sender: 'Priya Patel', message: 'How about 2 PM?', time: '3m ago' }
      ]
    },
    { 
      id: 3, 
      sender: 'Arjun Singh',
      senderImage: avatar,
      message: 'Thanks for the help!', 
      time: '1h ago', 
      unread: false,
      conversation: [
        { sender: 'Arjun Singh', message: 'Thanks for helping me out!', time: '1h ago' },
        { sender: 'You', message: 'No problem!', time: '55m ago' }
      ]
    },
    { 
      id: 4, 
      sender: 'Ananya Gupta',
      senderImage: avatar,
      message: 'Meeting at 3 PM?', 
      time: '3h ago', 
      unread: false,
      conversation: [
        { sender: 'Ananya Gupta', message: 'Can we meet at 3 PM?', time: '3h ago' },
        { sender: 'You', message: 'Sure, that works for me', time: '2h ago' }
      ]
    },
    { 
      id: 5, 
      sender: 'Vikram Reddy',
      senderImage: avatar,
      message: 'Please check the document', 
      time: '1d ago', 
      unread: true,
      conversation: [
        { sender: 'Vikram Reddy', message: 'I sent you the document', time: '1d ago' },
        { sender: 'You', message: 'I\'ll check it out', time: '23h ago' }
      ]
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Messages List */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
          <Link 
            to="/"
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center space-x-1"
          >
            <svg 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedMessage?.id === msg.id ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <Avatar
                  size="sm"
                  variant="circular"
                  src={msg.senderImage}
                  alt={msg.sender}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900">{msg.sender}</p>
                    <p className="text-xs text-gray-500">{msg.time}</p>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{msg.message}</p>
                </div>
                {msg.unread && (
                  <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation View */}
      <div className="flex-1 flex flex-col">
        {selectedMessage ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <Avatar
                  size="sm"
                  variant="circular"
                  src={selectedMessage.senderImage}
                  alt={selectedMessage.sender}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedMessage.sender}</p>
                  <p className="text-xs text-gray-500">Active now</p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedMessage.conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-lg p-3 ${
                      msg.sender === 'You'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs mt-1 opacity-75">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages; 