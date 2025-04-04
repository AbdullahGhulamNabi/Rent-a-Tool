import React, { useState } from "react";
// import image from "../../uploads/"
import LoginModel from "./Login";
import { useNavigate } from "react-router-dom";
import { Api_Route } from "../../config";
import toast, { Toaster } from 'react-hot-toast';

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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
    } else if (!/^\d{11}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone Number must be exactly 11 digits.";
    }
  
    if (!address.trim()) newErrors.address = "Address is required.";
  
    if (!postalCode) {
      newErrors.postalCode = "Postal Code is required.";
    } else if (!/^\d{5}$/.test(postalCode)) {
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
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      console.log("Sending signup request...");
      const response = await fetch(`${Api_Route}/signUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          firstName, 
          lastName, 
          email, 
          password, 
          phoneNumber, 
          address, 
          postalCode 
        }),
      });

      const data = await response.json();
      console.log("Signup response:", data);

      if (response.ok) {
        // Show success message
        setError("");
        toast.success("Signup successful! Please check your email to verify your account.", {
          duration: 5000,
          position: 'top-center',
        });
        onLoginClick(); // Switch to login modal
      } else {
        // Show specific error message from server
        setError(data.msg || "Signup failed. Please try again.");
        toast.error(data.msg || "Signup failed. Please try again.", {
          duration: 5000,
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError("An error occurred. Please try again later.");
      toast.error("An error occurred. Please try again later.", {
        duration: 5000,
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <Toaster position="top-center" />
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
          <div className="mb-2 relative ">
            <label className="block text-sm font-medium mb-0.5">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-1 border rounded focus:outline-none focus:ring focus:border-imageBG"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-8 text-gray-500 hover:text-gray-700 mt-2 justify-center"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-HomeText text-white py-1 rounded"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
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
