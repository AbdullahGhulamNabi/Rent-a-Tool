import React from "react";
import SignUpModel from './SignUp'
import { NavLink } from "react-router-dom";

function Login({ onClose, onSignUpClick,onLoginSuccess }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[380px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
              placeholder="Enter your password"
            />
          </div>
         <NavLink to="/dashboard" className="no-underline"> <button
            type="submit"
            onClick={onLoginSuccess}
            className="w-full bg-HomeText text-white py-2 rounded"
          >
            Login
          </button></NavLink>
        </form>
        <p className="text-sm text-center mt-4">
          Don't have an account yet?{" "}
          <button
            onClick={onSignUpClick}
            className="text-blue-500 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
