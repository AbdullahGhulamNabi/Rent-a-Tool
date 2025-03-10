import React, { useState } from "react";

export default function ProfileModal({ onClose }) {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    console.log("Updated Username:", username);
    console.log("Updated Image:", image);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Update Profile</h2>

        <div className="flex flex-col items-center space-y-4">
          <label htmlFor="profile-image" className="cursor-pointer relative">
            <img
              src={image || "https://via.placeholder.com/100"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
            />
            <input
              type="file"
              id="profile-image"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <input
            type="text"
            placeholder="Enter new username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:outline-none"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full mt-4 bg-imageBG text-white px-4 py-2 rounded-md"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
