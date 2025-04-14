import React, { useState, useEffect } from "react";
import { Avatar, Button, Tabs, TabsHeader, Tab, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Textarea } from "@material-tailwind/react";
import { useAppContext } from "../AppContext/AppContext";
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { updateProfile } from "firebase/auth";
import { PhotoIcon, UserIcon, BookmarkIcon, PencilIcon, GridIcon, BookmarkIcon as BookmarkIconSolid, HeartIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser, userData } = useAppContext();
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    userName: "",
    userTag: "",
    bio: "",
    profilePictureUrl: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
      fetchPosts();
      fetchSavedPosts();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data();
        setEditForm({
          userName: data.userName || "",
          userTag: data.userTag || "",
          bio: data.bio || "",
          profilePictureUrl: data.profilePictureUrl || ""
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load profile data");
    }
  };

  const fetchPosts = async () => {
    try {
      const q = query(
        collection(db, "posts"),
        where("uid", "==", currentUser.uid),
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
      setError("Failed to load posts");
    }
  };

  const fetchSavedPosts = async () => {
    try {
      const q = query(
        collection(db, "posts"),
        where("savedBy", "array-contains", currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const savedPostsData = querySnapshot.docs.map((doc) => ({
        postId: doc.id,
        ...doc.data(),
      }));
      setSavedPosts(savedPostsData);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      setError("Failed to load saved posts");
    }
  };

  const handleEditProfile = async () => {
    try {
      setLoading(true);
      setError("");

      await updateProfile(auth.currentUser, {
        displayName: editForm.userName,
        photoURL: editForm.profilePictureUrl
      });

      const q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "users", userDoc.id), {
          userName: editForm.userName,
          userTag: editForm.userTag,
          bio: editForm.bio,
          profilePictureUrl: editForm.profilePictureUrl
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
      formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

      const res = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setEditForm(prev => ({
        ...prev,
        profilePictureUrl: data.secure_url
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center space-x-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500"></div>
              <Avatar
                src={userData?.profilePictureUrl || currentUser?.photoURL}
                alt="profile"
                size="xxl"
                variant="circular"
                className="relative border-4 border-white shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-3"
              />
              <label
                htmlFor="profile-pic"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110"
              >
                <PhotoIcon className="h-5 w-5 text-gray-600" />
                <input
                  id="profile-pic"
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </label>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {userData?.userName}
                </h2>
                <Button
                  variant="gradient"
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              </div>

              <div className="flex space-x-12 mb-6">
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-800">{posts.length}</span>
                  <p className="text-gray-600 text-sm font-medium">posts</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-800">{userData?.followers?.length || 0}</span>
                  <p className="text-gray-600 text-sm font-medium">followers</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-800">{userData?.following?.length || 0}</span>
                  <p className="text-gray-600 text-sm font-medium">following</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-gray-800">{userData?.userName}</p>
                <p className="text-gray-600 text-sm leading-relaxed max-w-md">{userData?.bio || "No bio yet"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Posts Created</span>
                <span className="font-semibold">{posts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Comments Made</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Likes Received</span>
                <span className="font-semibold">156</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Engagement</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average Likes</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average Comments</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Engagement Rate</span>
                <span className="font-semibold">8.5%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <HeartIcon className="h-5 w-5 text-red-500" />
                <span className="text-sm text-gray-600">Liked 5 posts</span>
              </div>
              <div className="flex items-center space-x-3">
                <ChatBubbleLeftIcon className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-600">Commented on 3 posts</span>
              </div>
              <div className="flex items-center space-x-3">
                <BookmarkIcon className="h-5 w-5 text-purple-500" />
                <span className="text-sm text-gray-600">Saved 2 posts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <Tabs value={activeTab} onChange={setActiveTab}>
            <TabsHeader className="bg-transparent border-b border-gray-100">
              <Tab
                value="posts"
                className="flex items-center space-x-2 py-4 px-6 hover:bg-gray-50 transition-all duration-300"
              >
                <GridIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Posts</span>
              </Tab>
              <Tab
                value="saved"
                className="flex items-center space-x-2 py-4 px-6 hover:bg-gray-50 transition-all duration-300"
              >
                <BookmarkIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Saved</span>
              </Tab>
            </TabsHeader>
          </Tabs>

          {/* Posts Grid */}
          <div className="p-4">
            {activeTab === "posts" ? (
              <div className="grid grid-cols-3 gap-2">
                {posts.map((post) => (
                  <div
                    key={post.postId}
                    className="aspect-square group relative overflow-hidden rounded-xl hover:rounded-2xl transition-all duration-300"
                  >
                    <img
                      src={post.imageUrl}
                      alt="post"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <HeartIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">{post.likes?.length || 0}</span>
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">{post.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {savedPosts.map((post) => (
                  <div
                    key={post.postId}
                    className="aspect-square group relative overflow-hidden rounded-xl hover:rounded-2xl transition-all duration-300"
                  >
                    <img
                      src={post.imageUrl}
                      alt="saved post"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <HeartIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">{post.likes?.length || 0}</span>
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">{post.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog
        open={isEditing}
        handler={() => setIsEditing(false)}
        className="bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-100"
      >
        <DialogHeader className="border-b border-gray-100">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Edit Profile
          </h3>
        </DialogHeader>
        <DialogBody className="py-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar
                src={editForm.profilePictureUrl}
                alt="profile"
                size="lg"
                variant="circular"
                className="border-2 border-gray-200 shadow-lg"
              />
              <label className="cursor-pointer">
                <span className="text-purple-600 hover:text-purple-700 transition-colors duration-200 font-medium">
                  Change Profile Photo
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </label>
            </div>
            <Input
              label="Username"
              value={editForm.userName}
              onChange={(e) => setEditForm(prev => ({ ...prev, userName: e.target.value }))}
              className="!border-gray-200 focus:!border-purple-500"
            />
            <Input
              label="User Tag"
              value={editForm.userTag}
              onChange={(e) => setEditForm(prev => ({ ...prev, userTag: e.target.value }))}
              className="!border-gray-200 focus:!border-purple-500"
            />
            <Textarea
              label="Bio"
              value={editForm.bio}
              onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
              className="!border-gray-200 focus:!border-purple-500"
            />
          </div>
        </DialogBody>
        <DialogFooter className="border-t border-gray-100">
          <Button
            variant="text"
            color="red"
            onClick={() => setIsEditing(false)}
            className="mr-2 hover:bg-red-50 transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="purple"
            onClick={handleEditProfile}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Profile; 