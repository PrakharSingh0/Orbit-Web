import React, { useState, useEffect } from "react";
import { Avatar, Button, Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import { useAppContext } from "../AppContext/AppContext";
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { updateProfile } from "firebase/auth";
import PostCard from "../Main/PostCard";
import { PhotoIcon, UserIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser, userData } = useAppContext();
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleProfileUpdate = async (newProfilePic) => {
    try {
      setLoading(true);
      setError("");

      // Update auth profile
      await updateProfile(auth.currentUser, {
        photoURL: newProfilePic
      });

      // Update user document
      const q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "users", userDoc.id), {
          profilePictureUrl: newProfilePic
        });
      }

      // Update all posts
      const postsQuery = query(
        collection(db, "posts"),
        where("uid", "==", currentUser.uid)
      );
      const postsSnapshot = await getDocs(postsQuery);
      
      const updatePromises = postsSnapshot.docs.map(postDoc => 
        updateDoc(doc(db, "posts", postDoc.id), {
          profilePictureUrl: newProfilePic
        })
      );
      
      await Promise.all(updatePromises);

      // Update all comments
      const commentsPromises = postsSnapshot.docs.map(async postDoc => {
        const commentsQuery = query(
          collection(db, "posts", postDoc.id, "comments"),
          where("uid", "==", currentUser.uid)
        );
        const commentsSnapshot = await getDocs(commentsQuery);
        
        return Promise.all(commentsSnapshot.docs.map(commentDoc =>
          updateDoc(doc(db, "posts", postDoc.id, "comments", commentDoc.id), {
            profilePictureUrl: newProfilePic
          })
        ));
      });
      
      await Promise.all(commentsPromises);

    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const q = query(
          collection(db, "posts"),
          where("uid", "==", currentUser?.uid),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((doc) => ({
          postId: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchSavedPosts = async () => {
      try {
        const q = query(
          collection(db, "posts"),
          where("savedBy", "array-contains", currentUser?.uid)
        );
        const querySnapshot = await getDocs(q);
        const savedPostsData = querySnapshot.docs.map((doc) => ({
          postId: doc.id,
          ...doc.data(),
        }));
        setSavedPosts(savedPostsData);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    };

    if (currentUser) {
      fetchUserPosts();
      fetchSavedPosts();
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Avatar
                src={userData?.profilePictureUrl || currentUser?.photoURL}
                alt="profile"
                size="xxl"
                className="border-4 border-white"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData?.userName || currentUser?.displayName}
                </h1>
                <p className="text-gray-600">@{userData?.userTag}</p>
                <p className="text-gray-600 mt-2">{userData?.bio || "No bio yet"}</p>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="text-center">
                    <span className="font-bold">{posts.length}</span>
                    <p className="text-gray-600">Posts</p>
                  </div>
                  <div className="text-center">
                    <span className="font-bold">{userData?.followers?.length || 0}</span>
                    <p className="text-gray-600">Followers</p>
                  </div>
                  <div className="text-center">
                    <span className="font-bold">{userData?.following?.length || 0}</span>
                    <p className="text-gray-600">Following</p>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="outlined"
              color="red"
              onClick={handleLogout}
              className="rounded-full"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <TabsHeader className="bg-transparent">
              <Tab value="posts" className="flex items-center space-x-2">
                <PhotoIcon className="h-5 w-5" />
                <span>Posts</span>
              </Tab>
              <Tab value="saved" className="flex items-center space-x-2">
                <BookmarkIcon className="h-5 w-5" />
                <span>Saved</span>
              </Tab>
              <Tab value="tagged" className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5" />
                <span>Tagged</span>
              </Tab>
            </TabsHeader>
          </Tabs>

          {/* Posts Grid */}
          <div className="mt-6">
            {activeTab === "posts" && (
              <div className="grid grid-cols-3 gap-4">
                {posts.map((post) => (
                  <div key={post.postId} className="aspect-square">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt="post"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">No image</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="grid grid-cols-3 gap-4">
                {savedPosts.map((post) => (
                  <div key={post.postId} className="aspect-square">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt="post"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">No image</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "tagged" && (
              <div className="text-center py-8">
                <p className="text-gray-500">No tagged posts yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 