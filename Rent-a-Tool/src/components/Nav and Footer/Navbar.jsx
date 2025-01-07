import React, { useState } from "react";
import logo from "../../assets/Nav/logo.png";
import home from "../../assets/Nav/home.png";
import add from "../../assets/Nav/more.png";
import person from "../../assets/Tools/Person.jpg";
import settings from "../../assets/Nav/settings.png";
import login from "../../assets/Nav/user.png";
import logout from "../../assets/Nav/logout.png";
import LoginModal from "../Login and Sign Up/Login";
import SignUpModal from "../Login and Sign Up/SignUp";
import AddUpdateModal from '../Add-Update/AddUpdate'
import { useNavigate } from "react-router-dom";



function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = React.useState(false);
  
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
  
    const closeModals = () => {
      setIsLoginOpen(false);
      setIsSignUpOpen(false);
      document.body.style.overflow = "auto";
    };
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = React.useState("");
    
      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          navigate('/Tools');
        }
      }
  
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  return (
    <div className="flex items-center justify-around h-[64px] bg-nav text-black sticky top-0 z-20">
      <div className="">
        <img src={logo} alt="Logo" className="h-12 w-18 " />
      </div>

      <div className="">
        <input
          type="search"
          placeholder="Search..."
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="md:w-[400px] sm:w-[300px] w-[200px] h-[45px] px-4 py-2 bg-white text-gray-400 placeholder-gray-400 border-2 border-slate-600 border-solid rounded-full focus:outline-none focus:ring-0"
        />
      </div>

      <div className="hidden sm:flex flex-row items-center justify-end">
        <img src={home} alt="Home" className="h-7 w-7 mx-2" />
        <button onClick={openLoginModal}><img src={login} alt="Login" className="h-7 w-7 mx-2" /></button>
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
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="self-end mb-4 text-black"
          >
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
            <button onClick={openLoginModal} className="flex items-center my-2">
              <img src={login} alt="Login" className="h-7 w-7 mr-4" />
              <span className="text-sm font-medium">Login</span>
            </button>
          </div>
        </div>
      )}
      {isLoginOpen && <LoginModal onClose={closeModals} onSignUpClick={openSignUpModal} />}
      {isSignUpOpen && <SignUpModal onClose={closeModals} onLoginClick={openLoginModal} />}
    </div>
  );
}

export default Navbar;
