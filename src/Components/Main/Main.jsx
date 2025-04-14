import React, { useState, useRef, useEffect } from "react";
import { Avatar, Button, IconButton } from "@material-tailwind/react";
import { useAppContext } from "../AppContext/AppContext";
import {
  collection,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import PostCard from "./PostCard";
import UserCards from "./UserCards";
import { PhotoIcon, LinkIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Navbar from "../Navbar/Navbar";

const Main = () => {
  const { currentUser, userData } = useAppContext();
  const text = useRef("");
  const scrollRef = useRef("");
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progressBar, setProgressBar] = useState(0);
  const [posts, setPosts] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  const handleUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const uploadToCloudinary = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

    try {
      setLoading(true);
      setError("");
      const res = await axios.post(import.meta.env.VITE_CLOUDINARY_URL, formData, {
        onUploadProgress: (e) => {
          const progress = Math.round((e.loaded * 100) / e.total);
          setProgressBar(progress);
        },
      });
      setImageUrl(res.data.secure_url);
      setImage(file);
    } catch (err) {
      setError("Image upload failed. Please try again.");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    const postContent = text.current.value.trim();
    
    if (!postContent) {
      setError("Please write something to post");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const postsRef = collection(db, "posts");
      const postData = {
        body: postContent,
        caption: caption.trim(),
        imageUrl: imageUrl || "",
        profilePictureUrl: userData?.profilePictureUrl || currentUser?.photoURL || "",
        uid: currentUser?.uid,
        userTag: userData?.userTag || "",
        userName: userData?.userName || currentUser?.displayName || "",
        link: link.trim(),
        timestamp: serverTimestamp(),
        likes: [],
        comments: [],
        savedBy: [],
        shares: 0,
        views: 0,
        isEdited: false,
        lastEdited: null,
        tags: [],
        location: userData?.location || "Not specified",
        status: "active"
      };

      const newPostRef = await addDoc(postsRef, postData);
      const userPostsRef = doc(db, "users", currentUser.uid, "posts", newPostRef.id);
      await setDoc(userPostsRef, {
        ...postData,
        postId: newPostRef.id
      });

      text.current.value = "";
      setImage(null);
      setFile(null);
      setImageUrl("");
      setLink("");
      setCaption("");
      setShowLinkInput(false);
      setProgressBar(0);
    } catch (err) {
      setError("Failed to create post. Please try again.");
      console.error("Post creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const postsData = snapshot.docs.map((doc) => ({
            postId: doc.id,
            ...doc.data(),
          }));
          setPosts(postsData);
        });

        return () => unsubscribe();
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-gray-800 rounded-3xl shadow-xl p-4 mb-4">
          <form onSubmit={handleSubmitPost}>
            <div className="flex items-start space-x-4">
              <Avatar
                size="sm"
                variant="circular"
                src={userData?.profilePictureUrl || currentUser?.photoURL}
                alt="avatar"
              />
              <div className="flex-1">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Add a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    ref={text}
                    placeholder={`What's on your mind, ${currentUser?.displayName?.split(" ")[0] || userData?.userName}?`}
                    className="w-full bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                {error && (
                  <div className="text-red-400 text-sm mb-2">{error}</div>
                )}
                {showLinkInput && (
                  <div className="mt-2">
                    <input
                      type="url"
                      placeholder="Add a link (optional)"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {link && (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 text-sm hover:underline mt-1 inline-block"
                      >
                        Preview link
                      </a>
                    )}
                  </div>
                )}
                {imageUrl && (
                  <div className="relative mt-4">
                    <img
                      src={imageUrl}
                      alt="preview"
                      className="w-full rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setFile(null);
                        setImageUrl("");
                      }}
                      className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 rounded-full p-1 shadow-md"
                    >
                      <XMarkIcon className="h-5 w-5 text-gray-300" />
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer text-gray-400 hover:text-blue-400">
                      <PhotoIcon className="h-6 w-6" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleUpload}
                        accept="image/*"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowLinkInput(!showLinkInput)}
                      className="text-gray-400 hover:text-blue-400"
                    >
                      <LinkIcon className="h-6 w-6" />
                    </button>
                    {file && (
                      <Button
                        variant="text"
                        onClick={uploadToCloudinary}
                        disabled={loading}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        {loading ? "Uploading..." : "Upload"}
                      </Button>
                    )}
                  </div>
                  <Button
                    type="submit"
                    color="blue"
                    disabled={loading || !text.current?.value}
                    className="rounded-full px-6"
                  >
                    {loading ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <UserCards />

        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.postId}
              postId={post.postId}
              uid={post.uid}
              userName={post.userName}
              userTag={post.userTag}
              profilePictureUrl={post.profilePictureUrl}
              body={post.body}
              caption={post.caption}
              imageUrl={post.imageUrl}
              link={post.link}
              timestamp={post.timestamp}
            />
          ))}
        </div>
        <div ref={scrollRef}></div>
      </div>
    </div>
  );
};

export default Main;
