import React, { useState, useEffect } from "react";
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
import ProfileModal from "../Dashboard/Profile";
import Add from "../Add-Update/AddUpdate";
import { UserContext } from "../../App";
import { useContext } from "react";
import { Api_Route } from "../../config";
// import { useSearch } from "../../SearchContext";
import { SearchContext } from "../../Context/SearchContext";

function Navbar({ isLoggedIn }) {
  const { setSearchTerm } = useContext(SearchContext);
  // const { state } = useContext(UserContext);
  const { state, dispatch } = useContext(UserContext);

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isSettingOpen, setSettingOpen] = useState(false);
  const [isAddToolOpen, setAddToolOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [image, setImage] = useState();
  const [rerender, setRerender] = useState(false);

  function handleLogout() {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("userState")
    dispatch({ type: "USER", payload: false });
    navigate("/", { replace: true });
  }

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      dispatch({ type: "USER", payload: false });
      window.history.pushState(null, "", window.location.href);
      window.history.replaceState(null, "", window.location.href);
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return;

    fetch(`${Api_Route}/dashboard/getProfilePhoto`, {
      headers: {
        Authorization: localStorage.getItem("jwt_token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.profilePhoto) {
          setImage(data.profilePhoto);
          console.log(data.profilePhoto + "Hello");
        }
      })
      .catch((error) => console.error("Error fetching image:", error));
  }, [state?.profileImage, state , rerender]);

  const updateRerender = () =>{
    setRerender(true)
  }
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

  const openProfileModal = () => {
    setProfileOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeProfileModal = () => {
    setProfileOpen(false);
    document.body.style.overflow = "auto";
  };

  function OpenRequests() {
    navigate("/Dashboard/Listing");
  }

  function Dashboard() {
    navigate("/Dashboard");
  }

  function HomePage() {
    navigate("/");
  }
  //const { setSearchTerm } = useSearch(); // Assuming you have a context or state management for search term
  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     const value = e.target.value.trim();
  //     if (!value) {
  //       setSearchTerm(""); // Set searchTerm to empty string when the input is cleared
  //     } else {
  //       setSearchTerm(value); // Update the global state with the search term
  //     }
  //   }
  // };
  const handleSearchChange = (e) => {
    const value = e.target.value.trim();
    setSearchTerm(value);  // Update the global state with the search term
    setSearchQuery(value)
  };

  return (
    <div className="flex items-center justify-around h-[64px] bg-nav text-black sticky top-0 z-20">
      <button onClick={Dashboard}>
        <img src={logo} alt="Logo" className="h-12 w-18" />
      </button>

      <input
        type="search"
        placeholder="Search..."
        // onChange={(e) => setSearchQuery(e.target.value)}
        // onKeyDown={handleKeyDown}
        onChange={handleSearchChange}
        className="md:w-[400px] sm:w-[300px] w-[200px] h-[45px] px-4 py-2 bg-white text-gray-400 placeholder-gray-400 border-2 border-slate-600 rounded-full"
      />

      <div className="hidden sm:flex items-center">
        {/* <button onClick={Dashboard}>
          <img src={home} alt="Home" className="h-7 w-7 mx-2" />
        </button> */}

        {state ? (
          <>
            <button onClick={Dashboard}>
              <img src={home} alt="Home" className="h-7 w-7 mx-2" />
            </button>
          </>
        ) : (
          <button onClick={HomePage}>
            <img src={home} alt="Home" className="h-7 w-7 mx-2" />
          </button>
        )}

        {state ? (
          <>
            <button onClick={openAddToolModal}>
              <img src={add} alt="Add" className="h-7 w-7 mx-2" />
            </button>
            <button onClick={OpenRequests}>
              <img src={message} alt="Requests" className="h-7 w-7 mx-2" />
            </button>
            <button onClick={openSettingModal}>
              <img src={settings} alt="Settings" className="h-7 w-7 mx-2" />
            </button>
            <button onClick={openProfileModal}>
              <img
                src={`${Api_Route}/Images/${image}`}
                alt="Profile"
                className="h-7 w-7 mx-2 rounded-full"
              />
            </button>
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

      <button
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="sm:hidden h-10 w-10 bg-gray-200 rounded-full"
      >
        ☰
      </button>

      {isDrawerOpen && (
        <div className="fixed top-0 bottom-0 left-0 w-40 h-screen bg-white flex flex-col p-4 shadow-lg text-black text-xl hover:text-black focus:outline-none">
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="self-end mb-4 text-black text-xl"
          >
            ✖
          </button>

          <img src={logo} alt="Logo" className="h-12 w-18 mb-6 self-center" />

          <div className="space-y-4">
            {state ? (
              <>
                <button
                  onClick={Dashboard}
                  className="flex items-center space-x-4 w-full text-left text-gray-700"
                >
                  <img src={home} alt="Home" className="h-7 w-7" />
                  <span>Home</span>
                </button>
              </>
            ) : (
              <button onClick={HomePage} className="flex items-center space-x-4 w-full text-left text-gray-700">
                <img src={home} alt="Home" className="h-7 w-7" />
                <span>Home</span>
              </button>
            )}

            {state ? (
              <>
                <button
                  onClick={openAddToolModal}
                  className="flex items-center space-x-4 w-full text-left text-gray-700"
                >
                  <img src={add} alt="Add Tools" className="h-7 w-7" />
                  <span>Add Tool</span>
                </button>

                <button
                  onClick={OpenRequests}
                  className="flex items-center space-x-4 w-full text-left text-gray-700 "
                >
                  <img src={message} alt="Requests" className="h-7 w-7" />
                  <span>Requests</span>
                </button>

                <button
                  onClick={openSettingModal}
                  className="flex items-center space-x-4 w-full text-left text-gray-700 "
                >
                  <img src={settings} alt="Settings" className="h-7 w-7" />
                  <span>Settings</span>
                </button>

                <button
                  onClick={openProfileModal}
                  className="flex items-center space-x-4 w-full text-left text-gray-700"
                >
                  <img
                    src={`${Api_Route}/Images/${image}`}
                    alt="Profile"
                    className="h-7 w-7  rounded-full"
                  />
                  <span>Profile</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-4 w-full text-left text-gray-700"
                >
                  <img src={logout} alt="LogOut" className="h-7 w-7" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={openLoginModal}
                className="flex items-center space-x-4 w-full text-left text-gray-700 "
              >
                <img src={login} alt="Login" className="h-7 w-7" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      )}

      {isLoginOpen && (
        <LoginModal onClose={closeModals} onSignUpClick={openSignUpModal} />
      )}
      {isSignUpOpen && (
        <SignUpModal onClose={closeModals} onLoginClick={openLoginModal} />
      )}
      {isSettingOpen && <Settings onClose={closeSettingModal} />}
      {isAddToolOpen && <Add onClose={closeAddToolModal} />}
      {isProfileOpen && <ProfileModal updateRerender={updateRerender} onClose={closeProfileModal} />}
    </div>
  );
}

export default Navbar;
