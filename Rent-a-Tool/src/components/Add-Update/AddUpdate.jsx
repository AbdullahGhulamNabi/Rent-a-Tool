import React, { useState } from 'react'
import cameraIcon from '../../assets/AddTool/camra.png'

const AddUpdate = ({ onClose }) => {

  const [isForRent, setIsForRent] = useState(false); // State to manage selection
  const [updateButtonID, setUpdateButtonID] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[380px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold w-[100%] text-center  mb-4">Add Tool</h2>
        <form>
          <div className='w-full flex justify-center mb-2'>
            <label htmlFor="imageInput" className="cursor-pointer">
              <img src={cameraIcon} className="h-14 w-14" alt="Camera Icon" />
            </label>
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              className="hidden" // Hide the file input element
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  console.log("Selected Image:", file);
                }
              }}
            />
          </div>
          <div className="flex justify-between mb-2">

            <div className="w-full">
              <label className="block text-sm font-medium mb-1">Tool Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
                placeholder="First Name"
              />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea cols="30" rows="3"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
              placeholder='Add description of the tool'
            ></textarea>

            <div className="w-[100%] flex flex-col justify-between mb-2">
              <div className="flex justify-between">
                {/* Free to Borrow Button */}
                <button
                  type="button" // Prevent default form submission behavior
                  onClick={() => setIsForRent(false)}
                  className={`px-4 py-2 rounded-md w-[45%] ${!isForRent ? "bg-imageBG text-white" : "bg-gray-200 text-gray-800"
                    }`}
                >
                  Free to borrow
                </button>

                {/* For Rent Button */}
                <button
                  type="button" // Prevent default form submission behavior
                  onClick={() => setIsForRent(true)}
                  className={`px-4 py-2 rounded-md w-[45%] ${isForRent ? "bg-imageBG text-white" : "bg-gray-200 text-gray-800"
                    }`}
                >
                  For rent
                </button>
              </div>

              {/* Rent Price Input */}
              {isForRent && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Rent Price
                  </label>
                  <input
                    type="number"
                    placeholder="Enter rent price in rupees"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
                  />
                </div>
              )}
            </div>

           
          </div>
          {/* <div className="mb-2">
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
          </div> */}
          <button
            type="submit"
            className="w-full bg-HomeText text-white py-2 rounded mt-1"
          >
            {updateButtonID ? "Update" : "Add"}
          </button>
        </form>

      </div>
    </div>
  )
}

export default AddUpdate
