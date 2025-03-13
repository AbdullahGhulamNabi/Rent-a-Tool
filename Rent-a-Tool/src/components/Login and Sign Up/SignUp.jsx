import React, { useState } from "react";
// import image from "../../uploads/"
import LoginModel from "./Login";
import { useNavigate } from "react-router-dom";
import { Api_Route } from "../../config";

function SignUp({ onClose, onLoginClick }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostelCode] = useState(0);
  const [error, setError] = useState("");

  async function handleSignIn(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${Api_Route}/signUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password, phoneNumber, address, postalCode }),
      });

      const data = await response.json();

      if (response.ok) {
        onLoginClick()
      } else {
        setError(data.message || "SignUp failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during SignUp:", error);
      setError("An error occurred. Please try again later.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[380px] relative ">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSignIn}>
        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
          <div className="flex justify-between mb-2">
            <div className="w-[45%]">
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-1 border rounded focus:outline-none focus:ring focus:border-imageBG"
                placeholder="First Name"
                value={firstName}
                onChange={(e)=> setFirstName(e.target.value)}
              />
            </div>
            <div className="w-[45%]">
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-1 border rounded focus:outline-none focus:ring focus:border-imageBG"
                placeholder="Last Name"
                value={lastName}
                onChange={(e)=> setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-1 border rounded focus:outline-none focus:ring focus:border-imageBG"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full px-3 py-1 border rounded focus:outline-none focus:ring focus:border-imageBG"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e)=> setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              className="w-full px-3 py-1 border rounded focus:outline-none focus:ring focus:border-imageBG"
              placeholder="Enter your address"
              value={address}
              onChange={(e)=> setAddress(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              Postal Code
            </label>
            <input
              type="text"
              className="w-full px-3 py-1 border rounded focus:outline-none focus:ring focus:border-imageBG"
              placeholder="Enter your Postal Code"
              value={postalCode}
              onChange={(e)=> setPostelCode(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-1 border rounded focus:outline-none focus:ring focus:border-imageBG"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-HomeText text-white py-1 rounded"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center mt-2">
          Already have an account?{" "}
          <button
            onClick={onLoginClick}
            className="text-blue-500 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
