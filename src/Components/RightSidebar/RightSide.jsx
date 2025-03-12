import React, { useState, useContext } from "react";
import waterslide from "../../assets/images/waterslide.jpg";
import { AuthContext } from "../AppContext/AppContext";
import { Link } from "react-router-dom";
import { Avatar } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.jpg";
import remove from "../../assets/images/delete.png";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const RightSide = () => {
  const [input, setInput] = useState("");
  const { user, userData } = useContext(AuthContext);
  const friendList = userData?.friends || [];

  const searchFriends = (data) =>
    data.filter((item) =>
      item.name.toLowerCase().includes(input.toLowerCase())
    );

  const removeFriend = async (id, name, image) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const getDoc = await getDocs(q);
      const userDocumentId = getDoc.docs[0].id;

      await updateDoc(doc(db, "users", userDocumentId), {
        friends: arrayRemove({ id, name, image }),
      });
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white shadow-lg border-2 rounded-l-xl">
      <div className="flex flex-col items-center relative pt-10">
        <img className="h-48 rounded-md" src={waterslide} alt="nature" />
      </div>

      <p className="text-sm text-gray-700 mx-4 mt-2 leading-tight">
        Through photography, the beauty of Mother Nature can be frozen in time.
        This category celebrates the magic of our planet and beyond — from the
        immensity of the great outdoors to miraculous moments in your own
        backyard.
      </p>

      <div className="mx-4 mt-6">
        <p className="text-sm font-medium text-gray-700">Friends:</p>

        <input
          className="w-full border-b-2 outline-none mt-3 py-1"
          name="input"
          value={input}
          type="text"
          placeholder="Search friends..."
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="mt-4">
          {friendList.length > 0 ? (
            searchFriends(friendList).map((friend) => (
              <div
                className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-gray-100 transition-all duration-300"
                key={friend.id}
              >
                <Link to={`/profile/${friend.id}`} className="flex items-center">
                  <Avatar
                    size="sm"
                    variant="circular"
                    src={friend?.image || avatar}
                    alt="avatar"
                  />
                  <p className="ml-4 text-sm font-medium text-gray-700">
                    {friend.name}
                  </p>
                </Link>
                <button
                  onClick={() => removeFriend(friend.id, friend.name, friend.image)}
                  className="p-2 rounded-full hover:bg-gray-200 transition-all"
                >
                  <img className="h-4 w-4" src={remove} alt="deleteFriend" />
                </button>
              </div>
            ))
          ) : (
            <p className="mt-6 text-sm text-gray-500">
              Add friends to check their profile.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSide;
