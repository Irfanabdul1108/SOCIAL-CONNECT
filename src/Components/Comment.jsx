import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot } from 'firebase/firestore';
import "../Components/styles/Comment.css";
import { db } from '../firebase.config';
import { getAuth } from 'firebase/auth';
import Showcomments from './Showcomments';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../Components/Loader';
import styled from 'styled-components';

const ResponsiveHeader = styled.h1`
  font-size: 2vw;
  text-align: center;
  margin: 2.5vw 0;
  @media (max-width: 430px) {
    font-size: 3.5vw;
  }
`;

const Comment = ({ id }) => {
  const auth = getAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const commentQuery = query(collection(db, "comments"));

    const unsubscribe = onSnapshot(commentQuery, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleComments = async (e) => {
    e.preventDefault();
    if (auth.currentUser && newComment.trim() !== "") {
      try {
        await addDoc(collection(db, "comments"), {
          postid: id,
          comment: newComment,
          uid: auth.currentUser.uid,
          name: auth.currentUser.displayName,
          email: auth.currentUser.email,
          photoURL: auth.currentUser.photoURL,
          "likeCount": 0,
          "dislikeCount": 0,
        });

        toast.success('Comment added successfully!', {
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

        setNewComment("");
      } catch (error) {
        console.error("Error adding comment: ", error);
        toast.error('Error adding comment. Please try again.', {
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
    } else {
      toast.warning('Please login first.', {
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

  const filteredComments = comments.filter((comment) => comment.postid === id);

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
      <form style={{ marginTop: "6vw", marginLeft: "27%" }} onSubmit={handleComments} id='formform'>
        <input
          type="text"
          id="text"
          style={{
            width: '38vw',
            height: '3.5vw',
            marginRight: "2vw",
            paddingLeft: "1vw",
               fontSize: "1.2vw",
                  outline:"none",
              }}
          value={newComment}
          autoComplete='off'
          placeholder="Comment here..."
          onChange={(e) => setNewComment(e.target.value)}
        />
        <input
          type="submit"
          id='submit'
          style={{
            width: '9.5vw',
            height: '3.5vw',
            borderRadius: "50px",
            color: "#fff",
            fontSize: "1.2vw",
            padding: "1vw",
            outline:"none",
            border:0,
          }}
          value="Comment"
        />
      </form>




      <ResponsiveHeader id="headstyle">
        TOTAL COMMENTS: {filteredComments.length}

      </ResponsiveHeader>
         {Loading?<Loader/>:(
          <>
   {filteredComments.map((comment) => (
        <Showcomments comment={comment} key={comment.id} />
      ))}
          </>
         )}
    </>
  );
};

export default Comment;
