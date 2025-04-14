import React, { useState, useContext, useEffect, useReducer } from "react";
import { Avatar, Button, IconButton, Input } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.jpg";
import like from "../../assets/images/like.png";
import comment from "../../assets/images/comment.png";
import remove from "../../assets/images/delete.png";
import addFriend from "../../assets/images/add-friend.png";
import { useAppContext } from "../AppContext/AppContext";
import {
  PostsReducer,
  postActions,
  postsStates,
} from "../AppContext/PostReducer";
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
import CommentSection from "./CommentSection";
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
  const [state, dispatch] = useReducer(PostsReducer, postsStates);
  const singlePostDocument = doc(db, "posts", postId);
  const { ADD_LIKE, HANDLE_ERROR } = postActions;
  const [open, setOpen] = useState(false);
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
        
        const unsubscribe = onSnapshot(q, 
          (snapshot) => {
            try {
              const commentsData = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                  id: doc.id,
                  text: data.text || "",
                  uid: data.uid || "",
                  userName: data.userName || "Unknown User",
                  profilePictureUrl: userData?.profilePictureUrl || currentUser?.photoURL || avatar,
                  timestamp: data.timestamp || serverTimestamp(),
                };
              });
              setComments(commentsData);
              setError("");
            } catch (error) {
              console.error("Error processing comments:", error);
              setError("Error processing comments");
            }
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

  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const addUser = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", currentUser?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].ref;
      await updateDoc(data, {
        friends: arrayUnion({
          id: uid,
          image: profilePictureUrl,
          name: userName,
        }),
      });
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

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
        userName: userData?.userName || currentUser.displayName || "Unknown User",
        profilePictureUrl: userData?.profilePictureUrl || currentUser?.photoURL || avatar,
        timestamp: serverTimestamp(),
      });

      setCommentText("");
      setError("");
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again.");
    }
  };

  const deletePost = async (e) => {
    e.preventDefault();
    try {
      if (currentUser?.uid === uid) {
        await deleteDoc(singlePostDocument);
      } else {
        console.log("You can't delete other users' posts!");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-lg p-4 mb-4">
      {error && (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      )}
      
      <div className="flex items-center mb-4">
        <Avatar
          src={profilePictureUrl || avatar}
          alt={userName}
          size="md"
          variant="circular"
          className="mr-3"
        />
        <div>
          <h3 className="font-medium text-gray-900">{userName}</h3>
          <p className="text-sm text-gray-500">@{userTag}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-800">{body || ""}</p>
        {caption && <p className="text-gray-600 text-sm mt-2">{caption}</p>}
      </div>

      {imageUrl && (
        <div className="mb-4">
          <img
            src={imageUrl}
            alt="post"
            className="w-full rounded-xl object-cover"
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

      <div className="flex justify-between border-t border-gray-200 pt-4">
        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={handleLike}
        >
          {liked ? (
            <HeartIconSolid className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
          Like
        </Button>
        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={() => setShowComments(!showComments)}
        >
          <ChatBubbleLeftIcon className="h-5 w-5" />
          Comment
        </Button>
        <Button variant="text" className="flex items-center gap-2">
          <ShareIcon className="h-5 w-5" />
          Share
        </Button>
        <IconButton variant="text" onClick={handleSave}>
          {saved ? (
            <BookmarkIconSolid className="h-5 w-5 text-blue-500" />
          ) : (
            <BookmarkIcon className="h-5 w-5" />
          )}
        </IconButton>
      </div>

      {showComments && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="space-y-4 mb-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <Avatar
                    src={comment.profilePictureUrl || avatar}
                    alt={comment.userName}
                    size="sm"
                    variant="circular"
                  />
                  <div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="font-medium text-gray-900">{comment.userName}</p>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {comment.timestamp?.toDate?.()?.toLocaleString() || "Just now"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleComment} className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="!border !border-gray-300"
              labelProps={{
                className: "hidden",
              }}
              containerProps={{
                className: "min-w-0",
              }}
            />
            <Button
              type="submit"
              variant="text"
              size="sm"
              className="rounded-full"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;
