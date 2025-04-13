import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext/AppContext";
import Main from "../Main/Main";

const Home = () => {
  const { userData } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - 20% width */}
          <div className="w-1/5">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={userData?.profilePictureUrl || 'https://via.placeholder.com/100'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full"
                />
                <div className="text-center">
                  <h2 className="font-semibold">{userData?.userName}</h2>
                  <p className="text-gray-600">@{userData?.userTag}</p>
                </div>
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Followers</span>
                    <span className="font-medium">{userData?.followers || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Following</span>
                    <span className="font-medium">{userData?.following || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Content - 60% width */}
          <div className="w-3/5">
            <Main />
          </div>

          {/* Right Sidebar - 20% width */}
          <div className="w-1/5">
            <div className="bg-white rounded-lg shadow p-4 space-y-4">
              <h3 className="font-semibold">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                  >
                    Profile
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                    Saved Posts
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                    Settings
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
