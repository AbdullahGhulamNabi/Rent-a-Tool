import React from "react";
import HomePage from "../../assets/Home/HomePage.png";
import HomePageOffset from "../../assets/Home/HomePage-80.png";
import logo from "../../assets/Home/logo.png";
import LoginModal from "../Login and Sign Up/Login";
import SignUpModal from "../Login and Sign Up/SignUp";
import Navbar from "../Nav and Footer/Navbar";
import SettingsModal from "../Dashboard/Modal";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = React.useState(false);
  // const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  // const [isLoginClicked, setIsLoginClicked] = React.useState(false);

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

  // const goToDashboard = () => {
  //   setIsLoginClicked(true);
  //   closeModals();
  // };

  // const openSettingsModal = () => {
  //   setIsSettingsOpen(true);
  //   document.body.style.overflow = "hidden";
  // };

  return (
    <div>
      {/* <Navbar
        isLoginClicked={isLoginClicked}
        openLoginModal={openLoginModal}
        openSettingsModal={openSettingsModal}
      /> */}

      <div className="bg-imageBG h-[450px] w-[95%] m-[auto] mt-7 rounded-[30px] flex justify-around items-center relative">
        <img src={HomePage} alt="HomePage" className="hidden md:w-[500px] md:h-[400px] md:block" />
        <img src={HomePageOffset} alt="HomePage" className="md:hidden absolute inset-0 m-auto h-[400px] w-[500px]" />
        <div className="w-[500px] flex flex-col justify-center items-center z-10">
          <img src={logo} alt="Logo" className="md:w-[130px] md:h-[100px] w-[150px] h-[120px] mb-5" />
          <div className="my-1 text-HomeText lg:text-lg md:text-xs sm:text-lg sm:font-medium text-xs font-medium">
            Find the tools you need, right in your neighborhood
          </div>
          <div className="my-1 text-HomeText lg:text-lg md:text-xs sm:text-lg sm:font-medium text-xs font-medium">
            Rent. Share. Build together.
          </div>
          <button
            onClick={openLoginModal}
            className="my-1 bg-HomeText lg:px-7 md:px-5 px-8 lg:py-3 md:py-2 py-3 rounded-[10px] text-white font-medium"
          >
            Login
          </button>
        </div>
      </div>

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
      {/* {isSettingsOpen && <SettingsModal onClose={closeModals} />} */}
    </div>
  );
}
