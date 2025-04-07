import React, { createContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AppContext = ({ children }) => {
  const navigate = useNavigate();
  const collectionUsersRef = collection(db, "users");
  const provider = new GoogleAuthProvider();

  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const signInWithGoogle = async () => {
    try {
      const popup = await signInWithPopup(auth, provider);
      const user = popup.user;

      const q = query(collectionUsersRef, where("uid", "==", user.uid));
      const docs = await getDocs(q);

      if (docs.empty) {
        await addDoc(collectionUsersRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          image: user.photoURL,
          authProvider: popup.providerId,
        });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const loginWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      await addDoc(collectionUsersRef, {
        uid: user.uid,
        name,
        providerId: "email/password",
        email: user.email,
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const sendPasswordToUser = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Check your email for reset link.");
    } catch (err) {
      alert(err.message);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserData(null);
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        const q = query(collectionUsersRef, where("uid", "==", user.uid));
        const unsub = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            setUserData(snapshot.docs[0].data());
          }
        });

        return () => unsub();
      } else {
        setCurrentUser(null);
        setUserData(null);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
        signInWithGoogle,
        loginWithEmailAndPassword,
        registerWithEmailAndPassword,
        sendPasswordToUser,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAppContext = () => React.useContext(AuthContext);
export default AppContext;
