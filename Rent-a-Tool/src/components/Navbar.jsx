import React from "react";
import "./Navbar.css";
import logo from "../assets/Nav/logo.png";
import home from "../assets/Nav/home.png";
import add from "../assets/Nav/more.png";
import message from "../assets/Nav/message.png";
import settings from "../assets/Nav/settings.png";
import login from "../assets/Nav/user.png";
import logout from "../assets/Nav/logout.png";
import Listing from "./Listing";

function Navbar() {
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
          className="md:w-[400px] sm:w-[300px] w-[200px] h-[45px] px-4 py-2 bg-white text-gray-400 placeholder-gray-400 border-2 border-slate-600 border-solid rounded-full focus:outline-none focus:ring-0"
        />
      </div>

      <div className="hidden sm:flex flex-row items-center justify-end">
        <img src={home} alt="Home" className="h-7 w-7 mx-2" />
        <img src={add} alt="Add Tools" className="h-7 w-7 mx-2" />
         {/* {<img src={message} alt="Requests" className="h-7 w-7 mx-2 "/> */} 
        {/* <img src={settings} alt="settings" className="h-7 w-7 mx-2" /> */}
        <img src={login} alt="Login" className="h-7 w-7 mx-2" />
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
            <div className="flex items-center my-2">
              <img src={login} alt="Login" className="h-7 w-7 mr-4" />
              <span className="text-sm font-medium">Login</span>
            </div>
            
            <div className="flex items-center my-2">
              <img src={add} alt="Add Tools" className="h-7 w-7 mr-4" />
              <span className="text-sm font-medium">Add Tools</span>
            </div>
            {/* <div className="flex items-center my-2">
              <img src={message} alt="Requests" className="h-7 w-7 mr-4" />
              <span className="text-sm font-medium">Requests</span>
            </div> */}
            {/* <div className="flex items-center my-2">
              <img src={settings} alt="Settings" className="h-7 w-7 mr-4" />
              <span className="text-sm font-medium">Settings</span>
            </div> */}
            {/* <div className="flex items-center my-2">
              <img src={logout} alt="LogOut" className="h-7 w-7 mr-4" />
              <span className="text-sm font-medium">Log Out</span>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
