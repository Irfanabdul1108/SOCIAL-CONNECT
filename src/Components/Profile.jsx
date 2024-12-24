import React, { useState, useEffect } from "react";
import Post from "./Post";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { getAuth } from "firebase/auth";
import "../Components/styles/Profile.css";
import defaultImage from "../Components/download.jpg";
import Loader from "../Components/Loader";

const Profile = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [posties, setposties] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      if (!currentUser) return;

      const q = query(
        collection(db, "posts"),
        where("userId", "==", currentUser.uid), // Filter posts by current user's uid
        orderBy("timestamp", "desc")
      );

      onSnapshot(q, (snapshot) => {
        setposties(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
    };

    fetchdata();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="div">
        <div className="img">
          <img
            src={currentUser?.photoURL || defaultImage}
            alt={currentUser.displayName}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
        </div>
        <div className="head">
          <h1>{currentUser.displayName}</h1>
        </div>
        <div className="mail">
          <h3>{currentUser.email}</h3>
        </div>
      </div>

      <div className="allposts">
        {posties.map((datas) => (
          <Post key={datas.id} data={datas} />
        ))}
      </div>
    </>
  );
};

export default Profile;
