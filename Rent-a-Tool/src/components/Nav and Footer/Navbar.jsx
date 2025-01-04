import React from "react";
import { useState } from "react";
import logo from "../../assets/Nav/logo.png";
import home from "../../assets/Nav/home.png";
import add from "../../assets/Nav/more.png";
import person from "../../assets/Tools/Person.jpg";
import settings from "../../assets/Nav/settings.png";
import login from "../../assets/Nav/user.png";
import logout from "../../assets/Nav/logout.png";

function Navbar({ isLoginClicked, openLoginModal, openSettingsModal }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = () => {
    alert("clicked");
    isLoginClicked = false;
  };

  return (
    <div className="flex items-center justify-around h-[64px] bg-nav text-black sticky top-0 z-20">
      <div>
        <img src={logo} alt="Logo" className="h-12 w-18 " />
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

        {isLoginClicked ? (
          <>
            <img src={add} alt="Add Tools" className="h-7 w-7 mx-2" />
            {/* <img src={message} alt="Requests" className="h-7 w-7 mx-2" /> */}
            <button onClick={openSettingsModal}>
              <img src={settings} alt="Settings" className="h-7 w-7 mx-2" />
            </button>

            <img  src={person} alt="Login" className="h-10 w-11 mx-2 rounded-xl" />

            <button onClick={handleLogout}>
              <img src={logout} alt="LogOut" className="h-7 w-7 mx-2" />
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

            {!isLoginClicked && (
              <div className="flex items-center my-2">
                <img
                  onClick={openLoginModal}
                  src={login}
                  alt="Login"
                  className="h-7 w-7 mr-4"
                />
                <span className="text-sm font-medium">Login</span>
              </div>
            )}

            {isLoginClicked && (
              <>
                <div className="flex items-center my-2">
                  <img src={add} alt="Add Tools" className="h-7 w-7 mr-4" />
                  <span className="text-sm font-medium">Add Tools</span>
                </div>

                <div className="flex items-center my-2">
                  <img
                    onClick={openSettingsModal}
                    src={settings}
                    alt="Settings"
                    className="h-7 w-7 mx-1"
                  />
                  <span className="text-sm font-medium">Settings</span>
                </div>

                <div className="flex items-center my-2">
                  <button onClick={handleLogout} className="flex items-center">
                    <img src={logout} alt="LogOut" className="h-7 w-7 mr-4" />
                    <span className="text-sm font-medium">Log Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
