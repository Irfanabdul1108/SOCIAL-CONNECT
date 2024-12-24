import React, { useState } from "react";
import "../Components/styles/Ap.css";
import { db, storage } from '../firebase.config';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Ap = () => {
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [img, setImg] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
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
      return;
    }

    if (!img) {
      toast.warning('Please select an image.', {
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
      return;
    }

    try {
      const storageRef = ref(storage, `images/${img.name}`);
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error("Error uploading image: ", error);
          toast.error('Image upload failed. Please try again.', {
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
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Image URL:", url); // Log the image URL for debugging

            const data = {
              author: auth.currentUser.displayName,
              email: auth.currentUser.email,
              photoURL: auth.currentUser.photoURL,
              userId: auth.currentUser.uid,
              title: title,
              description: des,
              imgUrl: url,
              timestamp: serverTimestamp(),
            };

            await addDoc(collection(db, "posts"), data);
            toast.success('Post added successfully', {
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

            setTitle("");
            setDes("");
            setImg(null);
            navigate("/");
          } catch (error) {
            console.error("Error adding post:", error);
            toast.error('Failed to add post. Please try again.', {
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
        }
      );
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error('Failed to upload image. Please try again.', {
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
      <div className="add">


  <div className="headers">
  <h1>Add Post</h1>
  </div>
        <div className="formers">
  <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="text"
            value={title}
            autoComplete="off"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title"
          />
          <textarea
            rows={12}
            cols={52}
            id="textareas"
            onChange={(e) => setDes(e.target.value)}
            value={des}
            placeholder="Enter description..."
          />
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleChange}
          />
          <button type="submit">Add Post</button>
        </form>

  </div>






      </div>
    </>
  );
};

export default Ap;
