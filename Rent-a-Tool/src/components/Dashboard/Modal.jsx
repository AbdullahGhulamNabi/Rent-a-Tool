import React, { useState,useContext, useEffect } from "react";
import {Api_Route} from '../../config'
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

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

  useEffect(() => {
    const fetchNotificationPreferences = async () => {
      try {
        const response = await fetch(`${Api_Route}/dashboard/settings/getNotificationPreferences`, {
          headers: {
            'Authorization': localStorage.getItem("jwt_token")
          }
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(prev => ({
            ...prev,
            email: data.emailNotifications
          }));
        }
      } catch (error) {
        console.error('Error fetching notification preferences:', error);
      }
    };

    fetchNotificationPreferences();
  }, []);

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
      // Check if all fields are filled
      if (!formData.firstName || !formData.lastName || !formData.userPhone || !formData.userPostalCode) {
        toast.error('Please fill in all fields', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      // Validate phone number (must be 11 digits)
      const phoneRegex = /^\d{11}$/;
      if (!phoneRegex.test(formData.userPhone)) {
        toast.error('Phone number must be exactly 11 digits', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      // Validate postal code (must be 5 digits)
      const postalCodeRegex = /^\d{5}$/;
      if (!postalCodeRegex.test(formData.userPostalCode)) {
        toast.error('Postal code must be exactly 4 digits', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      const response = await fetch(`${Api_Route}/dashboard/Settings/savePersonalInfo`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwt_token"),
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          userPhone: formData.userPhone,
          userPostalCode: formData.userPostalCode
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      closeSubModal();
      toast.success('Profile updated successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Failed to update profile. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }


  const updatePassword = async () => {
    try {
      // Check if current password is provided
      if (!passwordData.currentPassword) {
        toast.error('Please enter your current password', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      // Check if new password is provided
      if (!passwordData.newPassword) {
        toast.error('Please enter a new password', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      // Check if confirm password is provided
      if (!passwordData.confirmedNewPassword) {
        toast.error('Please confirm your new password', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      // Check if new passwords match
      if (passwordData.newPassword !== passwordData.confirmedNewPassword) {
        toast.error('New passwords do not match', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      console.log('Sending password update request with data:', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmedNewPassword: passwordData.confirmedNewPassword
      });

      const response = await fetch(`${Api_Route}/dashboard/Settings/updatePassword`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwt_token"),
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmedNewPassword: passwordData.confirmedNewPassword
        }),
      });

      console.log('Response status:', response.status);
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        toast.success('Password updated successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        // Close all modals before logging out
        closeSubModal();
        closeSettingModal();
        onClose();
        // Add a small delay before logging out to ensure modals are closed
        setTimeout(() => {
          handleLogout();
        }, 100);
      } else {
        console.error('Password update failed:', data);
        toast.error(data.message || 'Failed to update password. Please check your current password.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error('An error occurred while updating password. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

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

        toast.success('Notification preferences updated successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        console.error('Error saving notification preferences:', error);
        // Revert the state if save failed
        setNotifications(notifications);
        toast.error('Failed to update notification preferences', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
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
            <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
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
                  className="w-5 h-5 text-nav focus:ring-2 focus:ring-nav"
                />
                <span>Notifications as 'My Rentals' Only</span>
              </label>
            </div>
          </>
        )}
        
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
                name="newPassword"
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
                name="confirmedNewPassword"
                placeholder="Confirm your new password"
                value={passwordData.confirmedNewPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:bg-nav focus:outline-none"
              />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Note: You will be logged out after saving the new password
            </p>
            <button
              onClick={updatePassword}
              className="w-full mt-4 bg-imageBG text-black px-4 py-2 rounded-md hover:bg-nav transition"
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
              { label: "Profile Settings", key: "account" },
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
