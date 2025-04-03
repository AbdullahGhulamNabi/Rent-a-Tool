import React, { useContext, useEffect, useState } from "react";
import SignUpModel from '../Login and Sign Up/SignUp'
import { useNavigate } from "react-router-dom";
import {Api_Route} from '../../config'
import { UserContext } from "../../App";
// import { User } from "../../../../backend/DB/db_models";
// import { Eye, EyeOff } from "lucide-react";
// use npm install lucide-react

function Login({onClose, onSignUpClick }) {
  const {state , dispatch} = useContext(UserContext)

  const navigate = useNavigate()
  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  async function handleLogin(event) {
    event.preventDefault(); 

    try {
    
      const response = await fetch(`${Api_Route}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("jwt_token", data.token); 
        console.log("Token:", data.token);
        // Store the user data in state
        dispatch({type:'USER' , payload: data.user});
        onClose();
        navigate("/Dashboard"); 
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again later.");
    }
  }



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
        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG pr-10"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {/* <NavLink to="/dashboard" className="no-underline">  */}
          <button
            type="submit"
            onClick={()=>{
              document.body.style.overflow = "auto"
            }}
            className="w-full bg-HomeText text-white py-2 rounded"
          >
            Login
          </button>
          {/* </NavLink> */}
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
