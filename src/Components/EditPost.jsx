import React, { useState, useEffect } from "react";
import "../Components/styles/Ap.css";
import { db, storage } from '../firebase.config';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { getAuth } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [des, setDes] = useState("");
  const [img, setImg] = useState(null);
  const [currentImgUrl, setCurrentImgUrl] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, 'posts', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const postData = docSnap.data();
        setTitle(postData.title);
        setDes(postData.description);
        setCurrentImgUrl(postData.imgUrl);
      } else {
        toast.error("Post not found", {
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
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImg(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      let imgUrl = currentImgUrl;
      if (img) {
        try {
          const storageRef = ref(storage, `images/${img.name}`);
          const uploadTask = uploadBytesResumable(storageRef, img);

          await new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
              },
              (error) => {
                console.error("Error uploading image: ", error);
                reject(error);
              },
              async () => {
                imgUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve();
              }
            );
          });
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
          return;
        }
      }

      try {
        const postRef = doc(db, "posts", id);
        await updateDoc(postRef, {
          title: title,
          description: des,
          imgUrl: imgUrl,
        });

        toast.success('Post updated successfully', {
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

        navigate(`/post/${id}`);
      } catch (error) {
        console.error("Error updating post:", error);
        toast.error('Failed to update post. Please try again.', {
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
        <h1>Edit Post</h1>
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
          <textarea rows={12} cols={52}
          id="textareas"
            onChange={(e) => setDes(e.target.value)} value={des} placeholder="Enter description...">
          </textarea>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleChange}
          />
          {/* {currentImgUrl && <img src={currentImgUrl} alt="Current Post Image" style={{ width: '100%', marginTop: '10px' }} />} */}
          <button type="submit">Update Post</button>
        </form>
        </div>







































      </div>
    </>
  );
};

export default EditPost;
