import React, { useContext, useEffect, useState } from "react";
import { Avatar, Tooltip, Button } from "@material-tailwind/react";
import { AuthContext } from "../AppContext/AppContext";
import { Link } from "react-router-dom";
import {
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
} from "react-icons/hi";
import {
  FiUsers,
  FiPlusCircle,
  FiMoreHorizontal,
  FiFacebook,
  FiTwitter,
} from "react-icons/fi";
import { doc, getDoc, setDoc, deleteDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

const LeftSide = () => {
  const { currentUser, userData } = useContext(AuthContext);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const uid = currentUser?.uid || userData?.uid;

  useEffect(() => {
    if (!uid) return;

    const unsubFollowers = onSnapshot(collection(db, `users/${uid}/followers`), (snap) => {
      setFollowers(snap.docs.map(doc => doc.id));
    });

    const unsubFollowing = onSnapshot(collection(db, `users/${uid}/following`), (snap) => {
      setFollowing(snap.docs.map(doc => doc.id));
    });

    return () => {
      unsubFollowers();
      unsubFollowing();
    };
  }, [uid]);

  useEffect(() => {
    if (!uid) return;

    const checkFollow = async () => {
      const ref = doc(db, `users/${uid}/followers`, uid);
      const snap = await getDoc(ref);
      setIsFollowing(snap.exists());
    };

    checkFollow();
  }, [uid]);

  const handleFollowToggle = async () => {
    const followerRef = doc(db, `users/${uid}/followers`, uid);
    const followingRef = doc(db, `users/${uid}/following`, uid);

    if (isFollowing) {
      await deleteDoc(followerRef);
      await deleteDoc(followingRef);
      setIsFollowing(false);
    } else {
      await setDoc(followerRef, { followedAt: Date.now() });
      await setDoc(followingRef, { followedAt: Date.now() });
      setIsFollowing(true);
    }
  };

  return (
    <div className="hidden lg:flex flex-col h-screen sticky top-0 bg-[#0f172a] border-gray-100 shadow-md p-4 overflow-y-auto text-white border-2 border-[#bbf7d0]">

      <div className="relative mb-8">
        <div className="h-24 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500"></div>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <Tooltip content="Go to Profile">
            <Link to="/userprofile">
              <Avatar
                size="xl"
                src={currentUser?.photoURL || "https://source.unsplash.com/200x200?person"}
                alt="profile"
                className="border-4 border-white shadow-lg"
              />
            </Link>
          </Tooltip>
        </div>
      </div>


      <div className="text-center mt-12 mb-6">
        <h3 className="text-lg font-semibold text-white   ">
          {currentUser?.displayName || userData?.name || "Username"}
        </h3>
        <p className="text-gray-500 text-sm">
          {currentUser?.email || userData?.email}
        </p>
        <Button
          onClick={handleFollowToggle}
          className={`mt-4 rounded-full text-xs px-4 py-1.5 ${
            isFollowing ? "bg-red-500" : "bg-blue-500"
          } text-white shadow-md`}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      </div>

      <div className="flex justify-between mb-6 px-4 text-center">
        <div>
          <p className="text-md font-bold text-white   ">{followers.length}</p>
          <p className="text-xs text-gray-500">Followers</p>
        </div>
        <div>
          <p className="text-md font-bold text-white   ">{following.length}</p>
          <p className="text-xs text-gray-500">Following</p>
        </div>
        <div>
          <p className="text-md font-bold text-white   ">24</p>
          <p className="text-xs text-white   ">Posts</p>
        </div>
      </div>

      <div className="space-y-4 mb-8 px-2">
        <div className="flex items-center text-sm text-white   ">
          <HiOutlineLocationMarker className="mr-3 text-lg text-blue-500" />
          <span>San Francisco, CA</span>
        </div>
        <div className="flex items-center text-sm text-white   ">
          <HiOutlineBriefcase className="mr-3 text-lg text-purple-500" />
          <span>Frontend Developer</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-8 px-2">
        <button className="flex items-center justify-center py-2 bg-[#0f172a] hover:bg-gray-200 transition-colors">
          <FiUsers className="mr-2" />
          <span>Groups</span>
        </button>
        <button className="flex items-center justify-center py-2 bg-[#0f172a] hover:bg-gray-200 transition-colors">
          <FiPlusCircle className="mr-2" />
          <span>Invite</span>
        </button>
        <button className="col-span-2 flex items-center justify-center py-2 bg-[#0f172a] hover:bg-gray-200 transition-colors">
          <FiMoreHorizontal className="mr-2" />
          <span>More</span>
        </button>
      </div>

      <div className="px-2">
        <h4 className="font-semibold text-white    mb-3">Social Profiles</h4>
        <div className="space-y-3">
          <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition">
            <FiFacebook className="text-blue-600 mr-3" />
            <span>Facebook</span>
          </a>
          <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition">
            <FiTwitter className="text-blue-400 mr-3" />
            <span>Twitter</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LeftSide;
