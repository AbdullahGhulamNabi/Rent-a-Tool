import React, { useState, useEffect, useContext } from "react";
import Rating from "@mui/material/Rating";
import ProfileIcon from "../../assets/ToolDetail/profile.jpeg";
import ChatIcon from "@mui/icons-material/Chat";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { useLocation } from "react-router-dom";
import { Api_Route } from "../../config";
import { loadStripe } from "@stripe/stripe-js";
import { CircularProgress } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RentalDurationModal from './RentalDurationModal';

const ToolDetailsLanding = () => {
  const { state, dispatch } = useContext(UserContext);
  const [showMessage, setShowMessage] = useState(false);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [stripe, setStripe] = useState(null);
  const navigate = useNavigate();
 
  const location = useLocation();
  const { tool } = location.state || {}; // Get tool data

  // Early return if no tool data
  if (!tool) {
    return (
      <div className="min-h-screen bg-imageBG flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-4">No tool found!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-HomeText text-white px-6 py-2 rounded hover:bg-nav transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Debug user state
  useEffect(() => {
    console.log('Current user state:', state);
    console.log('Local storage userState:', localStorage.getItem('userState'));
    console.log('JWT Token:', localStorage.getItem('jwt_token'));
  }, [state]);

  // Initialize Stripe
  useEffect(() => {
    const initializeStripe = async () => {
      try {
        console.log('Initializing Stripe with key:', import.meta.env.VITE_STRIPE_PUBLIC_KEY ? 'Present' : 'Missing');
        const stripeInstance = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
        if (!stripeInstance) {
          throw new Error('Failed to load Stripe');
        }
        setStripe(stripeInstance);
        console.log('Stripe initialized successfully');
      } catch (error) {
        console.error('Error initializing Stripe:', error);
      }
    };

    initializeStripe();
  }, []);

  function handleNavigate(tool) {
    if (state && state._id) {
      navigate("/ToolDescriptions/Chat");
      // navigate(`/ToolDescription/Chat/${tool}`);
    } else {
      setShowMessage(true);
      document.body.style.overflow = "hidden"
    }
  }

  const handleOrderClick = () => {
    if (!state) {
      setShowMessage(true);
      document.body.style.overflow = "hidden";
      return;
    }
    setShowRentalModal(true);
  };

  const handleRentalConfirm = async (rentalDays) => {
    setShowRentalModal(false);
    await makePayment(rentalDays);
  };

  const makePayment = async (rentalDays) => {
    // Check if user is logged in
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setShowMessage(true);
      document.body.style.overflow = "hidden";
      return;
    }

    if (!stripe) {
      toast.warning('Payment system is initializing. Please try again in a moment.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      console.log('Starting payment process...');
      
      // IMPORTANT: First check if the tool is already rented by fetching the latest tool status
      const toolResponse = await fetch(`${Api_Route}/api/tools/${tool._id}`);
      if (!toolResponse.ok) {
        throw new Error('Failed to fetch tool status');
      }
      
      const toolData = await toolResponse.json();
      if (toolData.rented) {
        toast.error('This tool is already rented and not available.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
      
      console.log('Tool data:', tool);
      console.log('User state:', state);
      console.log('JWT Token:', token);
      console.log('Rental Days:', rentalDays);

      // Get user ID from state or localStorage
      let userId = state?._id;
      if (!userId) {
        console.log('User ID not found in state, checking localStorage...');
        const storedState = JSON.parse(localStorage.getItem('userState'));
        console.log('Stored state:', storedState);
        userId = storedState?._id;
        
        if (!userId) {
          throw new Error('User information not found. Please try logging in again.');
        }
      }

      // Ensure tool price is a number
      const toolPrice = Number(tool.price);
      if (isNaN(toolPrice) || toolPrice <= 0) {
        throw new Error('Invalid tool price');
      }

      // Check if price is too low (less than 140 PKR)
      if (toolPrice < 150) {
        toast.error('This tool cannot be rented through the payment system due to its low price. Please contact the owner directly.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      const totalPrice = toolPrice * rentalDays;

      const body = {
        toolId: tool._id,
        userId: userId,
        toolName: tool.name,
        toolPrice: totalPrice,
        rentalDays: rentalDays
      };
      console.log('Request body:', body);

      // Validate required fields
      if (!body.toolId || !body.userId || !body.toolName || !body.toolPrice || !body.rentalDays) {
        console.error('Missing required fields:', {
          toolId: !!body.toolId,
          userId: !!body.userId,
          toolName: !!body.toolName,
          toolPrice: !!body.toolPrice,
          rentalDays: !!body.rentalDays
        });
        throw new Error('Missing required payment information');
      }

      const response = await fetch(`${Api_Route}/api/payment/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(body),
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      let sessionData;
      try {
        sessionData = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid response from server');
      }

      if (!sessionData.sessionId) {
        throw new Error('No session ID received');
      }

      const result = await stripe.redirectToCheckout({
        sessionId: sessionData.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'An error occurred during payment', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleRequestTool = async () => {
    try {
      const response = await fetch(`${Api_Route}/api/tools/${tool._id}/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('jwt_token')
        }
      });

      if (response.ok) {
        toast.success('Tool request sent successfully! The owner will be notified.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to send tool request', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error requesting tool:', error);
      toast.error('An error occurred while requesting the tool', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const [value, setValue] = React.useState(5);

  // Handle login navigation
  const handleLoginNavigation = () => {
    // Store the current tool data in localStorage before navigation
    localStorage.setItem('toolToRent', JSON.stringify(tool));
    navigate("/login");
  };

  const [toolFeedback, setToolFeedback] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Add a new useEffect to fetch feedback
  useEffect(() => {
    const fetchFeedback = async () => {
      if (!tool || !tool._id) return;
      
      setFeedbackLoading(true);
      try {
        const response = await fetch(`${Api_Route}/api/feedback/tool/${tool._id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }
        
        const data = await response.json();
        setToolFeedback(data.feedback || []);
        setAverageRating(data.averageRating || 0);
        setFeedbackCount(data.count || 0);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setFeedbackLoading(false);
      }
    };
    
    fetchFeedback();
  }, [tool]);

  return (
    <div className="min-h-screen bg-imageBG">
      <ToastContainer />
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

      <RentalDurationModal
        isOpen={showRentalModal}
        onClose={() => setShowRentalModal(false)}
        onConfirm={handleRentalConfirm}
        toolPrice={tool?.price || 0}
      />

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
              // src={`http://localhost:3000/uploads/tools/${tool.image}`}
              src={`${Api_Route}/uploads/tools/${tool.image}`}
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
                <b className="font-semibold">Postal Code:</b> {tool.owner.postalCode || " Postal Code not Available"}
              </p>
              <button className="text-blue-800 font-medium ">
                {/* View Profile */}
              </button>
              <br />
            </div>

            <div className="w-20% flex flex-col items-center gap-2">
              <img
                src={`${Api_Route}/Images/${tool.owner.profilePhoto}` || ProfileIcon}
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
              onClick={() => handleNavigate(tool)}
              className="w-[150px] sm:w-[270px] mt-4 bg-HomeText text-white py-2 rounded flex items-center justify-center space-x-2 gap-2"
            >
              <ChatIcon className="w-7 h-7" />
              <span>Chat with Owner</span>
            </button>

            {state ? (
              tool.owner._id === state._id ? (
                <button
                  onClick={() => navigate(`/dashboard`)}
                  className="w-[150px] sm:w-[270px] mt-4 bg-HomeText text-white py-2 rounded flex items-center justify-center space-x-2 gap-2"
                >
                  Go to Dashboard
                </button>
              ) : tool.rented ? (
                <button
                  disabled
                  className="w-[150px] sm:w-[270px] mt-4 bg-HomeText text-white py-2 rounded flex items-center justify-center space-x-2 gap-2 cursor-not-allowed"
                >
                  Tool is not available for rent
                </button>
              ) : (
                tool.price === 0 ? (
                  <button
                    onClick={handleRequestTool}
                    className="w-[150px] sm:w-[270px] mt-4 bg-HomeText text-white py-2 rounded flex items-center justify-center space-x-2 gap-2"
                  >
                    Request Tool
                  </button>
                ) : (
                  <button
                    onClick={handleOrderClick}
                    className="w-[150px] sm:w-[270px] mt-4 bg-HomeText text-white py-2 rounded flex items-center justify-center space-x-2 gap-2"
                  >
                    <ShoppingCartIcon className="w-7 h-7" />
                    <span>Order Tool</span>
                  </button>
                )
              )
            ) : (
              <button
                className="w-[150px] sm:w-[270px] mt-4 bg-HomeText text-white py-2 rounded flex items-center justify-center space-x-2 gap-2"
              >
                Login to Rent
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Customer Reviews
          {feedbackCount > 0 && (
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({feedbackCount} {feedbackCount === 1 ? 'review' : 'reviews'})
            </span>
          )}
        </h3>
        
        {feedbackLoading ? (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-4 border-t-transparent border-green-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : feedbackCount === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
        ) : (
          <>
            <div className="flex items-center mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5"
                    fill={star <= Math.round(averageRating) ? "#F59E0B" : "#E5E7EB"}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l2.2 6.7h7.1l-5.7 4.1 2.2 6.7-5.7-4.1-5.7 4.1 2.2-6.7-5.7-4.1h7.1z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-lg font-medium text-gray-700">
                {averageRating.toFixed(1)}
              </span>
            </div>
            
            <div className="space-y-4 mt-6">
              {toolFeedback.map((review) => (
                <div key={review._id} className="border-b pb-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className="w-4 h-4"
                          fill={star <= review.rating ? "#F59E0B" : "#E5E7EB"}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l2.2 6.7h7.1l-5.7 4.1 2.2 6.7-5.7-4.1-5.7 4.1 2.2-6.7-5.7-4.1h7.1z" />
                        </svg>
                      ))}
                    </div>
                    <div className="ml-2 text-sm font-medium text-gray-700">
                      by {review.userId?.firstName || 'Anonymous'}
                    </div>
                  </div>
                  {review.desc && (
                    <p className="mt-2 text-gray-600">{review.desc}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ToolDetailsLanding;
