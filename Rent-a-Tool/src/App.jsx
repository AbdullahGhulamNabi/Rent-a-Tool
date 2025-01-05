import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Nav and Footer/Navbar';
import Footer from './components/Nav and Footer/Footer';
import LoginModal from "./components/Login and Sign Up/Login";
import SignUpModal from "./components/Login and Sign Up/SignUp";
import Home from './components/HomePage/Home';
import Tools from './components/HomePage/Tools';
import DashBoard from './components/Dashboard/Dashboard';
import MyTools from './components/Dashboard/MyTools';
import SettingsModal from "./components/Dashboard/Modal";
import FeedBackPage from "./components/FeedBack and Help/FeedbackPage"
import Help from "./components/FeedBack and Help/Help"
import Listing from "./components/FeedBack and Help/Listing"
import ToolDescription from "./components/Tool-Description/ToolDetail"

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoginClicked, setIsLoginClicked] = useState(false);

  const openLoginModal = () => {
    setIsLoginOpen(true);
    setIsSignUpOpen(false);
    document.body.style.overflow = "hidden";
  };

  const openSignUpModal = () => {
    setIsSignUpOpen(true);
    setIsLoginOpen(false);
    document.body.style.overflow = "hidden";
  };

  const closeModals = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(false);
    setIsSettingsOpen(false);
    document.body.style.overflow = "auto";
  };

  const openSettingsModal = () => {
    setIsSettingsOpen(true);
    document.body.style.overflow = "hidden";
  };

  return (
    <>
      <Navbar
        isLoginClicked={isLoginClicked}
        openLoginModal={openLoginModal}
        openSettingsModal={openSettingsModal}
        setIsLoginClicked={setIsLoginClicked}
      />

      {isLoginClicked ? <DashBoard /> : <Home openLoginModal={openLoginModal} />}
      {isLoginClicked ? <MyTools /> : <Tools />}



      {isLoginOpen && (
        <LoginModal
          onClose={closeModals}
          onSignUpClick={openSignUpModal}
          goToDashboard={() => {
            setIsLoginClicked(true);
            closeModals();
          }}
        />
      )}

      {isSignUpOpen && (
        <SignUpModal
          onClose={closeModals}
          onLoginClick={openLoginModal}
        />
      )}

      {isSettingsOpen && <SettingsModal onClose={closeModals} />}
    </>
  );
}

export default App;
