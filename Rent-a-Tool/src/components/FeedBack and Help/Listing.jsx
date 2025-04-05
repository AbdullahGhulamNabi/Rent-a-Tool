import React, { useState, useEffect } from "react";
import { Api_Route } from "../../config";
import { toast } from "react-hot-toast";
import { toolService } from "../../services";

function Listing() {
  const [activeTab, setActiveTab] = useState("requests");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [requests, setRequests] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === "requests") {
      fetchRequests();
    } else if (activeTab === "offerings") {
      fetchOfferings();
    }
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        toast.error("Please login to view your requests");
        return;
      }

      const response = await fetch(`${Api_Route}/dashboard/quickLinks/getUserRequests`, {
        headers: {
          'Authorization': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      if (data.success) {
        // Filter to only show pending requests
        const pendingRequests = data.requests.filter(request => request.status === "pending");
        setRequests(pendingRequests || []);
      } else {
        throw new Error(data.msg || 'Failed to fetch requests');
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(error.message);
      toast.error("Failed to load your requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchOfferings = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        toast.error("Please login to view your offerings");
        return;
      }

      const response = await fetch(`${Api_Route}/api/tools/my-tools`, {
        headers: {
          'Authorization': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch offerings');
      }

      const tools = await response.json();
      // Filter only rented tools and ensure they have valid rentedTo data
      const rentedTools = tools.filter(tool => tool.rented && tool.rentedTo);
      setOfferings(rentedTools);
    } catch (error) {
      console.error("Error fetching offerings:", error);
      setError(error.message);
      toast.error("Failed to load your offerings");
    } finally {
      setLoading(false);
    }
  };

  const handleToolReceived = async (toolId) => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        toast.error("Please login to perform this action");
        return;
      }

      console.log("Marking tool as received:", toolId);
      
      const response = await toolService.returnTool(toolId);
      console.log("Success response:", response);
      
      toast.success("Tool marked as received successfully");
      // Refresh the offerings list
      fetchOfferings();
    } catch (error) {
      console.error("Error marking tool as received:", error);
      toast.error(error.message || "Failed to mark tool as received");
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
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Waiting for approval";
      case "accepted":
        return "Request Accepted";
      case "rejected":
        return "Request Rejected";
      case "completed":
        return "Tool Returned";
      default:
        return status;
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              activeTab === "requests" ? fetchRequests() : fetchOfferings();
            }}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[80px_1fr] md:grid-cols-[200px_1fr] h-screen transition-all duration-300">
      {/* Sidebar */}
      <aside className="bg-white border-r p-2 md:p-4 shadow-lg">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex items-center justify-center md:justify-start p-2 rounded-lg transition-all duration-200 ${
              activeTab === "requests"
                ? "bg-green-100 text-green-700 shadow-inner"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 md:mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="hidden md:inline font-medium">Requests</span>
          </button>

          <button
            onClick={() => setActiveTab("offerings")}
            className={`flex items-center justify-center md:justify-start p-2 rounded-lg transition-all duration-200 ${
              activeTab === "offerings"
                ? "bg-green-100 text-green-700 shadow-inner"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 md:mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
            <span className="hidden md:inline font-medium">Offerings</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center justify-center md:justify-start p-2 rounded-lg transition-all duration-200 ${
              activeTab === "chat"
                ? "bg-green-100 text-green-700 shadow-inner"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 md:mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="hidden md:inline font-medium">Chat</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="bg-gray-50 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            {activeTab === "requests" ? "My Requests" : "My Offerings"}
          </h1>

          <div className="grid gap-4">
            {/* Requests Tab Content */}
            {activeTab === "requests" && (
              loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No requests found</p>
                </div>
              ) : (
                requests.map((request) => {
                  if (!request.tool) return null;
                  return (
                    <div key={request._id} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{request.tool.name || 'Tool Name Not Available'}</h3>
                          <p className="text-gray-600 mt-1">{request.tool.description || 'No description available'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                      <div className="mt-4">
                        <p className="text-gray-500 text-sm">Price: RS {request.tool.price || 0} / day</p>
                        <p className="text-gray-400 text-sm mt-2">
                          Owner Name: {request.tool.owner?.firstName} {request.tool.owner?.lastName}
                        </p>
                      </div>
                      <div className={`mt-4 p-3 rounded-lg ${
                        request.status === "pending" 
                        ? "bg-yellow-50 text-yellow-700" 
                        : request.status === "accepted"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                      }`}>
                        <p className="text-sm">
                          {request.status === "pending" 
                            ? "Your request is waiting for approval from the tool owner." 
                            : request.status === "accepted"
                            ? "Your request has been accepted! Please contact the tool owner to arrange pickup."
                            : "Your request has been rejected by the tool owner."}
                        </p>
                      </div>
                    </div>
                  );
                })
              )
            )}

            {/* Offerings Tab Content */}
            {activeTab === "offerings" && (
              loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              ) : offerings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tools currently offered</p>
                </div>
              ) : (
                offerings.map((tool) => (
                  <div key={tool._id} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{tool.name}</h3>
                        <p className="text-gray-600 mt-1">{tool.description}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                        Rented Out
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-500 text-sm">Price: RS {tool.price || 0} / day</p>
                      {tool.rentedTo && tool.rentedTo.user ? (
                        <>
                          <p className="text-gray-400 text-sm mt-2">
                            Rented to: {tool.rentedTo.user.firstName} {tool.rentedTo.user.lastName}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Rented on: {new Date(tool.rentedTo.rentedAt).toLocaleDateString()}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-400 text-sm mt-2">
                          Renter information not available
                        </p>
                      )}
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => handleToolReceived(tool._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors font-medium"
                      >
                        Tool Received
                      </button>
                    </div>
                  </div>
                ))
              )
            )}

            {/* Chat Tab Content */}
            {activeTab === "chat" && (
              <div className="text-center py-8">
                <p className="text-gray-500">No messages found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Listing;