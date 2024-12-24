import React, { useEffect, useState } from 'react';
import { db } from '../firebase.config';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc, arrayRemove, arrayUnion, deleteDoc } from 'firebase/firestore';
import "../Components/styles/Likes.scss";
import Dataandtime from './Dataandtime';
import { Link, useLocation } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import defaultImage from "../Components/download.jpg";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from '../Components/Loader';

const Likes = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [liked, setLiked] = useState({});
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchLikedPosts = async () => {
      if (!auth.currentUser) return;

      try {
        const q = query(
          collection(db, 'posts'),
          where('likedBy', 'array-contains', auth.currentUser.uid)
        );

        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLikedPosts(posts);

        // Initialize liked state
        const likedState = {};
        posts.forEach(post => {
          likedState[post.id] = post.likedBy.includes(auth.currentUser.uid);
        });
        setLiked(likedState);
      } catch (error) {
        console.error("Error fetching liked posts: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPosts();
  }, [auth.currentUser]);

  const toggleLike = async (postId) => {
    if (!auth.currentUser) return;

    const postRef = doc(db, 'posts', postId);
    try {
      // Fetch the post document
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const postData = postDoc.data();
        const likedBy = postData.likedBy || [];

        // Check if the user has already liked the post
        if (likedBy.includes(auth.currentUser.uid)) {
          // If user has already liked, do nothing
          return;
        }

        // Add the user to the list of users who liked the post
        await updateDoc(postRef, {
          likedBy: arrayUnion(auth.currentUser.uid)
        });

        // Update the local state to reflect the like status
        setLiked(prevLiked => ({
          ...prevLiked,
          [postId]: true
        }));

        // Show success message
        toast.success("Liked successfully...", {
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
    } catch (error) {
      console.error("Error toggling like: ", error);
    }
  };

  const delpost = async (id) => {
    const deldata = doc(db, "posts", id);
    try {
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
      setLikedPosts(prevPosts => prevPosts.filter(post => post.id !== id));
    } catch (error) {
      console.error("Error deleting post: ", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

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
      <div className='likes'>
        {likedPosts.map(post => (
          <div className="boxes" key={post.id}>
            <div className="firbox">
              <div className="lef">
                <div className="imgdiv">
                  <img
                    src={post?.photoURL || defaultImage}
                    alt="Profile photo"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultImage;
                    }}
                  />
                </div>
                <div className="infos">
                  <h1>{post.title}</h1>
                  <h2>
                    <Dataandtime
                      seconds={post.timestamp.seconds}
                      nanoseconds={post.timestamp.nanoseconds}
                    />
                  </h2>
                </div>
              </div>
              <div className="righ">
                {location.pathname === '/profile' && (
                  <Link className='btn3' onClick={() => { delpost(post.id) }}>
                    <MdDelete style={{ fontSize: "1.32vw", color: "#fff" }} />
                  </Link>
                )}
              </div>
            </div>
            <div className="secobox">
              <img
                src={post?.imgUrl || defaultImage}
                alt="Post image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
            </div>
            <div className="thbox">
              <Link to={`/post/${post.id}`}>
                <button className='btn2'>View Desc</button>
              </Link>
            </div>
            <div className="fourbox">
              <div className="edit">
                <MdEdit style={{ fontSize: "1.4vw" }} />
                <Link style={{ textDecoration: "none", fontSize: "1.5vw", marginLeft: "0.5vw", color: "#fff" }}>
                  Edit
                </Link>
              </div>
              <div className="comm">
                <FaComment style={{ fontSize: "1.4vw" }} />
                <Link to={`/post/${post.id}`}
                  style={{
                    textDecoration: "none",
                    color: "#fff",
                    fontFamily: "Denk One",
                    fontSize: "1.5vw",
                    marginLeft: "0.5vw",
                  }}
                >
                  comment
                </Link>
              </div>
              <div className="like">
                <button onClick={() => toggleLike(post.id)}>
                  {liked[post.id] ? (
                    <FaHeart
                      style={{ fontSize: "1.3vw", color: "red" }}
                    />
                  ) : (
                    <FaRegHeart style={{ fontSize: "1.3vw" }} />
                  )}
                  <span style={{ marginLeft: "0.5vw" }}>
                    Like
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Likes;
