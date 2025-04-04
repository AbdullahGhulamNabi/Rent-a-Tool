import React, { useState, useEffect } from "react";
import { Api_Route } from "../../config";
import { toast } from "react-hot-toast";

function ToolRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        toast.error("Please login to view requests");
        return;
      }

      const response = await fetch(`${Api_Route}/dashboard/quickLinks/getToolRequests`, {
        headers: {
          'Authorization': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      if (data.success) {
        setRequests(data.requests || []);
      } else {
        throw new Error(data.msg || 'Failed to fetch requests');
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requesterId, toolId, status) => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        toast.error("Please login to perform this action");
        return;
      }

      const response = await fetch(`${Api_Route}/dashboard/quickLinks/updateRequestStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          requesterId,
          toolId,
          status
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(data.msg);
        // Refresh the requests list
        fetchRequests();
      } else {
        throw new Error(data.msg || 'Failed to update request');
      }
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error(error.message || "Failed to update request");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tool Requests</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No requests found for your tools</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <div key={request._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{request.tool.name}</h2>
                  <p className="text-gray-600 mt-1">{request.tool.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>

              <div className="mt-4 border-t pt-4">
                <h3 className="font-medium text-gray-700">Requester Details:</h3>
                <p className="text-gray-600">Name: {request.requester.firstName} {request.requester.lastName}</p>
                <p className="text-gray-600">Email: {request.requester.email}</p>
                <p className="text-gray-600">Phone: {request.requester.phoneNumber}</p>
              </div>

              {request.status === "pending" && (
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => handleRequestAction(request.requester._id, request.tool._id, "accepted")}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Accept Request
                  </button>
                  <button
                    onClick={() => handleRequestAction(request.requester._id, request.tool._id, "rejected")}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Reject Request
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ToolRequests; 