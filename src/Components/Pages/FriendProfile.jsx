import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, onSnapshot, setDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { AuthContext } from "../AppContext/AppContext";
import Navbar from "../Navbar/Navbar";
import LeftSide from "../LeftSidebar/LeftSide";
import RightSide from "../RightSidebar/RightSide";
import Main from "../Main/Main";
import { Avatar } from "@material-tailwind/react";
import profilePic from "../../assets/images/profilePic.jpg";
import avatar from "../../assets/images/avatar.jpg";

const FriendProfile = () => {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    const getUserProfile = async () => {
      const q = query(collection(db, "users"), where("uid", "==", id));
      onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          setProfile(snapshot.docs[0].data());
        }
      });
    };
    getUserProfile();
  }, [id]);

  useEffect(() => {
    const checkFollowing = async () => {
      if (!currentUser) return;
      const docRef = doc(db, `users/${currentUser.uid}/following`, id);
      const snap = await getDocs(collection(db, `users/${id}/followers`));
      setFollowerCount(snap.size);
      snap.forEach((doc) => {
        if (doc.id === currentUser.uid) {
          setIsFollowing(true);
        }
      });
    };
    checkFollowing();
  }, [id, currentUser]);

  const handleFollow = async () => {
    await setDoc(doc(db, `users/${id}/followers`, currentUser.uid), {
      followedAt: Date.now(),
    });
    await setDoc(doc(db, `users/${currentUser.uid}/following`, id), {
      followedAt: Date.now(),
    });
    setIsFollowing(true);
    setFollowerCount((prev) => prev + 1);
  };

  const handleUnfollow = async () => {
    await deleteDoc(doc(db, `users/${id}/followers`, currentUser.uid));
    await deleteDoc(doc(db, `users/${currentUser.uid}/following`, id));
    setIsFollowing(false);
    setFollowerCount((prev) => prev - 1);
  };

  return (
    <div className="w-full">
      <div className="fixed top-0 z-10 w-full bg-white">
        <Navbar />
      </div>
      <div className="flex bg-gray-100">
        <div className="flex-auto w-[20%] fixed top-12">
          <LeftSide />
        </div>
        <div className="flex-auto w-[60%] absolute left-[20%] top-14 bg-gray-100 rounded-xl">
          <div className="w-[80%] mx-auto">
            <div className="relative py-4">
              <img
                className="h-96 w-full rounded-md"
                src={profilePic}
                alt="profilePic"
              />
              <div className="absolute bottom-10 left-6">
                <Avatar
                  size="xl"
                  variant="circular"
                  src={profile?.image || avatar}
                  alt="avatar"
                />
                <p className="py-2 text-white font-semibold text-lg">
                  {profile?.name}
                </p>
                <p className="text-white text-sm">{profile?.email}</p>
              </div>
              <div className="absolute bottom-10 right-6 flex flex-col items-end">
                <p className="text-white font-semibold text-lg">
                  Followers: {followerCount}
                </p>
                {currentUser?.uid !== id && (
                  <button
                    className={`mt-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      isFollowing
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
              </div>
            </div>
            <Main />
          </div>
        </div>
        <div className="flex-auto w-[20%] fixed right-0 top-12">
          <RightSide />
        </div>
      </div>
    </div>
  );
};

export default FriendProfile;
