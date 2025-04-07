import React, { useState, useRef, useContext, useReducer, useEffect } from "react";
import { Avatar, Button, Alert } from "@material-tailwind/react";
import avatar from "../../assets/images/avatar.jpg";
import live from "../../assets/images/live.png";
import smile from "../../assets/images/smile.png";
import addImage from "../../assets/images/add-image.png";
import { AuthContext } from "../AppContext/AppContext";
import {
  doc, setDoc, collection, serverTimestamp, query, orderBy, onSnapshot
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  PostsReducer, postActions, postsStates
} from "../AppContext/PostReducer";
import PostCard from "./PostCard";
import axios from "axios";

const Main = () => {
  const { currentUser, userData } = useContext(AuthContext);
  const text = useRef("");
  const scrollRef = useRef("");
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const collectionRef = collection(db, "posts");
  const postRef = doc(collectionRef);
  const document = postRef.id;
  const [state, dispatch] = useReducer(PostsReducer, postsStates);
  const { SUBMIT_POST, HANDLE_ERROR } = postActions;
  const [progressBar, setProgressBar] = useState(0);

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadToCloudinary = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(import.meta.env.VITE_CLOUDINARY_URL, formData, {
        onUploadProgress: (e) => {
          const progress = Math.round((e.loaded * 100) / e.total);
          setProgressBar(progress);
        },
      });
      setImage(res.data.secure_url);
    } catch (err) {
      alert("Upload failed");
      dispatch({ type: HANDLE_ERROR });
      console.error(err.message);
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (text.current.value !== "") {
      try {
        await setDoc(postRef, {
          documentId: document,
          uid: currentUser?.uid || userData?.uid,
          logo: currentUser?.photoURL,
          name: currentUser?.displayName || userData?.name,
          email: currentUser?.email || userData?.email,
          text: text.current.value,
          image: image,
          timestamp: serverTimestamp(),
        });
        text.current.value = "";
        setImage(null);
        setFile(null);
        setProgressBar(0);
      } catch (err) {
        dispatch({ type: HANDLE_ERROR });
        alert(err.message);
      }
    } else {
      dispatch({ type: HANDLE_ERROR });
    }
  };

  useEffect(() => {
    const postData = async () => {
      const q = query(collectionRef, orderBy("timestamp", "asc"));
      await onSnapshot(q, (doc) => {
        dispatch({
          type: SUBMIT_POST,
          posts: doc?.docs?.map((item) => item?.data()),
        });
        scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
      });
    };
    return () => postData();
  }, [SUBMIT_POST]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col py-4 w-full bg-white rounded-3xl shadow-lg">
        <div className="flex items-center border-b-2 border-gray-300 pb-4 pl-4 w-full">
          <Avatar
            size="sm"
            variant="circular"
            src={currentUser?.photoURL || avatar}
            alt="avatar"
          />
          <form className="w-full" onSubmit={handleSubmitPost}>
            <div className="flex justify-between items-center">
              <div className="w-full ml-4">
                <input
                  type="text"
                  placeholder={`What's on your mind ${currentUser?.displayName?.split(" ")[0] || userData?.name}`}
                  className="outline-none w-full bg-white rounded-md"
                  ref={text}
                />
              </div>
              <div className="mx-4">
                {image && <img className="h-24 rounded-xl" src={image} alt="previewImage" />}
              </div>
              <div className="mr-4">
                <Button variant="text" type="submit">Share</Button>
              </div>
            </div>
          </form>
        </div>
        <span style={{ width: `${progressBar}%` }} className="bg-blue-700 py-1 rounded-md"></span>
        <div className="flex justify-around items-center pt-4">
          <div className="flex items-center">
            <label htmlFor="addImage" className="cursor-pointer flex items-center">
              <img className="h-10 mr-4" src={addImage} alt="addImage" />
              <input
                id="addImage"
                type="file"
                style={{ display: "none" }}
                onChange={handleUpload}
              />
            </label>
            {file && (
              <Button variant="text" onClick={uploadToCloudinary}>
                Upload
              </Button>
            )}
          </div>
          <div className="flex items-center">
            <img className="h-10 mr-4" src={live} alt="live" />
            <p className="text-gray-700 font-medium">Live</p>
          </div>
          <div className="flex items-center">
            <img className="h-10 mr-4" src={smile} alt="feeling" />
            <p className="text-gray-700 font-medium">Feeling</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col py-4 w-full">
        {state?.error ? (
          <div className="flex justify-center items-center">
            <Alert color="red">Something went wrong. Try again.</Alert>
          </div>
        ) : (
          <div>
            {state?.posts?.length > 0 &&
              state?.posts?.map((post, index) => (
                <PostCard
                  key={index}
                  logo={post?.logo}
                  id={post?.documentId}
                  uid={post?.uid}
                  name={post?.name}
                  email={post?.email}
                  image={post?.image}
                  text={post?.text}
                  timestamp={new Date(post?.timestamp?.toDate())?.toUTCString()}
                />
              ))}
          </div>
        )}
      </div>
      <div ref={scrollRef}></div>
    </div>
  );
};

export default Main;
