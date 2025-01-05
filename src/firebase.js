import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAP-wJWqO-iEe44Cu0KVz4g_qkmXe6ZKXw",
  authDomain: "documentapp-70cbe.firebaseapp.com",
  projectId: "documentapp-70cbe",
  storageBucket: "documentapp-70cbe.firebasestorage.app",
  messagingSenderId: "346068852807",
  appId: "1:346068852807:web:1184450aba58c1241b9162",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export { db };
