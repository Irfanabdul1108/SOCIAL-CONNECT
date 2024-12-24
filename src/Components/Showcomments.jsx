import React, { useState, useEffect } from 'react';
import "../Components/styles/Showcomments.scss";
import defaultImage from "../Components/download.jpg";
import { BiLike, BiSolidLike, BiDislike, BiSolidDislike } from "react-icons/bi";
import { db } from '../firebase.config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Showcomments = ({ comment }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [dislikeCount, setDislikeCount] = useState(comment.dislikeCount || 0);

  useEffect(() => {
    const fetchCommentData = async () => {
      const docRef = doc(db, 'comments', comment.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setLikeCount(data.likeCount || 0);
        setDislikeCount(data.dislikeCount || 0);
      }
    };
    fetchCommentData();
  }, [comment.id]);

  const handleLike = async () => {
    const docRef = doc(db, 'comments', comment.id);
    if (liked) {
      setLiked(false);
      setLikeCount(prev => prev - 1);
      await updateDoc(docRef, { likeCount: likeCount - 1 });
    } else {
      setLiked(true);
      setLikeCount(prev => prev + 1);
      await updateDoc(docRef, { likeCount: likeCount + 1 });
      if (disliked) {
        setDisliked(false);
        setDislikeCount(prev => prev - 1);
        await updateDoc(docRef, { dislikeCount: dislikeCount - 1 });
      }
    }
  };

  const handleDislike = async () => {
    const docRef = doc(db, 'comments', comment.id);
    if (disliked) {
      setDisliked(false);
      setDislikeCount(prev => prev - 1);
      await updateDoc(docRef, { dislikeCount: dislikeCount - 1 });
    } else {
      setDisliked(true);
      setDislikeCount(prev => prev + 1);
      await updateDoc(docRef, { dislikeCount: dislikeCount + 1 });
      if (liked) {
        setLiked(false);
        setLikeCount(prev => prev - 1);
        await updateDoc(docRef, { likeCount: likeCount - 1 });
      }
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













      <div className="length">








        <div className="profile">
          <img
            src={comment?.photourl || defaultImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />
          <p>{comment.name}        :</p>
        </div>












        <div className="msg">
          <div className="commhead">
            <h3>{comment.comment}</h3>
          </div>
          <div className="icons">
            <div className="liked">
              <button onClick={handleLike} className="icon-button">
                {liked ? <BiSolidLike /> : <BiLike />}
              </button>
              <span>{likeCount > 0 ? likeCount : null}</span>
            </div>
            <div className="disliked">
              <button onClick={handleDislike} className="icon-button">
                {disliked ? <BiSolidDislike /> : <BiDislike />}
              </button>
              <span>{dislikeCount > 0 ? dislikeCount : null}</span>
            </div>
          </div>
        </div>
































        
      </div>


































    </>
  );
};

export default Showcomments;
