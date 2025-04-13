import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext/AppContext";
import Main from "../Main/Main";

const Home = () => {
  const { userData } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <div className="w-1/5 hidden xl:block">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-4 space-y-6">

              <div className="flex flex-col items-center space-y-3">
                <img
                  src={userData?.profilePictureUrl || 'https://via.placeholder.com/100'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-green-500 shadow-md"
                />
                <div className="text-center">
                  <h2 className="text-lg font-semibold">{userData?.userName || "User Name"}</h2>
                  <p className="text-green-400 text-sm">@{userData?.userTag || "user.tag"}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {userData?.bio || "A passionate coder. Explorer of ideas. Building the future."}
                  </p>
                </div>
              </div>
              <div className="text-sm space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Followers</span>
                  <span className="font-bold text-green-400">{userData?.followers || 4}</span>
                </div>
                <div className="flex justify-between">
                  <span>Following</span>
                  <span className="font-bold text-green-400">{userData?.following || 3}</span>
                </div>
                <div className="flex justify-between">
                  <span>Posts</span>
                  <span className="font-bold text-green-400">{userData?.posts || 5}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full bg-green-500 text-black py-2 rounded-xl font-medium hover:bg-green-400 transition"
                >
                  View Profile
                </button>
                <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl font-medium">
                  🔔 Notifications
                </button>
              </div>
            </div>
          </div>
          <div className="w-full xl:w-3/5">
            <Main />
          </div>
          <div className="w-1/5 hidden xl:block space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-green-400">People to Follow</h3>
              {["DevWizard", "CodeNerd", "UXQueen"].map((user, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-white">@{user}</p>
                    <p className="text-gray-400 text-xs">Follows you</p>
                  </div>
                  <button className="bg-green-600 hover:bg-green-500 text-black px-3 py-1 rounded-xl text-xs font-semibold">
                    Follow
                  </button>
                </div>
              ))}
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-4">
              <h3 className="text-lg font-semibold text-green-400 mb-4">🔥 Trending</h3>
              <ul className="space-y-2 text-sm">
                <li>#100DaysOfCode</li>
                <li>#ReactMagic</li>
                <li>#AIeverywhere</li>
                <li>#FirebaseHackers</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
