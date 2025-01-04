import React from "react";
import LoginModel from "./Login";

function SignUp({ onClose, onLoginClick }) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[380px] relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-500 hover:text-black"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold mb-4">Sign Up</h2>
          <form>
            <div className="flex justify-between mb-2">
              <div className="w-[45%]">
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
                  placeholder="First Name"
                />
              </div>
              <div className="w-[45%]">
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
                placeholder="Enter your address"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-HomeText text-white py-2 rounded"
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
  