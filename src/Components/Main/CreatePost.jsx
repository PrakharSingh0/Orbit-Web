import React, { useState } from "react";
import { Button, Input, Textarea } from "@material-tailwind/react";
import { db } from "../firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAppContext } from "../AppContext/AppContext";

const CreatePost = () => {
  const { currentUser, userData } = useAppContext();
  const [body, setBody] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError("Please log in to create a post.");
      return;
    }

    if (!body.trim() && !imageUrl.trim()) {
      setError("Post body or image is required.");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        body,
        caption,
        imageUrl,
        userId: currentUser.uid,
        userName: userData?.userName || currentUser.displayName || "Unknown User",
        profilePictureUrl: userData?.profilePictureUrl || currentUser?.photoURL,
        timestamp: serverTimestamp(),
        likes: [],
        savedBy: [],
      });

      setBody("");
      setCaption("");
      setImageUrl("");
      setError("");
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create the post.");
    }
  };

  return (
    <div className="w-full bg-[#1e1e1e] rounded-3xl shadow-md p-4 mb-4 text-gray-100">
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      <form onSubmit={handleCreatePost} className="space-y-4">
        <Textarea
          label="Post Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="!border !border-gray-700 !text-gray-100"
        />
        <Input
          label="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="!border !border-gray-700 !text-gray-100"
        />
        <Input
          label="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="!border !border-gray-700 !text-gray-100"
        />
        <Button type="submit" className="w-full">Create Post</Button>
      </form>
    </div>
  );
};

export default CreatePost;
