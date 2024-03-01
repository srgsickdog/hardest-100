// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCC6PhI90WNvzBt8I_vN_xKnd1QSIunPes",
  authDomain: "hardest-100.firebaseapp.com",
  projectId: "hardest-100",
  storageBucket: "hardest-100.appspot.com",
  messagingSenderId: "69323812513",
  appId: "1:69323812513:web:c68ac54c3a9745183d0ae0"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;