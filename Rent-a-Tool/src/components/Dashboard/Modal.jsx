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
    switch (activeModal) {
      case "account":
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 w-full sm:w-[380px] md:w-[450px] lg:w-[500px]">
            <h3 className="text-lg font-bold mb-4">Account Settings</h3>
            <p>Here you can update your account details.</p>
            <button
              onClick={closeSubModal}
              className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition"
            >
              Back
            </button>
          </div>
        );
      case "notifications":
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 w-full sm:w-[380px] md:w-[450px] lg:w-[500px]">
            <h3 className="text-lg font-bold mb-4">Notifications</h3>
            <p>Manage your notification preferences here.</p>
            <button
              onClick={closeSubModal}
              className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition"
            >
              Back
            </button>
          </div>
        );
      case "privacy":
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 w-full sm:w-[380px] md:w-[450px] lg:w-[500px]">
            <h3 className="text-lg font-bold mb-4">Privacy</h3>
            <p>Control your privacy settings here.</p>
            <button
              onClick={closeSubModal}
              className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition"
            >
              Back
            </button>
          </div>
        );
      case "change-password":
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 w-full sm:w-[380px] md:w-[450px] lg:w-[500px]">
            <h3 className="text-lg font-bold mb-4">Privacy</h3>
            <p>Control your privacy settings here.</p>
            <button
              onClick={closeSubModal}
              className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition"
            >
              Back
            </button>
          </div>
        );
      case "messages":
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 w-full sm:w-[380px] md:w-[450px] lg:w-[500px]">
            <h3 className="text-lg font-bold mb-4">Privacy</h3>
            <p>Control your privacy settings here.</p>
            <button
              onClick={closeSubModal}
              className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition"
            >
              Back
            </button>
          </div>
        );

        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      {!activeModal ? (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full sm:w-[380px] md:w-[450px] lg:w-[500px] relative h-screen sm:h-auto">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold mb-6 text-center">Settings</h2>
          <ul className="space-y-4 text-center">
            <li
              onClick={() => openSubModal("account")}
              className="cursor-pointer text-blue-500 hover:bg-gray-200 p-2 rounded transition"
            >
              Account Settings
            </li>
            <li
              onClick={() => openSubModal("notifications")}
              className="cursor-pointer text-blue-500 hover:bg-gray-200 p-2 rounded transition"
            >
              Notifications
            </li>
            <li
              onClick={() => openSubModal("privacy")}
              className="cursor-pointer text-blue-500 hover:bg-gray-200 p-2 rounded transition"
            >
              Privacy
            </li>
            {/* New Items */}
            <li
              onClick={() => openSubModal("change-password")}
              className="cursor-pointer text-blue-500 hover:bg-gray-200 p-2 rounded transition"
            >
              Change Password
            </li>
            <li
              onClick={() => openSubModal("messages")}
              className="cursor-pointer text-blue-500 hover:bg-gray-200 p-2 rounded transition"
            >
              Messages
            </li>
          </ul>
        </div>
      ) : (
        renderSubModal()
      )}
    </div>
  );
}
