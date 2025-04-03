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
  const [postalCode, setPostelCode] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    let newErrors = {};
  
    if (!firstName.trim()) newErrors.firstName = "First Name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last Name is required.";
  
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }
  
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone Number is required.";
    } else if (!/^\d{10,15}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid phone number (10-15 digits).";
    }
  
    if (!address.trim()) newErrors.address = "Address is required.";
  
    if (!postalCode) {
      newErrors.postalCode = "Postal Code is required.";
    } else if (!/^\d{4}$/.test(postalCode)) {
      newErrors.postalCode = "Postal Code must be exactly 4 digits.";
    }
  
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!/\d/.test(password)) {
      newErrors.password = "Password must contain at least one number.";
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password = "Password must contain at least one special character (!@#$%^&*).";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSignIn(event) {
    event.preventDefault();

    if (!validateForm()) return

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
      <div className="bg-white rounded-lg shadow-lg p-4 w-[380px] relative ">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-2">Sign Up</h2>
        <form onSubmit={handleSignIn}>
        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
          <div className="flex justify-between mb-0.5">
            <div className="w-[45%]">
              <label className="block text-sm font-medium mb-0.5">
                First Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-1 border rounded focus:outline-none focus:ring focus:border-imageBG"
                placeholder="First Name"
                value={firstName}
                onChange={(e)=> setFirstName(e.target.value)}
              />
              {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
            </div>
            <div className="w-[45%]">
              <label className="block text-sm font-medium mb-0.5">
                Last Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-1 border rounded focus:outline-none focus:ring focus:border-imageBG"
                placeholder="Last Name"
                value={lastName}
                onChange={(e)=> setLastName(e.target.value)}
              />
              {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
            </div>
          </div>
          <div className="mb-0.5">
            <label className="block text-sm font-medium mb-0.5">Email</label>
            <input
              type="email"
              className="w-full px-3 py-1 border rounded focus:outline-none focus:ring focus:border-imageBG"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>
          <div className="mb-0.5">
            <label className="block text-sm font-medium mb-0.5">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full px-3 py-1 border rounded focus:outline-none focus:ring focus:border-imageBG"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e)=> setPhoneNumber(e.target.value)}
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
          </div>
          <div className="mb-0.5">
            <label className="block text-sm font-medium mb-0.5">Address</label>
            <input
              type="text"
              className="w-full px-3 py-1 border rounded focus:outline-none focus:ring focus:border-imageBG"
              placeholder="Enter your address"
              value={address}
              onChange={(e)=> setAddress(e.target.value)}
            />
            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
          </div>
          <div className="mb-0.5">
            <label className="block text-sm font-medium mb-0.5">
              Postal Code
            </label>
            <input
              type="text"
              className="w-full px-3 py-1 border rounded focus:outline-none focus:ring focus:border-imageBG"
              placeholder="Enter your Postal Code"
              value={postalCode}
              onChange={(e)=> setPostelCode(e.target.value)}
            />
            {errors.postalCode && <p className="text-red-500 text-xs">{errors.postalCode}</p>}
          </div>
          <div className="mb-1.5">
            <label className="block text-sm font-medium mb-0.5">Password</label>
            <input
              type="password"
              className="w-full px-3 py-1 border rounded focus:outline-none focus:ring focus:border-imageBG"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
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
