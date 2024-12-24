import React, { useState, useEffect } from "react";
import Post from "./Post";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../firebase.config";
import Loader from "../Components/Loader";
import "../Components/styles/Gp.css";

const Gp = () => {
  const [posties, setposties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const postquery = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc")
    );

    const fetchdata = async () => {
      await onSnapshot(postquery, (snapshot) => {
        setposties(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });
    };
    fetchdata();
  }, []);

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);

    if (e.target.value === "") {
      const postquery = query(
        collection(db, "posts"),
        orderBy("timestamp", "desc")
      );
      await onSnapshot(postquery, (snapshot) => {
        setposties(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });
    } else {
      const postquery = query(
        collection(db, "posts"),
        where("title", ">=", e.target.value),
        where("title", "<=", e.target.value + "\uf8ff"),
        orderBy("timestamp", "desc")
      );

      await onSnapshot(postquery, (snapshot) => {
        setposties(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });
    }
  };

  return (
    <>
      <div className="searchbar">
        <input
          type="text"
          id="text"
          autoComplete="off"
          placeholder="Search here..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {posties.map((data) => (
            <Post key={data.id} data={data} />
          ))}
        </>
      )}
    </>
  );
};

export default Gp;
