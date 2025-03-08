import React, { useState, useEffect } from "react";
function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);



  const handleRating = (value) => {
    setRating(value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === "") {
      alert("Please provide both a rating and a comment.");
      return;
    }
    setSubmitted(true);
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Feedback</h2>
          <p className="text-gray-500 text-lg">
            We value your opinion about product
          </p>
        </div>

        {/* Product Card */}
        <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-100 flex items-center space-x-4">
          <div className="bg-nav p-3 rounded-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="fill"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Wireless Bluetooth Headphones
            </h3>
            <p className="text-gray-500">Request ID: #123456789</p>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="mb-8 text-center">
          <p className="text-lg font-medium text-gray-700 mb-4">
            How would you rate this product?
          </p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRating(star)}
                className={`transform transition-all duration-200 ${
                  rating >= star || hoverRating >= star
                    ? "scale-125"
                    : "scale-100"
                }`}
              >
                <svg
                  className="w-12 h-12"
                  fill={
                    rating >= star || hoverRating >= star
                      ? "#F59E0B"
                      : "#E5E7EB"
                  }
                  stroke="#F59E0B"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Comment Box */}
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-700 mb-4">
            Tell us more about your experience
          </label>
          <textarea
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 placeholder-gray-400"
            rows="5"
            placeholder="What did you like about the product? What could be improved?..."
            value={comment}
            onChange={handleCommentChange}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-nav hover:bg-[#c6cbcc] text-black font-bold rounded-xl transform transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
        >
          Submit Feedback
        </button>

        {/* Success Message */}
        {submitted && (
          <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>

              <div>Thank you! Your feedback helps us improve 🌟</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackPage;
