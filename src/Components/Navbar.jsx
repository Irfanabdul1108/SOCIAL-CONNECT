import React from "react";
import "../Components/styles/Navbar.css";
import {
  FaGoogle,
  FaSun,
  FaMoon,
  FaHeart,
  FaUserAlt,
  FaUsers,
} from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { TiThMenu } from "react-icons/ti";
import { MdDoubleArrow } from "react-icons/md";
import { db } from "../firebase.config.js";
import { signInWithPopup, getAuth, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import defaultImage from "../Components/download.jpg";
import { FaUserFriends } from "react-icons/fa";
const Navbar = ({ toggleTheme }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const googleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          uid: user.uid,
          timestamp: serverTimestamp(),
        });
      }

      toast.success(`Welcome ${user.displayName}`, {
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

      navigate("/profile");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Failed to sign in with Google");
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      toast.success("Logout successfully...", {
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
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
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

      <div className="left" id="left">
        <div className="part0">
          <Link to="/" className="headauth">
            {auth.currentUser ? (
              <div className="auth">
                <div className="logo">
                  <img
                    className="image"
                    src={auth.currentUser.photoURL || defaultImage}
                    alt="User Profile"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultImage;
                    }}
                  />
                </div>
                <div className="head">
                  <h1>{auth.currentUser.displayName}</h1>
                </div>
              </div>
            ) : (
              <div className="auth2">
                <h1 className="head-name">Socialbond</h1>
              </div>
            )}
          </Link>
        </div>

        <div className="part1">
          <div className="parted1">
            {!auth.currentUser && (
              <button onClick={googleClick} className="login">
                <span>Login</span> <FaGoogle style={{ fontSize: "1.6vw" }} />
              </button>
            )}
          </div>
          <div className="parted3">
            {auth.currentUser && (
              <Link to="/profile" className="linked">
                <button className="btn">
                  <h1>Profile</h1>
                  <FaUserAlt style={{ fontSize: "1.4vw", margin: "0 1.2vw" }} />
                </button>
              </Link>
            )}
          </div>
          <div className="parted4">
            <Link to="/users" className="link">
              <button>
                <h1>All users</h1>
                <FaUsers style={{ fontSize: "1.8vw", margin: "0 0.5vw" }} />
              </button>
            </Link>
          </div>
          <div className="parted6">
            {auth.currentUser && (
              <Link
                to="/likes"
                className="link"
                style={{ textDecoration: "none" }}
              >
                <button>
                  <h1>Likes</h1>
                  <FaHeart style={{ fontSize: "1.3vw" }} />
                </button>
              </Link>
            )}
          </div>
          <div className="parted6">
            {auth.currentUser && (
              <Link
                to="/paired"
                className="link"
                style={{ textDecoration: "none" }}
              >
                <button>
                  <h1>Paired</h1>
                  <FaUserFriends style={{ fontSize: "1.3vw" }} />
                </button>
              </Link>
            )}
          </div>

          <div className="parted7">
            <button onClick={toggleTheme} className="theme-toggle">
              <FaSun
                style={{ fontSize: "1.4vw", margin: "0 2vw", color: "#fff" }}
              />
              <FaMoon
                style={{ fontSize: "1.4vw", margin: "0 2vw", color: "#fff" }}
              />
            </button>
          </div>

          <div className="dropdowns">
            {auth.currentUser && (
              <div className="dropdown">
                <input type="checkbox" id="dropdown" />
                <label className="dropdown__face" htmlFor="dropdown">
                  <div className="dropdown__text">
                    <TiThMenu />
                  </div>
                </label>
                <ul className="dropdown__items">
                  <div>
                    <div className="parted5">
                      {auth.currentUser && (
                        <button onClick={logout}>
                          <TbLogout2 style={{ color: "#fff" }} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="parted2">
                      {auth.currentUser && (
                        <Link to="/posts" className="linkes">
                          <button>
                            <IoMdAdd
                              style={{
                                fontSize: "2.2vw",
                                marginRight: "1.8vw",
                                color: "#fff",
                              }}
                            />
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </ul>
              </div>
            )}
            <div className="svg">
              <svg>
                <filter id="goo">
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="10"
                    result="blur"
                  />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                    result="goo"
                  />
                  <feBlend in="SourceGraphic" in2="goo" />
                </filter>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <a className="scroll" href="#left">
        <div>
          <MdDoubleArrow style={{ rotate: "270deg" }} />
        </div>
      </a>
    </>
  );
};

export default Navbar;
