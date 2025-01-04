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

function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = React.useState(false);
  const [isLoginClicked, setIsLoginClicked] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

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

  const goToDashboard = () => {
    setIsLoginClicked(true);
    setIsLoginOpen(false);
  };

  const openSettingsModal = () => {
    setIsSettingsOpen(true);
    document.body.style.overflow = "hidden";
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
            <img src={message} alt="Requests" className="h-7 w-7 mx-2" />
            <button onClick={openSettingsModal}>
              <img src={settings} alt="Settings" className="h-7 w-7 mx-2" />
            </button>
            <img src={logout} alt="LogOut" className="h-7 w-7 mx-2" />
          </>
        ) : (
          <button onClick={openLoginModal}>
            <img src={login} alt="Login" className="h-7 w-7 mx-2" />
          </button>
        )}
      </div>

      {isLoginOpen && <LoginModal onClose={closeModals} onSignUpClick={openSignUpModal} goToDashboard={goToDashboard} />}
      {isSignUpOpen && <SignUpModal onClose={closeModals} onLoginClick={openLoginModal} />}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[380px] relative">
            <button
              onClick={closeModals}
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <ul>
              <li className="mb-2">Account Settings</li>
              <li className="mb-2">Notifications</li>
              <li className="mb-2">Privacy</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;



