import React, { useState } from "react";
import { Api_Route } from "../../config";
import { toast } from "react-hot-toast";

const FeedbackModal = ({ isOpen, onClose, toolId, toolName, toolImage }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRating = (value) => {
    setRating(value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    if (comment.trim() === "") {
      toast.error("Please provide a comment");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        toast.error("Please login to submit feedback");
        return;
      }

      const response = await fetch(`${Api_Route}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          toolId,
          rating,
          desc: comment
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit feedback");
      }

      toast.success("Thank you for your feedback!");
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(error.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Share Your Experience
          </h2>
          <p className="text-gray-500">
            How was your experience with this tool?
          </p>
        </div>

        {/* Tool Card */}
        <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100 flex items-center space-x-4">
          <div className="h-16 w-16 bg-gray-200 rounded-lg overflow-hidden">
            {toolImage ? (
              <img
                src={`${Api_Route}/uploads/tools/${toolImage}`}
                alt={toolName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-sm text-gray-500">No image</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {toolName || "Tool"}
            </h3>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="mb-6 text-center">
          <p className="text-lg font-medium text-gray-700 mb-3">
            How would you rate this tool?
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
                    ? "scale-110"
                    : "scale-100"
                }`}
                type="button"
              >
                <svg
                  className="w-10 h-10"
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
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Share your thoughts about this tool
          </label>
          <textarea
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
            rows="4"
            placeholder="Was the tool in good condition? Did it work well for your needs? Would you recommend it to others?"
            value={comment}
            onChange={handleCommentChange}
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl"
            type="button"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50"
            type="button"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal; 