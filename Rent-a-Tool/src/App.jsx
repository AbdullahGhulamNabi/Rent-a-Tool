import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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
import ToolDetail from './components/Tool-Description/ToolDetail';
import AddUpdate from './components/Add-Update/AddUpdate';
import ChatInterface from './components/Chat-Module/ChatInterface';
import SignUp from './components/Login and Sign Up/SignUp';

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

      {/* Arslan code */}
      {/* <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<DashBoard />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/add_tool' element={<AddUpdate/>} />
        <Route path='/tooldetail' element={<ToolDetail/>} />
        <Route path='/chat' element={<ChatInterface/>} />
      </Routes>
      <Footer /> */}

      {isLoginClicked ? <DashBoard /> : <Home openLoginModal={openLoginModal} />}
      {isLoginClicked ? <MyTools /> : <Tools />}
      <Footer />



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
