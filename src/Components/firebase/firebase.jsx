import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCeWorxzl6J8xjPqSl4O3spMq9I3cGkM88",
  authDomain: "orbit-web3.firebaseapp.com",
  projectId: "orbit-web3",
  storageBucket: "orbit-web3.firebasestorage.app",
  messagingSenderId: "315032169947",
  appId: "1:315032169947:web:27eae1561fc1a28047cbfe",
  measurementId: "G-YTJ3L66SEL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, onAuthStateChanged };




// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: "AIzaSyCeWorxzl6J8xjPqSl4O3spMq9I3cGkM88",
//   authDomain: "orbit-web3.firebaseapp.com",
//   projectId: "orbit-web3",
//   storageBucket: "orbit-web3.firebasestorage.app",
//   messagingSenderId: "315032169947",
//   appId: "1:315032169947:web:27eae1561fc1a28047cbfe",
//   measurementId: "G-YTJ3L66SEL"
// };

// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);