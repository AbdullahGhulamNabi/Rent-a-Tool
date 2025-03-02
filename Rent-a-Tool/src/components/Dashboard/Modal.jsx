import React, { useState } from "react";

export default function Modal({ onClose }) {
  const [activeModal, setActiveModal] = useState(null);
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({
    email: false,
    web: true,
  });

  const openSubModal = (type) => {
    setActiveModal(type);
  };

  const closeSubModal = () => {
    setActiveModal(null);
  };

  const handleNotificationChange = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
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
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 mb-1 font-medium"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your updated username"
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:bg-nav focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="useremail"
                className="block text-gray-700 mb-1 font-medium"
              >
                Email
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your updated Email"
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:bg-nav focus:outline-none"
              />
            </div>

            <button
              onClick={closeSubModal}
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
              onClick={closeSubModal}
              className="w-full mt-4 bg-imageBG text-black px-4 py-2 rounded-md hover:bg-nav transition"
            >
              Save Preferences
            </button>
          </>
        )}

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
                      ? "bg-nav text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)} Theme
                </button>
              ))}
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
                placeholder="Enter your current password"
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
                placeholder="Enter your new password"
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
                placeholder="Confirm your new password"
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:bg-nav focus:outline-none"
              />
            </div>
            <button
              onClick={closeSubModal}
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
              { label: "Account Settings", key: "account" },
              { label: "Theme Settings", key: "theme" },
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
