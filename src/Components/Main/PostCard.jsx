import React, { useState, useEffect } from "react";
import { Avatar, Button, Input } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.jpg";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  BookmarkIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from "@heroicons/react/24/solid";
import {
  doc,
  setDoc,
  collection,
  query,
  onSnapshot,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  deleteDoc,
  arrayRemove,
  getDoc,
  addDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAppContext } from "../AppContext/AppContext";

const PostCard = ({
  postId,
  uid,
  userName,
  userTag,
  profilePictureUrl,
  body,
  caption,
  imageUrl,
  link,
  timestamp,
}) => {
  const { currentUser, userData } = useAppContext();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const fetchPostData = async () => {
      try {
        const postRef = doc(db, "posts", postId);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
          const postData = postDoc.data();
          setLikes(postData.likes || []);
          setLiked(postData.likes?.includes(currentUser.uid) || false);
          setSaved(postData.savedBy?.includes(currentUser.uid) || false);
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
        setError("Failed to load post data");
      }
    };

    const fetchComments = async () => {
      try {
        const commentsRef = collection(db, "posts", postId, "comments");
        const q = query(commentsRef, orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const commentsData = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                text: data.text || "",
                uid: data.uid || "",
                userName: data.userName || "Unknown User",
                profilePictureUrl:
                  userData?.profilePictureUrl || currentUser?.photoURL || avatar,
                timestamp: data.timestamp || serverTimestamp(),
              };
            });
            setComments(commentsData);
            setError("");
          },
          (error) => {
            console.error("Error in comments snapshot:", error);
            setError("Failed to load comments. Please try again.");
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error("Error setting up comments listener:", error);
        setError("Failed to set up comments. Please refresh the page.");
      }
    };

    fetchPostData();
    fetchComments();
  }, [postId, currentUser, userData]);

  const handleLike = async () => {
    if (!currentUser) {
      setError("Please login to like posts");
      return;
    }

    try {
      const postRef = doc(db, "posts", postId);

      if (liked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid),
        });
        setLikes((prev) => prev.filter((id) => id !== currentUser.uid));
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid),
        });
        setLikes((prev) => [...prev, currentUser.uid]);
      }

      setLiked(!liked);
      setError("");
    } catch (error) {
      console.error("Error updating like:", error);
      setError("Failed to update like");
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      setError("Please login to save posts");
      return;
    }

    try {
      const postRef = doc(db, "posts", postId);

      if (saved) {
        await updateDoc(postRef, {
          savedBy: arrayRemove(currentUser.uid),
        });
      } else {
        await updateDoc(postRef, {
          savedBy: arrayUnion(currentUser.uid),
        });
      }

      setSaved(!saved);
      setError("");
    } catch (error) {
      console.error("Error updating save:", error);
      setError("Failed to update save");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError("Please login to comment");
      return;
    }

    if (!commentText.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      const commentsRef = collection(db, "posts", postId, "comments");
      await addDoc(commentsRef, {
        text: commentText.trim(),
        uid: currentUser.uid,
        userName:
          userData?.userName || currentUser.displayName || "Unknown User",
        profilePictureUrl:
          userData?.profilePictureUrl || currentUser?.photoURL || avatar,
        timestamp: serverTimestamp(),
      });

      setCommentText("");
      setError("");
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!currentUser || currentUser.uid !== uid) {
      setError("You can only delete your own posts.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "posts", postId));
      setError("");
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete the post.");
    }
  };

  return (
    <div className="w-full bg-[#1e1e1e] rounded-3xl shadow-md p-4 mb-4 text-gray-100">
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

      <div className="flex items-center mb-4">
        <Avatar
          src={userData?.profilePictureUrl || profilePictureUrl || avatar}
          alt={userName}
          size="md"
          variant="circular"
          className="mr-3"
        />
        <div>
          <h3 className="font-medium text-white">{userName}</h3>
          <p className="text-sm text-gray-400">@{userTag}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-200">{body || ""}</p>
        {caption && <p className="text-gray-400 text-sm mt-2">{caption}</p>}
      </div>

      {imageUrl && (
        <div className="mb-4">
          <img
            src={imageUrl}
            alt="post"
            className="w-full rounded-xl object-contain max-h-[500px]"
            loading="lazy"
          />
        </div>
      )}

      {link && (
        <div className="mb-4">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {link}
          </a>
        </div>
      )}

      <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
        <span>{timestamp?.toDate?.()?.toLocaleString() || "Just now"}</span>
        <div className="flex space-x-2">
          <span>{likes.length} likes</span>
          <span>{comments.length} comments</span>
        </div>
      </div>

      <div className="flex justify-between border-t border-gray-700 pt-4 flex-wrap gap-2">
        <Button variant="text" className="flex items-center gap-2" onClick={handleLike}>
          {liked ? (
            <HeartIconSolid className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-500" />
          )}
          Like
        </Button>

        <Button variant="text" className="flex items-center gap-2" onClick={() => setShowComments(!showComments)}>
          <ChatBubbleLeftIcon className="w-5 h-5 text-gray-500" />
          Comment
        </Button>

        <Button variant="text" className="flex items-center gap-2">
          <ShareIcon className="w-5 h-5 text-gray-500" />
          Share
        </Button>

        <Button variant="text" className="flex items-center gap-2" onClick={handleSave}>
          {saved ? (
            <BookmarkIconSolid className="w-5 h-5 text-yellow-500" />
          ) : (
            <BookmarkIcon className="w-5 h-5 text-gray-500" />
          )}
          Save
        </Button>

        {currentUser?.uid === uid && (
          <Button variant="text" className="flex items-center gap-2" onClick={handleDelete}>
            <PaperAirplaneIcon className="w-5 h-5 text-gray-500" />
            Delete
          </Button>
        )}
      </div>

      {showComments && (
        <div className="mt-4">
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start mb-4">
                  <Avatar
                    src={comment.profilePictureUrl || avatar}
                    alt={comment.userName}
                    size="sm"
                    className="mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{comment.userName}</h4>
                    <p className="text-gray-400">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet</p>
            )}
          </div>

          <div className="mt-4">
            <form onSubmit={handleComment}>
              <div className="flex items-center">
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="bg-transparent border-b-2 text-white"
                  placeholder="Add a comment..."
                />
                <Button type="submit" className="ml-2 text-blue-500">Post</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
