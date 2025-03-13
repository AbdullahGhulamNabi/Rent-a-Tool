import React, { useState, useRef, useEffect, useContext } from "react";
import { Api_Route } from "../../config";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { data } from "react-router-dom";
import { UserContext } from "../../App";

export default function ProfileModal({ onClose }) {
  const {state , dispatch} = useContext(UserContext)
  const [username, setUsername] = useState("");
  const [image, setImage] = useState();
  const [file, setFile] = useState();
  const handleSave = () => {
    onClose();
  };

  const onInputChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", file);
    try {
      const result = await axios.post(
        `${Api_Route}/dashboard/uploadProfilePhoto`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("jwt_token"),
          },
        }
      );
      if (result.data.status === "ok") {
        console.log("Image uploaded successfully!");
        dispatch({ type: "SET_PROFILE_IMAGE", payload: result.data.profilePhoto })
        handleSave();
        setImage(null); // Clear the input field
      } else {
        console.error("Error uploading image:", result.data.status);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  useEffect(() => {
    fetch(`${Api_Route}/dashboard/getProfilePhoto`, {
      headers: {
        Authorization: localStorage.getItem("jwt_token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.profilePhoto) {
          setImage(data.profilePhoto);
        }
      })
      .catch((error) => console.error("Error fetching image:", error));
  }, []);

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
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={onInputChange}
              className="block w-full text-sm text-gray-500 
             file:mr-4 file:py-2 file:px-4
             file:rounded-lg file:border-0
             file:text-sm file:font-semibold
             file:bg-blue-50 file:text-blue-700
             hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
          <button
            disabled={!file}
            onClick={handleUpload}
            className="mt-4 bg-imageBG text-white px-4 py-2 w-[100] rounded-md"
          >
            Change Profile Picture
          </button>
          <img
            src={`${Api_Route}/Images/${image}`}
            className="h-20 w-20"
            alt="Photo"
          />
        </div>
      </div>
    </div>
  );
}
