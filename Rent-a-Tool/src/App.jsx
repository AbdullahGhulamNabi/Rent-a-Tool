import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Nav and Footer/Navbar';
import Footer from './components/Nav and Footer/Footer';
import Home from './components/HomePage/Home';
import DashBoard from './components/Dashboard/Dashboard';
import Tools from './components/HomePage/Tools';

function App() {
  const [isLoginClicked, setIsLoginClicked] = useState(false); // Tracks login state
  const [isLoginOpen, setIsLoginOpen] = useState(false); // Tracks login modal state

  const openLoginModal = () => {
    setIsLoginOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginOpen(false);
  };

  const handleLogin = () => {
    setIsLoginClicked(true); // Update login state
    closeLoginModal(); // Close modal
  };

  return (
    <div className="App">
      <Home/>
      <Tools/>
      <Footer/>
    </div>
  );
}

export default App;
