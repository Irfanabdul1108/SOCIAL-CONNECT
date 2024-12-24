import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Ap from './Components/Ap';
import Gp from './Components/Gp';
import Profile from './Components/Profile';
import Pd from './Components/Pd';
import Allusers from './Components/Allusers';
import Specific from './Components/Specific';
import Likes from './Components/Likes';
import Paired from './Components/Paired'; 
import EditPost from './Components/EditPost';
import './Components/styles/__colors.scss';

const App = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      <Navbar toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Gp />} />
        <Route path="/posts" element={<Ap />} />
        <Route path="/post/:id" element={<Pd />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<Allusers />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/profile/:userId" element={<Specific />} /> 
        <Route path="/likes" element={<Likes />} /> 
        <Route path="/paired" element={<Paired />} /> 
      </Routes>
    </Router>
  );
};

export default App;
