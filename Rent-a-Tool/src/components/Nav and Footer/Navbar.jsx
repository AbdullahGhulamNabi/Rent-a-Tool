import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Nav/logo.png";
import home from "../../assets/Nav/home.png";
import add from "../../assets/Nav/more.png";
import message from "../../assets/Nav/message.png";
import settings from "../../assets/Nav/settings.png";
import login from "../../assets/Nav/user.png";
import logout from "../../assets/Nav/logout.png";
import Profile from "../../assets/ToolDetail/profile.jpeg";
import LoginModal from "../Login and Sign Up/Login";
import SignUpModal from "../Login and Sign Up/SignUp";
import Settings from "../Dashboard/Modal";
import Add from "../Add-Update/AddUpdate";

function Navbar({ isLoggedIn, handleLogout}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isSettingOpen, setSettingOpen] = useState(false);
  const [isAddToolOpen, setAddToolOpen] = useState(false);

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
    document.body.style.overflow = "auto";
  };

  const openSettingModal = () => {
    setSettingOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeSettingModal = () => {
    setSettingOpen(false);
    document.body.style.overflow = "auto";
  };

  const openAddToolModal = () => {
    setAddToolOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeAddToolModal = () => {
    setAddToolOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate(isLoggedIn ? '/Dashboard/Tools' : '/Tools');
    }
  };

  return (
    <div className="flex items-center justify-around h-[64px] bg-nav text-black sticky top-0 z-20">
      <img src={logo} alt="Logo" className="h-12 w-18" />

      <input
        type="search"
        placeholder="Search..."
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="md:w-[400px] sm:w-[300px] w-[200px] h-[45px] px-4 py-2 bg-white text-gray-400 placeholder-gray-400 border-2 border-slate-600 rounded-full"
      />

      <div className="hidden sm:flex items-center">
        <img src={home} alt="Home" className="h-7 w-7 mx-2" />
        {isLoggedIn ? (
          <>
            <button onClick={openAddToolModal}><img src={add} alt="Add" className="h-7 w-7 mx-2" /></button>
            <button><img src={message} alt="Requests" className="h-7 w-7 mx-2" /></button>
            <button onClick={openSettingModal}><img src={settings} alt="Settings" className="h-7 w-7 mx-2" /></button>
            <img src={Profile} alt="Profile" className="h-7 w-7 mx-2 rounded-full" />
            <button onClick={()=>{
                console.log("Logout")
                handleLogout();
                console.log("Logout")
              }}><img src={logout} alt="Logout" className="h-7 w-7 mx-2" /></button>
          </>
        ) : (
          <button onClick={openLoginModal}><img src={login} alt="Login" className="h-7 w-7 mx-2" /></button>
        )}
      </div>

      <button
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="sm:hidden h-10 w-10 bg-gray-200 rounded-full"
      >☰</button>

      {isDrawerOpen && (
        <div className="fixed top-0 bottom-0 left-0 w-64 h-screen bg-white flex flex-col p-4">
          <button onClick={() => setIsDrawerOpen(false)} className="self-end mb-4 text-black">✖</button>
          <img src={logo} alt="Logo" className="h-12 w-18 mb-6" />
          <img src={home} alt="Home" className="h-7 w-7 mr-4" />
          {isLoggedIn ? (
            <>
              <button onClick={openAddToolModal}><img src={add} alt="Add Tools" className="h-7 w-7 mr-4" /></button>
              <img src={message} alt="Requests" className="h-7 w-7 mr-4" />
              <button onClick={openSettingModal}><img src={settings} alt="Settings" className="h-7 w-7 mr-4" /></button>
              <button onClick={()=>{
                console.log("Logout")
                handleLogout();
                console.log("Logout")
              }}><img src={logout} alt="LogOut" className="h-7 w-7 mr-4" /></button>
            </>
          ) : (
            <button onClick={openLoginModal}><img src={login} alt="Login" className="h-7 w-7 mr-4" /></button>
          )}
        </div>
      )}

      {isLoginOpen && <LoginModal onClose={closeModals} onSignUpClick={openSignUpModal} />}
      {isSignUpOpen && <SignUpModal onClose={closeModals} onLoginClick={openLoginModal} />}
      {isSettingOpen && <Settings onClose={closeSettingModal} />}
      {isAddToolOpen && <Add onClose={closeAddToolModal} />}
    </div>
  );
}

export default Navbar;
