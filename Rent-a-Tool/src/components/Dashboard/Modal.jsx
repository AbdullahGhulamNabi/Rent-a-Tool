import React, { useState } from "react";

export default function Modal({ onClose }) {
  const [activeModal, setActiveModal] = useState(null);

  const openSubModal = (type) => {
    setActiveModal(type);
  };

  const closeSubModal = () => {
    setActiveModal(null);
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
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              onClick={closeSubModal}
              className="w-full bg-imageBG text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
          </>
        )}
        {activeModal === "notifications" && (
          <>
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            <p className="text-gray-600 mb-4">
              Manage your notification preferences.
            </p>
            <button
              onClick={closeSubModal}
              className="w-full bg-imageBG text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Back
            </button>
          </>
        )}
        {activeModal === "privacy" && (
          <>
            <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
            <p className="text-gray-600 mb-4">Control your privacy settings.</p>
            <button
              onClick={closeSubModal}
              className="w-full bg-imageBG text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Back
            </button>
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
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={closeSubModal}
              className="w-full bg-imageBG text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
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
              { label: "Notifications", key: "notifications" },
              { label: "Privacy", key: "privacy" },
              { label: "Change Password", key: "change-password" },
            ].map((item) => (
              <li
                key={item.key}
                onClick={() => openSubModal(item.key)}
                className="cursor-pointer bg-nav hover:bg-gray-100 p-2 rounded transition text-center"
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
