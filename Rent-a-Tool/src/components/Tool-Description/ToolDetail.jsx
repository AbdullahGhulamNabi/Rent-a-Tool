import React, { useEffect } from "react";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import toolIcon from "../../assets/ToolDetail/toolsample.jpg";
import ProfileIcon from "../../assets/ToolDetail/profile.jpeg";
import ChatIcon from "@mui/icons-material/Chat";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { Api_Route } from "../../config";

const ToolDetail = () => {
  const { state, dispatch } = useContext(UserContext);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();
  const [image, setImage] = useState();
  //  const { state, dispatch } = useContext(UserContext);


  // code for profile picter 
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return;

    fetch(`${Api_Route}/dashboard/getProfilePhoto`, {
      headers: {
        Authorization: localStorage.getItem("jwt_token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.profilePhoto) {
          setImage(data.profilePhoto);
          console.log(data.profilePhoto + "Hello");
        }
      })
      .catch((error) => console.error("Error fetching image:", error));
  }, [state?.profileImage, state]);
  //  code for description of tool

  const location = useLocation();
  const { tool } = location.state || {}; // Get tool data
  if (!tool) {
    return <p>No tool found!</p>;
  }



  function handleNavigate() {
    if (state) {
      navigate("/ToolDescription/Chat");
    } else {
      setShowMessage(true);
      document.body.style.overflow = "hidden"
    }
  }

  function orderTool() {
    if (state) {
      navigate("/ToolDescription/Order");
    } else {
      setShowMessage(true);
      document.body.style.overflow = "hidden"
    }
  }

  const [value, setValue] = React.useState(5);

  return (
    <>
      {showMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-5 rounded-lg shadow-lg relative w-[300px] h-[150px] flex items-center justify-center">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => {
                document.body.style.overflow = "auto"
                setShowMessage(false)
              }}
            >
              ✖
            </button>
            <p className="text-lg font-medium">Login first to proceed</p>
          </div>
        </div>
      )}
      <div className="w-full flex justify-center sm:p-5  ">
        {/* detail section */}
        <div className="min-w-[300px] max-w-[1000px] p-5 bg-[#ffffff] shadow-2xl rounded-lg focus:outline-none focus:ring-0">

        <div className="relative flex justify-center border rounded-lg">
  {/* Go Back Button */}
  <button 
  onClick={() => navigate(-1)} 
  className="absolute top-4 left-4 bg-white text-blue-600 px-4 py-2 rounded-full shadow-lg hover:bg-[#d9e4e6]  hover:scale-105 transition duration-300 flex items-center gap-2"
>
  🔙 <span className="font-medium">Go Back</span>
</button>


  {/* Image */}
  <img
    className="w-[900px] h-[350px] sm:h-[400px]"
    src={`http://localhost:3000/uploads/tools/${tool.image}`}
    alt={tool.name}
  />
</div>

          <div className="mt-4">
            <h2 className="text-3xl font-bold ">{tool.name}</h2>
            <p className="text-lg mt-4 font-light">
              <b className="font-semibold">Renting Price Details:</b>  <b className="text-green-600">PKR {tool.price} per day</b>
            </p>
            <p className="text-lg mt-4 font-light">
              <b className="font-semibold">Address:</b>   {tool.owner.address} <span className="font-semibold">Postal code:</span> {tool.owner.postalCode}
            </p>
            <p className="text-lg mt-4 font-light">
              <b className="font-semibold">   Details and Description : </b>{tool.description}
            </p>
            <hr className="mt-5 border-b-4 " />
          </div>
          <div className="flex justify-between w-full p-5 m-3">
            <div className="w-[70%] ">
              <h2 className="text-3xl font-bold">{tool.owner.firstName} {tool.owner.lastName}</h2>
              <p className="text-lg mt-4 font-light">

                <b className="font-semibold">Tool Owner Address:</b> {tool.owner.address}<br></br>
                <b className="font-semibold">Postal Code:</b> {tool.owner.postalCode}
              </p>
              <button className="text-blue-800 font-medium ">
                {/* View Profile */}
              </button>
              <br />
            </div>

            <div className="w-20% flex flex-col items-center gap-2">
              <img
                src={`${Api_Route}/Images/${image}`}
                alt="Profile Photo"
                className="h-[100px] w-[100px] rounded-full"
              />

              <Rating
                name="simple-controlled"
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              />
            </div>
          </div>
          <div className="w-full flex justify-evenly mb-4 gap-3">
            <button
              onClick={handleNavigate}
              className="w-[150px] sm:w-[270px] mt-4 bg-HomeText text-white py-2 rounded flex items-center justify-center space-x-2 gap-2"
            >
              <ChatIcon className="w-7 h-7 " />
              <span>Chat to Rent</span>
            </button>

            <button
              onClick={orderTool}
              className="w-[150px] sm:w-[270px] mt-4 bg-HomeText text-white py-2 rounded flex items-center justify-center space-x-2 gap-2"
            >
              <ShoppingCartIcon className="w-7 h-7 " />
              <span>Place Order</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToolDetail;
