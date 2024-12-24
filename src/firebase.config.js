import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD19J6e0F72v073aB5V71Byos3pNTxjO10",
    authDomain: "fir-8264c.firebaseapp.com",
    projectId: "fir-8264c",
    storageBucket: "fir-8264c.appspot.com",
    messagingSenderId: "646123711031",
    appId: "1:646123711031:web:f5c6cfb1543a750b7f6db2"
};


const app = initializeApp(firebaseConfig);
export const auth =getAuth(app);
export const db =getFirestore(app);
export const storage =getStorage(app);
