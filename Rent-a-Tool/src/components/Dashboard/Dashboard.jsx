import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Add from "../Add-Update/AddUpdate";
import { Api_Route } from '../../config'
import { UserContext } from "../../App";
import Modal from "./Modal";
import { CircularProgress } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
  const { state, dispatch } = useContext(UserContext);
  const [isAddToolOpen, setAddToolOpen] = useState(false);
  const [toolCount, setToolCount] = useState(0);
  const [rentalCount, setRentalCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState([]);
  const [rentedTools, setRentedTools] = useState([]);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  async function showTotalToolsCount() {
    try {

        const token = localStorage.getItem("jwt_token");
        if (!token) return;
        
        console.log("Working")
        const response = await fetch(`${Api_Route}/dashboard/quickLinks/getToolCount`, {
          headers: {
            Authorization: localStorage.getItem("jwt_token"),
          },
        })

        const data = await response.json();
        if (data.success) {
          setToolCount(data.toolCount); 
        } else {
          console.error("Failed to fetch tool count:", data.msg);
        }
      } catch (error) {
        console.error("Error fetching tool count:", error);
      }
  }

  async function showActiveRental() {
    try {

        const token = localStorage.getItem("jwt_token");
        if (!token) return;
        
        console.log("Working")
        const response = await fetch(`${Api_Route}/dashboard/quickLinks/getRentalCount`, {
          headers: {
            Authorization: localStorage.getItem("jwt_token"),
          },
        })

        const data = await response.json();
        if (data.success) {
          setRentalCount(data.toolRentalCount); 
        } else {
          console.error("Failed to fetch tool rental count:", data.msg);
        }
      } catch (error) {
        console.error("Error fetching tool rental count:", error);
      }
  }

  async function showPendingRequestCount() {
    try {

        const token = localStorage.getItem("jwt_token");
        if (!token) return;
        
        console.log("Working")
        const response = await fetch(`${Api_Route}/dashboard/quickLinks/getPendingRequestCount`, {
          headers: {
            Authorization: localStorage.getItem("jwt_token"),
          },
        })

        const data = await response.json();
        if (data.success) {
          setPendingCount(data.pendingRequests); 
        } else {
          console.error("Failed to fetch tool rental count:", data.msg);
        }
      } catch (error) {
        console.error("Error fetching tool rental count:", error);
      }
  }

  useEffect(() => {
    // Check payment status from URL parameters
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get('payment');
    
    if (paymentStatus === 'success') {
      toast.success('Payment successful! Your tool has been rented.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Clear the URL parameters
      window.history.replaceState({}, document.title, '/dashboard');
    } else if (paymentStatus === 'cancelled') {
      toast.info('Payment was cancelled.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Clear the URL parameters
      window.history.replaceState({}, document.title, '/dashboard');
    }
  }, [location]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          navigate("/");
          return;
        }

        const response = await fetch(`${Api_Route}/dashboard/LoggedInUser/getProfileDetails`, {
          headers: {
            Authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
        setTools(data.tools);
        setRentedTools(data.toolsRented);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    showTotalToolsCount();
    showActiveRental();
    showPendingRequestCount();
  }, []);

  const openAddToolModal = () => {
    setAddToolOpen(true);
    document.body.style.overflow = "hidden";
    };
  
  const closeAddToolModal = () => {
    setAddToolOpen(false);
    document.body.style.overflow = "auto";
  };

  function handleClick(){
      navigate('/Dashboard/Help')
  }
  function handleRentals(){
      navigate('/Dashboard/Listing')
  }
  return (
    <div className="p-8 bg-imageBG">
      <ToastContainer />
      {/* Welcome Message */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Rent-a-Tool!
        </h1>
        <p className="text-gray-600">
          We're glad to have you on board. Explore tools or manage your rentals with ease.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Quick Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-medium text-gray-800">Total Tools Listed</h3>
            <p className="text-2xl font-bold text-blue-600">{toolCount}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            {/* <button onClick={showActiveRentals}> */}
              <h3 className="text-lg font-medium text-gray-800">Active Rentals</h3>
            {/* </button> */}
            <p className="text-2xl font-bold text-green-600">{rentalCount}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-medium text-gray-800">Pending Requests</h3>
            <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <button onClick={openAddToolModal} className="w-full h-full">
            <div className="bg-white shadow-md rounded-lg p-4 text-center h-full flex flex-col justify-center hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-800">Add Your Tools</h3>
              <p className="text-gray-600">List your tools for rent here.</p>
            </div>
          </button>

          <button onClick={() => navigate('/Dashboard/requests')} className="w-full h-full">
            <div className="bg-white shadow-md rounded-lg p-4 text-center h-full flex flex-col justify-center hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-800">Tool Requests</h3>
              <p className="text-gray-600">View and manage requests for your tools</p>
              {pendingCount > 0 && (
                <span className="mt-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {pendingCount} pending
                </span>
              )}
            </div>
          </button>

          <button onClick={handleClick} className="w-full h-full">
            <div className="bg-white shadow-md rounded-lg p-4 text-center h-full flex flex-col justify-center hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-medium text-gray-800">Tutorials and Help</h3>
              <p className="text-gray-600">View the detailed tutorial to use the app along with videos.</p>
            </div>
          </button>
        </div>
      </div>
      {isAddToolOpen && <Add onClose={closeAddToolModal} />}
    </div>

  );
}

export default Dashboard;
