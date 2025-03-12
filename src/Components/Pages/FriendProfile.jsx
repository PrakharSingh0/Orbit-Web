import React, { useState, useEffect } from "react";
import { Avatar } from "@material-tailwind/react";
import { collection, where, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useParams } from "react-router-dom";
import LeftSide from "../LeftSidebar/LeftSide";
import Navbar from "../Navbar/Navbar";
import RightSide from "../RightSidebar/RightSide";
import Main from "../Main/Main";
import profilePic from "../../assets/images/profilePic.jpg";
import avatar from "../../assets/images/avatar.jpg";

const FriendProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getUserProfile = async () => {
      const q = query(collection(db, "users"), where("uid", "==", id));
      await onSnapshot(q, (doc) => {
        setProfile(doc.docs[0]?.data());
      });
    };
    getUserProfile();
  }, [id]);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex pt-16">
        <LeftSide />

        <main className="flex-1 mx-8">
          <div className="relative rounded-lg overflow-hidden shadow-xl">
            <img
              src={profilePic}
              alt="cover"
              className="w-full h-80 object-cover"
            />

            <div className="absolute bottom-6 left-6 flex items-center gap-4">
              <Avatar
                size="xxl"
                variant="circular"
                src={profile?.image || avatar}
                alt="avatar"
                className="border-4 border-white shadow-md"
              />
              <div className="text-white">
                <h1 className="text-2xl font-bold">{profile?.name || "Unknown"}</h1>
                <p className="text-sm">{profile?.email || "No email"}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p><strong>Location:</strong> Tokyo, Japan</p>
              <p><strong>Hometown:</strong> Mathura</p>
            </div>

            <Main />
          </div>
        </main>

        <RightSide />
      </div>
    </div>
  );
};

export default FriendProfile;