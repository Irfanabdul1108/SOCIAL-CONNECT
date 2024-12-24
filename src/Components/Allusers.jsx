import React, { useState, useEffect } from "react";
import { onSnapshot, collection, query, orderBy, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase.config";
import { getAuth } from 'firebase/auth';
import Loader from '../Components/Loader';
import defaultImage from "../Components/download.jpg";
import { Link } from 'react-router-dom';
import { FaUserFriends } from "react-icons/fa";
import '../Components/styles/Allusers.css'; 

const AllUsers = () => {
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const [users, setUsers] = useState([]);
  const [pairedUsers, setPairedUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersQuery = query(collection(db, "users"), orderBy("timestamp", "desc"));
        onSnapshot(usersQuery, (snapshot) => {
          setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchPairedUsers = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return;
      }
      const pairedRef = doc(db, "pairedUsers", currentUser.uid);
      const pairedSnap = await getDoc(pairedRef);
      if (pairedSnap.exists()) {
        const pairedData = pairedSnap.data().pairedWith || [];
        const pairedUsersObj = {};
        pairedData.forEach(userId => {
          pairedUsersObj[userId] = true;
        });
        setPairedUsers(pairedUsersObj);
      }
    };

    fetchUsers();
    fetchPairedUsers();
  }, [auth.currentUser]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const togglePair = async (userId) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error('No user is currently logged in');
      return;
    }
    try {
      const pairedRef = doc(db, "pairedUsers", currentUser.uid);
      const pairedSnap = await getDoc(pairedRef);

      if (pairedSnap.exists()) {
        const pairedData = pairedSnap.data().pairedWith || [];
        if (pairedData.includes(userId)) {
          await updateDoc(pairedRef, {
            pairedWith: arrayRemove(userId)
          });
          setPairedUsers((prev) => ({ ...prev, [userId]: false }));
        } else {
          await updateDoc(pairedRef, {
            pairedWith: arrayUnion(userId)
          });
          setPairedUsers((prev) => ({ ...prev, [userId]: true }));
        }
      } else {
        await setDoc(pairedRef, {
          pairedWith: [userId]
        });
        setPairedUsers((prev) => ({ ...prev, [userId]: true }));
      }
    } catch (error) {
      console.error("Error toggling pair status:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div className="search-bar">
        <input 
          type='text' 
          id='text'
          autoComplete="off"
          placeholder='Search here...'
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="page">
        {loading ? <Loader /> : (
          <>
            {filteredUsers.map((user) => (
              <div className="user-card" key={user.uid}>
                <div className="left1">
                  <div className="info">
                    <img src={user?.photo || defaultImage} onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }} alt={user.name} />
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
                    <div className="party3">
                      <button onClick={() => togglePair(user.uid)} id="pairing">
                        {pairedUsers[user.uid] ? "Paired" : "Pair"}
                        <FaUserFriends className="icon" />
                      </button>
                    </div>
                    <div className="party4">
                      <button>
                        <Link to={`/profile/${user.id}`}>
                          View Profile
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default AllUsers;
