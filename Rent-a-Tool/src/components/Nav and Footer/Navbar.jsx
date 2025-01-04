import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/Nav/logo.png";
import home from "../../assets/Nav/home.png";
import add from "../../assets/Nav/more.png";
import message from "../../assets/Nav/message.png";
import settings from "../../assets/Nav/settings.png";
import login from "../../assets/Nav/user.png";
import logout from "../../assets/Nav/logout.png";
import LoginModal from "../Login and Sign Up/Login";
import SignUpModal from "../Login and Sign Up/SignUp";
import AddUpdateModal from '../Add-Update/AddUpdate'



function Navbar({ onImageClick }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddUpdateOpen, setIsAddUpateOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // Track login status

  const openLoginModal = () => {
    setIsLoginOpen(true);
    setIsSignUpOpen(false); // Close SignUp modal if open
    document.body.style.overflow = "hidden";
  };

  const openSignUpModal = () => {
    setIsSignUpOpen(true);
    setIsLoginOpen(false); // Close Login modal if open
    document.body.style.overflow = "hidden";
  };

  const openAddUpdateModal = () =>{
     setIsAddUpateOpen(true);
     setIsLoginOpen(false);
     setIsSignUpOpen(false);
    document.body.style.overflow = "hidden";

  };

  const closeModals = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(false);
    setIsAddUpateOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleLogin = () => {
    setLoggedIn(true); // Set user as logged in
    closeModals();
  };

  const handleLogout = () => {
    setLoggedIn(false); // Set user as logged out
  };

  return (
    <div className="flex items-center justify-around h-[64px] bg-nav text-black sticky top-0 z-20">
      <div>
        <img src={logo} alt="Logo" className="h-12 w-18" />
      </div>

      <div>
        <input
          type="search"
          placeholder="Search..."
          className="md:w-[400px] sm:w-[300px] w-[200px] h-[45px] px-4 py-2 bg-white text-gray-400 placeholder-gray-400 border-2 border-slate-600 border-solid rounded-full focus:outline-none focus:ring-0"
        />
      </div>

      <div className="hidden sm:flex flex-row items-center justify-end">
        <NavLink to="/">
          <img src={home} alt="Home" className="h-7 w-7 mx-2" />
        </NavLink>

        {loggedIn ? (
          <> 
            <button onClick={openAddUpdateModal}>
            <img src={add} alt="Add Tools" className="h-7 w-7 mx-2" />
            </button>
            <img src={message} alt="Requests" className="h-7 w-7 mx-2" />
            <img src={settings} onClick={onImageClick} className="cursor-pointer h-7 w-7 mx-2" alt="settings" />
            <button onClick={handleLogout}>
              <img src={logout} alt="Logout" className="h-7 w-7 mx-2" />
            </button>
          </>
        ) : (
          <button onClick={openLoginModal}>
            <img src={login} alt="Login" className="h-7 w-7 mx-2" />
          </button>
        )}
      </div>

      <div className="sm:hidden">
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="h-10 w-10 bg-gray-200 rounded-full"
        >
          ☰
        </button>
      </div>

      {isDrawerOpen && (
        <div className="fixed top-0 bottom-0 left-0 w-64 h-screen bg-white flex flex-col p-4">
          <button onClick={() => setIsDrawerOpen(false)} className="self-end mb-4 text-black">
            ✖
          </button>

          <div className="mb-6">
            <img src={logo} alt="Logo" className="h-12 w-18 mr-4" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center my-2">
              <img src={home} alt="Home" className="h-7 w-7 mr-4" />
              <span className="text-sm font-medium">Home</span>
            </div>

            {loggedIn ? (
              <>
                  <button onClick={openAddUpdateModal}>
                <div className="flex items-center my-2">
                  <img src={add} alt="Add Tools" className="h-7 w-7 mr-4" />
                  <span className="text-sm font-medium">Add Tools</span>
                </div>
                  </button>
                <div className="flex items-center my-2">
                  <img src={message} alt="Requests" className="h-7 w-7 mr-4" />
                  <span className="text-sm font-medium">Requests</span>
                </div>
                <div className="flex items-center my-2">
                  <img src={settings} alt="Settings" onClick={onImageClick} className="cursor-pointer h-7 w-7 mr-4" />
                  <span className="text-sm font-medium">Settings</span>
                </div>
                <div className="flex items-center my-2">
                  <img src={logout} alt="LogOut" className="h-7 w-7 mr-4" />
                  <span className="text-sm font-medium" onClick={handleLogout}>
                    Log Out
                  </span>
                </div>
              </>
            ) : (
              <button onClick={openLoginModal} className="flex items-center my-2">
                <img src={login} alt="Login" className="h-7 w-7 mr-4" />
                <span className="text-sm font-medium">Login</span>
              </button>
            )}
          </div>
        </div>
      )}

      {isLoginOpen && <LoginModal onClose={closeModals} onSignUpClick={openSignUpModal} onLoginSuccess={handleLogin} />}
      {isSignUpOpen && <SignUpModal onClose={closeModals} onLoginClick={openLoginModal} />}
      {isAddUpdateOpen && <AddUpdateModal onClose={closeModals} />}
    </div>
  );
}

export default Navbar;
