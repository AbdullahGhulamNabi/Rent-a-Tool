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



function Navbar({ isLoginClicked, openLoginModal, openSettingsModal, setIsLoginClicked }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLogoutClicked, setIsLogoutClicked] = useState(false);
  const [isAddUpdateOpen, setIsAddUpateOpen] = useState(false);


  const handleLogout = () => {
    setIsLogoutClicked(true);
    setIsLoginClicked(false);
  };

  const handleLogin = () => {
    setIsLogoutClicked(false); // Reset the logout state
    openLoginModal();
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
        <img src={home} alt="Home" className="h-7 w-7 mx-2" />
                    {/* <button onClick={openAddUpdateModal}>
            <img src={add} alt="Add Tools" className="h-7 w-7 mx-2" />
            </button> */}
        {isLoginClicked  ? (
          <>
            <img src={add} alt="Add Tools" className="h-7 w-7 mx-2" />
            <button onClick={openSettingsModal}>
              <img src={settings} alt="Settings" className="h-7 w-7 mx-2" />
            </button>
            <img src={person} alt="Login" className="h-10 w-11 mx-2 rounded-xl" />
            <button onClick={handleLogout}>
              <img src={logout} alt="LogOut" className="h-7 w-7 mx-2" />
            </button>
          </>
        ) : (
          <button onClick={handleLogin}>
            <img src={login} alt="Login" className="h-7 w-7 mx-2" />
          </button>
        )}
      </div>

      <div className="sm:hidden">
        <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="h-10 w-10 bg-gray-200 rounded-full">
          ☰
        </button>
      </div>

      {isDrawerOpen && (
        <div className="fixed top-0 bottom-0 left-0 w-64 h-screen bg-white flex flex-col p-4">
          <button onClick={() => setIsDrawerOpen(false)} className=" self-end mb-4 text-imageBG">✕</button>
          <img src={logo} alt="Logo" className="h-12 w-18 mb-6" />
          <div className="flex flex-col">
            <div className="flex items-center my-2">
              <img src={home} alt="Home" className="h-7 w-7 mr-4" />
              <span className="text-sm font-medium">Home</span>
            </div>
            {!isLoginClicked &&(
              <div onClick={handleLogin} className="flex items-center my-2">
                <img src={login} alt="Login" className="h-7 w-7 mr-4" />
                <span className="text-sm font-medium">Login</span>
              </div>
            )}
            {isLoginClicked && (
              <>
                  {/* <button onClick={openAddUpdateModal}> */}
                  <button >
                <div className="flex items-center my-2">
                  <img src={add} alt="Add Tools" className="h-7 w-7 mr-4" />
                  <span className="text-sm font-medium">Add Tools</span>
                </div>
                  </button>

                <div onClick={openSettingsModal} className="flex items-center my-2">
                  <img src={settings} alt="Settings" className="h-7 w-7 mr-4" />
                  <span className="text-sm font-medium">Settings</span>
                </div>
                <div className="flex items-center my-2">
                  <img src={person} alt="Profile" className="h-7 w-7 mr-4 rounded-full" />
                  <span className="text-sm font-medium">Profile</span>
                </div>
                <div onClick={handleLogout} className="flex items-center my-2">
                  <button className="flex items-center">
                    <img src={logout} alt="LogOut" className="h-7 w-7 mr-4" />
                    <span className="text-sm font-medium">Log Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
{/* 
      {isLoginOpen && <LoginModal onClose={closeModals} onSignUpClick={openSignUpModal} onLoginSuccess={handleLogin} />}
      {isSignUpOpen && <SignUpModal onClose={closeModals} onLoginClick={openLoginModal} />} */}
      {isAddUpdateOpen && <AddUpdateModal onClose={closeModals} />}
    </div>
  );
}

export default Navbar;
