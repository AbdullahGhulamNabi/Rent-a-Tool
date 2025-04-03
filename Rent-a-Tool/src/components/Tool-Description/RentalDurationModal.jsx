import React, { useState } from 'react';
import { toast } from 'react-toastify';

const RentalDurationModal = ({ isOpen, onClose, onConfirm, toolPrice }) => {
  const [rentalDays, setRentalDays] = useState(1);

  if (!isOpen) return null;

  const handleRentalDaysChange = (e) => {
    const value = e.target.value;
    // Allow empty value for backspace
    if (value === '') {
      setRentalDays('');
      return;
    }
    // Convert to number and validate
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setRentalDays(numValue);
    }
  };

  const handleConfirm = () => {
    if (!rentalDays || rentalDays < 1) {
      toast.error('Please enter a valid number of days', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    onConfirm(rentalDays);
  };

  const totalPrice = rentalDays * toolPrice;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
        <h2 className="text-2xl font-bold mb-4">Rental Duration</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Number of Days
          </label>
          <input
            type="number"
            min="1"
            value={rentalDays}
            onChange={handleRentalDaysChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>

        <div className="mb-6">
          <p className="text-lg">
            <span className="font-semibold">Price per day:</span> PKR {toolPrice}
          </p>
          <p className="text-xl font-bold text-green-600">
            <span className="font-semibold">Total Price:</span> PKR {totalPrice}
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-HomeText text-white rounded hover:bg-blue-600"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalDurationModal; 