import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Nav and Footer/Navbar';
import Footer from './components/Nav and Footer/Footer';
import Home from './components/HomePage/Home';
import DashBoard from './components/Dashboard/Dashboard';
import Tools from './components/HomePage/Tools';
import LoginModal from "./components/Login and Sign Up/Login";
import SignUpModal from "./components/Login and Sign Up/SignUp";
import SettingsModal from "./components/Dashboard/Modal";
import MyTools from './components/Dashboard/MyTools';
import Listing from './components/FeedBack and Help/Listing'
import Help from './components/FeedBack and Help/Help'
import FeedbackPage from './components/FeedBack and Help/FeedbackPage';

function App() {
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isLoginClicked, setIsLoginClicked] = React.useState(false);

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
      />

      {isLoginClicked?(<DashBoard/>):(<Home/>)}

      {isLoginClicked?(<MyTools/>):(<Tools/>)}

      {/* <Listing/>
      <FeedbackPage/> */}
      {/* <Help/> */}

      <Footer/>

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
