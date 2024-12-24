import React, { useEffect, useState } from 'react';
import { db } from '../firebase.config';
import { useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import "../Components/styles/Pd.css";
import defaultImage from "../Components/download.jpg";
import Comment from './Comment';
import Loader from '../Components/Loader';

const Pd = () => {
  const { id } = useParams();
  const [datas, setDatas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchPostDetail = async (id) => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDatas(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail(id);
  }, [id]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  if (loading) {
    return <Loader />;
  }

  if (!datas) {
    return <div>No post found</div>;
  }

  return (
    <>
      <div className={`overlay ${showForm ? "active" : ""}`}></div>
      <div className="box1">
        <div className="second1">








          <div className="left11">
            <img
              src={datas.imgUrl || defaultImage}
              alt="Post Image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
            />
          </div>



          <div className="right1">


            <div className="first1">

              <div className="img1">
                <img
                  src={datas.photoURL || defaultImage}
                  alt="Author"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                />
              </div>

              <div className="heading1">
                <h1>{datas.author}</h1>
              </div>

            </div>







            <div className="headbud">
            <h1 className='h1'>{datas.title}</h1>
            </div>








            <div className="shows">
              <button id="show" onClick={toggleForm}>
                {showForm ? "Hide form" : "View Desc"}
              </button>
            </div>

          </div>














        </div>
      </div>
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <div className="closes">
              <button id="close" onClick={toggleForm}>
                X
              </button>
            </div>
            <div className="parad">
              <p>{datas.description}</p>
            </div>
          </div>
        </div>
      )}
      <Comment id={id} />
    </>
  );
};

export default Pd;
