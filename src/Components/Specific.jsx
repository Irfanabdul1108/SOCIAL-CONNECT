import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase.config";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import Post from "./Post";
import defaultImage from "../Components/download.jpg";
import "../Components/styles/Specific.css";
import Loader from "../Components/Loader";

const Specific = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
    };

    const fetchUserPosts = async () => {
      const postsQuery = query(
        collection(db, "posts"),
        where("userId", "==", userId)
      );
      onSnapshot(postsQuery, (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });
    };

    fetchUser();
    fetchUserPosts();
  }, [userId]);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }} className="specific">
      {user && (
        <div style={{ marginBottom: "20px" }} className="subspecific">
          <img
            src={user?.photo || defaultImage}
            alt={user.name}
            className="subsubspecific"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
          <h1 className="headsup">{user.name}</h1>
          <p className="parasup">{user.email}</p>
        </div>
      )}
      <div className="specificposts">
        {posts.map((post) => (
          <Post key={post.id} data={post} style={{ color: "#fff" }} />
        ))}
      </div>
    </div>
  );
};

export default Specific;
