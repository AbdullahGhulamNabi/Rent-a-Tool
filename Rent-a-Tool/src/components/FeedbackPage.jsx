import React, { useState } from "react";

function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Handle rating click
  const handleRating = (value) => {
    setRating(value);
  };

  // Handle comment change
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  // Handle submit
  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === "") {
      alert("Please provide both a rating and a comment.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Leave a Feedback</h2>
      
      {/* Product Information */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <div className="text-lg font-medium">Product: Wireless Bluetooth Headphones</div>
        <div className="text-gray-600">Order ID: #123456789</div>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <p className="text-lg font-medium mb-2">Rate the Product:</p>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill={rating >= star ? "#FFD700" : "#D3D3D3"}
              className="cursor-pointer"
              viewBox="0 0 24 24"
              onClick={() => handleRating(star)}
            >
              <path d="M12 .587l3.668 7.431 8.199 1.184-5.904 5.755 1.397 8.159-7.458-3.91-7.458 3.91 1.397-8.159-5.904-5.755 8.199-1.184z" />
            </svg>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <textarea
          className="w-full p-3 border rounded-md"
          rows="4"
          placeholder="Write your feedback here..."
          value={comment}
          onChange={handleCommentChange}
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        className="w-full py-2 bg-green-600 text-white rounded-md"
        onClick={handleSubmit}
      >
        Submit Feedback
      </button>

      {/* Submission Confirmation */}
      {submitted && (
        <div className="mt-4 text-green-600">
          <p>Thank you for your feedback! Your review has been submitted.</p>
        </div>
      )}
    </div>
  );
}

export default FeedbackPage;
