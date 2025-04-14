import React, { useState, useEffect } from "react";
import { Avatar, Button } from "@material-tailwind/react";
import { collection, query, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore";
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
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(user => user.uid !== currentUser?.uid); // Exclude current user

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
      // Update current user's following list
      const currentUserRef = doc(db, "users", userData.id);
      await updateDoc(currentUserRef, {
        following: arrayUnion({
          id: userId,
          name: userName,
          userTag: userTag,
          profilePictureUrl: profilePictureUrl
        })
      });

      // Update the followed user's followers list
      const followedUserRef = doc(db, "users", userId);
      await updateDoc(followedUserRef, {
        followers: arrayUnion({
          id: currentUser.uid,
          name: userData.userName,
          userTag: userData.userTag,
          profilePictureUrl: userData.profilePictureUrl
        })
      });

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, isFollowing: true }
            : user
        )
      );
    } catch (error) {
      console.error("Error following user:", error);
      setError("Failed to follow user");
    }
  };

  if (loading) {
    return <div className="p-4">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-4 mb-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Suggested Users</h2>
      <div className="flex overflow-x-auto space-x-4 pb-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex-shrink-0 w-48 bg-gray-50 rounded-xl p-4 flex flex-col items-center"
          >
            <Avatar
              src={user.profilePictureUrl || avatar}
              alt={user.userName}
              size="lg"
              variant="circular"
              className="mb-3"
            />
            <h3 className="font-medium text-gray-900 text-center">{user.userName}</h3>
            <p className="text-sm text-gray-500 mb-3">@{user.userTag}</p>
            <Button
              size="sm"
              variant="outlined"
              className="rounded-full"
              onClick={() => handleFollow(
                user.id,
                user.userName,
                user.userTag,
                user.profilePictureUrl
              )}
            >
              Follow
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCards; 