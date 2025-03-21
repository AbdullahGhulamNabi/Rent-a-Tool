import React, { useState,useContext, useEffect } from "react";
import {Api_Route} from '../../config'
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

export default function Modal({ onClose }) {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [isSettingOpen, setSettingOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({
    email: false,
    web: true,
  });


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userPhone: "",
    userPostalCode: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword:"",
    newPassword:"",
    confirmedNewPassword:"",
  });


  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      dispatch({ type: "USER", payload: false });
      window.history.pushState(null, "", window.location.href);
      window.history.replaceState(null, "", window.location.href);
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const closeSettingModal = () => {
    setSettingOpen(false);
    document.body.style.overflow = "auto";
  };

  const openSubModal = (type) => {
    setActiveModal(type);
  };

  const closeSubModal = () => {
    setActiveModal(null);
  };
  
  function handleLogout() {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("userState")
    dispatch({ type: "USER", payload: false });
    navigate("/", { replace: true });
  }

  const handleProfileInfoChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  async function savePersonalInfo() {
    try {
      const response = await fetch(
        `${Api_Route}/dashboard/Settings/savePersonalInfo`,
        {
          method: "PATCH",
          headers: {
            Authorization: localStorage.getItem("jwt_token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      
      closeSubModal(); 
      if (response.ok) {
        console.log("Profile updated successfully");
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }


  async function updatePassword() {
    try {
      const response = await fetch(
        `${Api_Route}/dashboard/Settings/updatePassword`,
        {
          method: "PATCH",
          headers: {
            Authorization: localStorage.getItem("jwt_token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(passwordData),
        }
      );
      
      closeSubModal(); 
      closeSettingModal();
      onClose();
      if (response.ok) {
        handleLogout();
        console.log("Password updated successfully");
      } else {
        console.error("Failed to update Password");
      }
    } catch (error) {
      console.error("Error updating Password:", error);
    }
  }




  const handleNotificationChange = async (type) => {
    const newNotifications = {
      ...notifications,
      [type]: !notifications[type],
    };
    setNotifications(newNotifications);

    if (type === 'email') {
      try {
        const response = await fetch(`${Api_Route}/dashboard/settings/saveNotificationPreferences`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("jwt_token")
          },
          body: JSON.stringify({
            emailNotifications: newNotifications.email
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save notification preferences');
        }
      } catch (error) {
        console.error('Error saving notification preferences:', error);
        // Revert the state if save failed
        setNotifications(notifications);
      }
    }
  };

  const renderSubModal = () => {
    const commonModalClasses =
      "bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative";
    return (
      <div className={commonModalClasses}>
        <button
          onClick={closeSubModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        {activeModal === "account" && (
          <>
            <h3 className="text-lg font-semibold mb-4">Personal Information Settings</h3>
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-gray-700 mb-1 font-medium"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleProfileInfoChange}
                placeholder="Enter your updated First Name"
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:bg-nav focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-gray-700 mb-1 font-medium"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleProfileInfoChange}
                placeholder="Enter your updated Last Name"
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:bg-nav focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="userPhone"
                className="block text-gray-700 mb-1 font-medium"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="userPhone"
                name="userPhone"
                value={formData.userPhone}
                onChange={handleProfileInfoChange}
                placeholder="Enter your updated Phone Number"
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:bg-nav focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="userPostalCode"
                className="block text-gray-700 mb-1 font-medium"
              >
                Postal Code
              </label>
              <input
                type="text"
                id="userPostalCode"
                name="userPostalCode"
                value={formData.userPostalCode}
                onChange={handleProfileInfoChange}
                placeholder="Enter your updated Postal Code"
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:bg-nav focus:outline-none"
              />
            </div>

            <button
              onClick={savePersonalInfo}
              className="w-full bg-imageBG text-black px-4 py-2 rounded-md hover:bg-nav transition"
            >
              Save Changes
            </button>
          </>
        )}

        {activeModal === "notifications" && (
          <>
            <h3 className="text-lg font-semibold mb-4">
              Notification Settings
            </h3>
            <p className="text-gray-600 mb-4">
              Choose how you want to receive notifications.
            </p>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() => handleNotificationChange("email")}
                  className="w-5 h-5 text-nav focus:ring-2 focus:ring-nav"
                />
                <span>Email Notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={true} // Always checked
                  disabled // Prevents user from unchecking
                  // checked={notifications.web}
                  onChange={() => handleNotificationChange("web")}
                  className="w-5 h-5 text-nav focus:ring-2 focus:ring-nav"
                />
                <span>Notifications as 'My Rentals' Only</span>
              </label>
            </div>
            <button
              onClick={() => {
                savePersonalInfo(); 
                alert("clicker")
              }}
              className="w-full bg-imageBG text-black px-4 py-2 rounded-md hover:bg-nav transition"
            >
              Save Changes
            </button>
          </>
        )}
        {/* 
        {activeModal === "theme" && (
          <>
            <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
            <p className="text-gray-600 mb-4">Choose your preferred theme.</p>

            <div className="space-y-2">
              {["light", "dark", "system"].map((option) => (
                <button
                key={option}
                onClick={() => setTheme(option)}
                className={`w-full px-4 py-2 rounded-md transition border ${
                  theme === option
                  ? "bg-imageBG text-white "
                  : "bg-gray-100 text-black border-gray-300"
                  }`}
                  aria-label={`Select ${option} theme`}
                >
                  {option === "light"
                    ? "Light Theme"
                    : option === "dark"
                    ? "Dark Theme"
                    : "System Theme"}
                </button>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={closeSubModal}
                className="bg-imageBG text-white px-4 py-2 rounded-md transition"
              >
                Save
              </button>
            </div>
          </>
        )}
        */}
        
        {activeModal === "change-password" && (
          <>
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <div className="mb-4">
              <label
                htmlFor="current-password"
                className="block text-gray-700 mb-1 font-medium"
              >
                Current Password
              </label>
              <input
                  type="password"
                  id="current-password"
                  name="currentPassword"  
                  placeholder="Enter your current password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}

                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:bg-nav focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="new-password"
                className="block text-gray-700 mb-1 font-medium"
              >
                New Password
              </label>
              <input
                  type="password"
                  id="new-password"
                  name="newPassword"  // Ensure correct name
                  placeholder="Enter your updated password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}

                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:bg-nav focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirm-password"
                className="block text-gray-700 mb-1 font-medium"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-password"
                name="confirmedNewPassword"  // Ensure correct name
                placeholder="Confirm your new password"
                value={passwordData.confirmedNewPassword}
                onChange={handlePasswordChange}

                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:bg-nav focus:outline-none"
              />
            </div>
            <button
              onClick={updatePassword}
              className="w-full bg-imageBG text-black px-4 py-2 rounded-md hover:bg-nav transition"
            >
              Save Changes
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      {!activeModal ? (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <button
            onClick={onClose}
            className=" text-gray-500 hover:text-gray-800 text-xl"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold mb-6 text-center">Settings</h2>
          <ul className="space-y-4">
            {[
              { label: "Personal Info Settings", key: "account" },
              // { label: "Theme Settings", key: "theme" },
              { label: "Notifications", key: "notifications" },
              { label: "Change Password", key: "change-password" },
            ].map((item) => (
              <li
                key={item.key}
                onClick={() => openSubModal(item.key)}
                className="cursor-pointer bg-imageBG hover:bg-nav p-2 rounded transition text-center"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        renderSubModal()
      )}
      
    </div>
  );
}
