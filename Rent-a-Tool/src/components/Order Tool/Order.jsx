import React from 'react';
import { useState } from 'react';
import Rating from '@mui/material/Rating';
import toolIcon from '../../assets/ToolDetail/toolsample.jpg';
import ProfileIcon from '../../assets/ToolDetail/profile.jpeg';
import { Outlet, useNavigate } from 'react-router-dom';


function Order() {


    const navigate = useNavigate()
    function handleNavigate() {
        navigate("/ToolDescription/Listing")
    }

    const [rentalDays, setRentalDays] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const rentalPricePerDay = 10; // Example price per day
    const totalPrice = rentalDays * rentalPricePerDay;

    const handleCardDetailsChange = (e) => {
        const { name, value } = e.target;
        setCardDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-white p-4">
            <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-lg">
                <h2 className="text-xl font-bold mb-4">Tool Rental Order</h2>
                <div className="mb-4">
                    <label className="block mb-1">Tool</label>
                    <input
                        type="text"
                        value="Bicycle carrier on the back"
                        disabled
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Rental Duration (Days)</label>
                    <input
                        type="number"
                        value={rentalDays}
                        onChange={(e) => setRentalDays(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
                        min="1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Payment Option</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
                    >
                        <option value="cash">Cash on Delivery</option>
                        <option value="debit">Debit Card</option>
                        <option value="credit">Credit Card</option>
                    </select>
                </div>

                {/* Show card details inputs only for debit/credit cards */}
                {(paymentMethod === "debit" || paymentMethod === "credit") && (
                    <div>
                        <div className="mb-4">
                            <label className="block mb-1">Card Number</label>
                            <input
                                type="text"
                                name="cardNumber"
                                value={cardDetails.cardNumber}
                                onChange={handleCardDetailsChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
                                placeholder="1234 5678 9101 1121"
                            />
                        </div>
                        <div className="mb-4 flex space-x-4">
                            <div className="w-1/2">
                                <label className="block mb-1">Expiry Date</label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={cardDetails.expiryDate}
                                    onChange={handleCardDetailsChange}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
                                    placeholder="MM/YY"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block mb-1">CVV</label>
                                <input
                                    type="text"
                                    name="cvv"
                                    value={cardDetails.cvv}
                                    onChange={handleCardDetailsChange}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-imageBG"
                                    placeholder="123"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-4 font-bold text-lg">Total Price: ${totalPrice}</div>
                <button className="w-full bg-HomeText text-white py-2 rounded" onClick={handleNavigate}>Confirm Rental</button>
            </div>
        </div>
    );
}

export default Order;
