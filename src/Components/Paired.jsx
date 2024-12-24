import React, { useState, useEffect } from "react";
import { db } from "../firebase.config";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import Loader from "../Components/Loader";
import defaultImage from "../Components/download.jpg";
import { Link } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";
import "../Components/styles/Paired.css";

const Paired = () => {
  const [loading, setLoading] = useState(true);
  const [pairedUsers, setPairedUsers] = useState([]);
  const auth = getAuth();
  const [pairedUsersStatus, setPairedUsersStatus] = useState({});

  useEffect(() => {
    const fetchPairedUsers = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.error("No user is currently logged in");
          setLoading(false);
          return;
        }
        const pairedRef = doc(db, "pairedUsers", currentUser.uid);
        const pairedSnap = await getDoc(pairedRef);
        if (pairedSnap.exists()) {
          const pairedData = pairedSnap.data();
          const pairedUserPromises = pairedData.pairedWith.map(
            async (userId) => {
              const userRef = doc(db, "users", userId);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                return { id: userId, ...userSnap.data() };
              }
              return null;
            }
          );
          const resolvedUsers = await Promise.all(pairedUserPromises);
          setPairedUsers(resolvedUsers.filter((user) => user !== null));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching paired users:", error);
        setLoading(false);
      }
    };
    fetchPairedUsers();
  }, [auth]);

  const togglePair = async (userId) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("No user is currently logged in");
      return;
    }
    try {
      const pairedRef = doc(db, "pairedUsers", currentUser.uid);
      const pairedSnap = await getDoc(pairedRef);

      if (pairedSnap.exists()) {
        const pairedData = pairedSnap.data().pairedWith || [];
        if (pairedData.includes(userId)) {
          await updateDoc(pairedRef, {
            pairedWith: arrayRemove(userId),
          });
          setPairedUsersStatus((prev) => ({ ...prev, [userId]: false }));
        } else {
          await updateDoc(pairedRef, {
            pairedWith: arrayUnion(userId),
          });
          setPairedUsersStatus((prev) => ({ ...prev, [userId]: true }));
        }
      } else {
        await setDoc(pairedRef, {
          pairedWith: [userId],
        });
        setPairedUsersStatus((prev) => ({ ...prev, [userId]: true }));
      }
    } catch (error) {
      console.error("Error toggling pair status:", error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="PairedPage">
      <div className="PairedUsersContainer">
        {pairedUsers.map((user) => (
          <div className="UserCard" key={user.id}>
            <div className="left1">
              <div className="info">
                <img
                  src={user?.photo || defaultImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                  alt={user.name}
                />
              </div>
            </div>
            <div className="right">
              <div className="user">
                <h1>{user.name}</h1>
              </div>
              <div className="mail">
                <h3>{user.email}</h3>
              </div>
              <div className="partyyyy">
                {/* <div className="party3">
                  <button onClick={() => togglePair(user.id)} id="pairing">
                    {pairedUsersStatus[user.id] ? "Paired" : "Pair"}
                    <FaUserFriends className="icon" />
                  </button>
                </div> */}
                <div className="party4">
                  <button>
                    <Link to={`/profile/${user.id}`}>View Profile</Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Paired;
