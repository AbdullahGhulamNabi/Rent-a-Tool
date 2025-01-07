import React from "react";
import logo from "../../assets/Nav/logo.png";
import home from "../../assets/Nav/home.png";
import add from "../../assets/Nav/more.png";
import message from "../../assets/Nav/message.png";
import settings from "../../assets/Nav/settings.png";
import login from "../../assets/Nav/user.png";
import logout from "../../assets/Nav/logout.png";
import LoginModal from "../Login and Sign Up/Login";
import SignUpModal from "../Login and Sign Up/SignUp";
import Profile from "../../assets/ToolDetail/profile.jpeg";
import Settings from "../Dashboard/Modal";
import Add from "../Add-Update/AddUpdate";
import { useNavigate} from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";

function NavbarForLoggedIn() {
  const [isSettingOpen, setSettingOpen] = React.useState(false);
  const [isAddToolOpen, setAddToolOpen] = React.useState(false);

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

  const navigate = useNavigate()

  function handleClick(){
    navigate('/Dashboard/Listing')
  }

  function Dashboard(){
    navigate('/Dashboard')
  }

  function handleLogout(){
    navigate('/')
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
          className="md:w-[400px] sm:w-[300px] w-[200px] h-[45px] px-4 py-2 bg-white text-gray-400 placeholder-gray-400 border-2 border-slate-600 border-solid rounded-full focus:outline-none focus:ring-0"
        />
      </div>

      <div className="hidden sm:flex flex-row items-center justify-end">
        <button onClick={Dashboard}>
        <img src={home} alt="Home" className="h-7 w-7 mx-2" />
        </button>
        <button onClick={openAddToolModal}>
          <img src={add} alt="Add Tools" className="h-7 w-7 mx-2" />
        </button>

        <button onClick={handleClick}>
          <img src={message} alt="Requests" className="h-7 w-7 mx-2" />
        </button>

        <button onClick={openSettingModal}>
          <img src={settings} alt="settings" className="h-7 w-7 mx-2" />
        </button>

        <img
          src={Profile}
          alt="Profile"
          className="h-7 w-7 mx-2 rounded-full"
        />
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
          <button onClick={Dashboard}>
            <div className="flex items-center my-2">
              <img src={home} alt="Home" className="h-7 w-7 mr-4" />
              <span className="text-sm font-medium">Home</span>
            </div>
            </button>

            <button onClick={openAddToolModal}>
              <div className="flex items-center my-2">
                <img src={add} alt="Add Tools" className="h-7 w-7 mr-4" />
                <span className="text-sm font-medium">Add Tools</span>
              </div>
            </button>

            <div className="flex items-center my-2">
              <img src={message} alt="Requests" className="h-7 w-7 mr-4" />
              <span className="text-sm font-medium">Requests</span>
            </div>

            <button onClick={openSettingModal}>
              <div className="flex items-center my-2">
                <img src={settings} alt="Settings" className="h-7 w-7 mr-4" />
                <span className="text-sm font-medium">Settings</span>
              </div>
            </button>
            <button onClick={handleLogout}>
            <div className="flex items-center my-2">
              <img src={logout} alt="LogOut" className="h-7 w-7 mr-4" />
              <span className="text-sm font-medium">Log Out</span>
            </div>
            </button>
          </div>
        </div>
      )}
      {isSettingOpen && <Settings onClose={closeSettingModal} />}
      {isAddToolOpen && <Add onClose={closeAddToolModal} />}
    </div>
  );
}

export default NavbarForLoggedIn;
