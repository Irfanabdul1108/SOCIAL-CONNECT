import React, { useState, useEffect } from "react";
import "../Components/styles/Post.css";
import { db } from "../firebase.config";
import Dataandtime from "./Dataandtime";
import {
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import defaultImage from "../Components/download.jpg";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaComment } from "react-icons/fa";

const Post = ({ data }) => {
  const [liked, setLiked] = useState(false);
  const auth = getAuth();
  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, "posts", data.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const likedBy = docSnap.data().likedBy || [];
        setLiked(likedBy.includes(auth.currentUser.uid));
      }
    };
    checkIfLiked();
  }, [auth.currentUser, data.id]);

  const toggleLike = async () => {
    if (!auth.currentUser) return;
    const postRef = doc(db, "posts", data.id);
    if (liked) {
      await updateDoc(postRef, { likedBy: arrayRemove(auth.currentUser.uid) });
    } else {
      await updateDoc(postRef, { likedBy: arrayUnion(auth.currentUser.uid) });
    }
    setLiked(!liked);
  };

  const location = useLocation();
  const delpost = async (id) => {
    const deldata = doc(db, "posts", id);
    await deleteDoc(deldata);
    toast.success("Deleted successfully...", {
      position: "top-right",
      autoClose: 2999,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  const handleEditClick = () => {
    if (data.userId === currentUserId) {
      // Allow navigation to the edit page
      window.location.href = `/edit/${data.id}`;
    } else {
      // Display error message
      toast.error("You cannot edit posts from other accounts", {
        position: "top-right",
        autoClose: 2999,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2999}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="boxes">
        <div className="firbox">
          <div className="lef">
            <div className="imgdiv">
              <img
                src={data?.photoURL || defaultImage}
                alt="Profile photo"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
            </div>
            <div className="infos">
              <h1>{data.title}</h1>
              <h2>
                <Dataandtime
                  seconds={data.timestamp.seconds}
                  nanoseconds={data.timestamp.nanoseconds}
                />
              </h2>
            </div>
          </div>
          <div className="righ">
            {location.pathname === "/profile" && (
              <Link
                className="btn3"
                onClick={() => {
                  delpost(data.id);
                }}
              >
                <MdDelete style={{ fontSize: "1.32vw", color: "#fff" }} />
              </Link>
            )}
          </div>
        </div>
        <div className="secobox">
          <img
            src={data?.imgUrl || defaultImage}
            alt="Post image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
        </div>
        <div className="thbox">
          <Link to={`/post/${data.id}`}>
            <button className="btn2">View Desc</button>
          </Link>
        </div>
        <div className="fourbox">
          <div className="edit">
            <MdEdit style={{ fontSize: "1.4vw" }} />
            <span
              onClick={handleEditClick}
              style={{
                textDecoration: "none",
                fontSize: "1.5vw",
                marginLeft: "0.5vw",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {" "}
              Edit{" "}
            </span>
          </div>
          <div className="comm">
            <FaComment style={{ fontSize: "1.4vw" }} />
            <Link
              to={`/post/${data.id}`}
              style={{
                textDecoration: "none",
                color: "#fff",
                fontFamily: "Denk One",
                fontSize: "1.5vw",
                marginLeft: "0.5vw",
              }}
            >
              {" "}
              Comment{" "}
            </Link>
          </div>
          <div className="like">
            <div onClick={toggleLike}>
              {liked ? (
                <FaHeart
                  style={{ fontSize: "1.4vw", color: "red" }}
                  onClick={() => {
                    toast.success("Liked Post", {
                      position: "top-right",
                      autoClose: 2999,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "dark",
                      transition: Bounce,
                    });
                  }}
                />
              ) : (
                <FaRegHeart style={{ fontSize: "1.4vw" }} />
              )}
              <span> Like </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
