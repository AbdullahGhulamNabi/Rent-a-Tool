import React from "react";
import HomePage from "../../assets/Home/HomePage.png";
import HomePageOffset from "../../assets/Home/HomePage-80.png";
import logo from "../../assets/Home/logo.png";
import SettingsModal from "../Dashboard/Modal";
import LoginModal from "../Login and Sign Up/Login";
import SignUpModal from "../Login and Sign Up/SignUp";
import Navbar from "../Nav and Footer/Navbar";
// import SettingsModal from "../Dashboard/Modal";

export default function DashBoard() {
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = React.useState(false);
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

 

  const openSettingsModal = () => {
    setIsSettingsOpen(true);
    document.body.style.overflow = "hidden";
  };

  return (
    <div>
      <Navbar
        isLoginClicked={true}
        openLoginModal={openLoginModal}
        openSettingsModal={openSettingsModal}
      />



      {isSettingsOpen && <SettingsModal onClose={closeModals} />}
    </div>
  );
}
