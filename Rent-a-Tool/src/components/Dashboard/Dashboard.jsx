import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import Add from "../Add-Update/AddUpdate";
import {Api_Route} from '../../config'

function Dashboard() {
  const [isAddToolOpen, setAddToolOpen] = useState(false);
  const [toolCount, setToolCount] = useState(0);

  async function showTotalToolsCount() {
    try {
        const response = await fetch(`${Api_Route}/dashboard/getToolCount`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
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


    
  useEffect(() => {
    showTotalToolsCount();
  }, []);


  const openAddToolModal = () => {
    setAddToolOpen(true);
    document.body.style.overflow = "hidden";
    };
  
  const closeAddToolModal = () => {
    setAddToolOpen(false);
    document.body.style.overflow = "auto";
  };

  const navigate = useNavigate()
  function handleClick(){
      navigate('/Dashboard/Help')
  }
  function handleRentals(){
      navigate('/Dashboard/Listing')
  }
  return (
    <div className="p-8 bg-imageBG">
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
            <p className="text-2xl font-bold text-green-600">4</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <h3 className="text-lg font-medium text-gray-800">Pending Requests</h3>
            <p className="text-2xl font-bold text-orange-600">2</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  <div className="bg-white shadow-md rounded-lg p-4 text-center">
    <button onClick={openAddToolModal} className="w-full h-full flex flex-col justify-center">
      <h3 className="text-lg font-medium text-gray-800">Add Your Tools</h3>
      <p className="text-gray-600">List your tools for rent here.</p>
    </button>
  </div>

  <button onClick={handleRentals} className="w-full h-full">
    <div className="bg-white shadow-md rounded-lg p-4 text-center h-full flex flex-col justify-center">
      <h3 className="text-lg font-medium text-gray-800">My Rentals</h3>
      <p className="text-gray-600">View your current rentals and history.</p>
    </div>
  </button>

  <button onClick={handleClick} className="w-full h-full">
    <div className="bg-white shadow-md rounded-lg p-4 text-center h-full flex flex-col justify-center">
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
