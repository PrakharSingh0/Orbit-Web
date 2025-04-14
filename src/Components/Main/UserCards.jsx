import React, { useState, useEffect } from "react";
import { Avatar, Button } from "@material-tailwind/react";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAppContext } from "../AppContext/AppContext";
import avatar from "../../assets/images/avatar.jpg";

const UserCards = () => {
  const { currentUser, userData } = useAppContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef);
        const querySnapshot = await getDocs(q);

        const usersData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((user) => user.uid !== currentUser?.uid);

        setUsers(usersData);
        setError("");
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const handleFollow = async (userId, userName, userTag, profilePictureUrl) => {
    if (!currentUser) return;

    try {
      const currentUserRef = doc(db, "users", userData.id);
      await updateDoc(currentUserRef, {
        following: arrayUnion({
          id: userId,
          name: userName,
          userTag: userTag,
          profilePictureUrl: profilePictureUrl,
        }),
      });
      const followedUserRef = doc(db, "users", userId);
      await updateDoc(followedUserRef, {
        followers: arrayUnion({
          id: currentUser.uid,
          name: userData.userName,
          userTag: userData.userTag,
          profilePictureUrl: userData.profilePictureUrl,
        }),
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isFollowing: true } : user
        )
      );
    } catch (error) {
      console.error("Error following user:", error);
      setError("Failed to follow user");
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-300">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-900 rounded-3xl shadow-2xl p-6 mb-6">
      <h2 className="text-xl font-semibold text-white mb-4">Suggested Users</h2>
      <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex-shrink-0 w-56 bg-gray-800 rounded-2xl shadow-lg p-5 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-xl duration-300"
          >
            <Avatar
              src={user.profilePictureUrl || avatar}
              alt={user.userName}
              size="xl"
              variant="circular"
              className="mb-3 border-4 border-gray-700 shadow-md"
            />
            <h3 className="font-semibold text-white text-center">{user.userName}</h3>
            <p className="text-sm text-gray-400 mb-4">@{user.userTag}</p>
            <Button
              size="sm"
              variant="outlined"
              className="rounded-full border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white transition-all duration-200"
              onClick={() =>
                handleFollow(
                  user.id,
                  user.userName,
                  user.userTag,
                  user.profilePictureUrl
                )
              }
              disabled={user.isFollowing}
            >
              {user.isFollowing ? "Following" : "Follow"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCards;
