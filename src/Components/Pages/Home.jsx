import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContext/AppContext";
import Main from "../Main/Main";

const Home = () => {
  const { userData } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 text-sm">Loading feed...</p>
        </div>
      </div>
    );
  }

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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-4">
  <h3 className="text-lg font-semibold text-green-400 mb-4">Trending Now</h3>
  <ul className="space-y-4 text-sm text-gray-300">
    <li>
      <p className="font-semibold text-white">#DeepSeekAI</p>
      <p className="text-xs text-gray-400">China’s DeepSeek sets new benchmark in open-source LLMs</p>
    </li>
    <li>
      <p className="font-semibold text-white">#WorldWarBuzz</p>
      <p className="text-xs text-gray-400">Global tensions rise as military drills expand in Asia-Pacific</p>
    </li>
    <li>
      <p className="font-semibold text-white">#ChinaSuperpower</p>
      <p className="text-xs text-gray-400">China edges closer to global dominance in tech and economy</p>
    </li>
    <li>
      <p className="font-semibold text-white">#TrumpTariffs</p>
      <p className="text-xs text-gray-400">Trump hints at bringing back aggressive tariffs in 2025 race</p>
    </li>
    <li>
      <p className="font-semibold text-white">#AIinGovernance</p>
      <p className="text-xs text-gray-400">AI-powered policy-making: Innovation or invasion?</p>
    </li>
  </ul>
</div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-4">
              <h3 className="text-lg font-semibold text-green-400 mb-4">Recent Discussions</h3>
              <ul className="space-y-4 text-sm text-gray-300">
                <li>
                  <p className="font-semibold text-white">#AIRevolution</p>
                  <p className="text-xs text-gray-400">Join the debate on AI's impact on jobs and society.</p>
                </li>
                <li>
                  <p className="font-semibold text-white">#ClimateChange</p>
                  <p className="text-xs text-gray-400">Discuss the latest climate policies and their implications.</p>
                </li>
                <li>
                  <p className="font-semibold text-white">#TechForGood</p>
                  <p className="text-xs text-gray-400">Explore how technology can solve global challenges.</p>
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
