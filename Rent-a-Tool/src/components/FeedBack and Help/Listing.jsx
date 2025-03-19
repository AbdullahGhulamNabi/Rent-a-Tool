import React, { useState, useEffect } from "react";
import { Api_Route } from '../../config';

function Listing() {
  const [activeTab, setActiveTab] = useState("requests");
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hardcoded data for offerings
  const hardcodedOfferings = [
    {
      name: "Ali Lahore",
      title: "Party Tents",
      description: "For outdoor events...",
      date: "Jan 15 - Jan 20",
      status: "Available",
      approvalMessage: "Your offering is live and visible to others.",
      messages: "3 inquiries received",
    },
    {
      name: "Sara Khan",
      title: "Sound System",
      description: "High-quality speakers for events...",
      date: "Feb 05 - Feb 07",
      status: "Available",
      approvalMessage: "Your offering is live and visible to others.",
      messages: "1 inquiry received",
    },
  ];

  useEffect(() => {
    if (activeTab === "requests") {
      fetchRequestedTools();
    }
  }, [activeTab]);

  async function fetchRequestedTools() {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) return;

      setLoading(true);
      const response = await fetch(`${Api_Route}/toolsRequested/request`, {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      
      if (data.success) {
        const transformedData = data.data.map(item => ({
          name: `${item.firstName} ${item.lastName}`.trim() || "Owner Name",
          title: item.Name,
          description: item.description,
          date: new Date(item.createdAt).toLocaleDateString(),
          status: item.status || "Pending",
          approvalMessage: item.status.toLowerCase() === "accepted" 
            ? "Your request is approved and visible to the public" 
            : "Your request is waiting for approval",
          // messages: item.messagesCount > 0 
          //   ? `${item.messagesCount} messages received` 
          //   : "No messages yet"
        }));
        setApiData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching requested tools:", error);
      setApiData([]);
    } finally {
      setLoading(false);
    }
  }

  const renderItem = (item, index) => (
    <div
      key={index}
      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {item.name}
          </h3>
          <p className="text-gray-600 mt-1">{item.title}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            item.status === "Pending" || item.status === "Moderation"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {item.status}
        </span>
      </div>

      <p className="text-gray-500 text-sm mt-3">{item.description}</p>
      <p className="text-gray-400 text-sm mt-2">{item.date}</p>

      <div
        className={`mt-4 p-3 rounded-lg ${
          item.status === "Pending" || item.status === "Moderation"
            ? "bg-yellow-50 text-yellow-700"
            : "bg-green-50 text-green-700"
        }`}
      >
        <p className="text-sm">{item.approvalMessage}</p>
      </div>

      <div className="mt-3 flex items-center text-gray-500 text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        {item.messages}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-[80px_1fr] md:grid-cols-[200px_1fr] h-screen transition-all duration-300">
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
            <span className="hidden md:inline font-medium">My Requests</span>
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
            <span className="hidden md:inline font-medium">My Offerings</span>
          </button>
        </div>
      </aside>

      <main className="bg-gray-50 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            {activeTab === "requests" ? "My Requests" : "My Offerings"}
          </h1>

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4">Loading requests...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {activeTab === "requests" ? (
                apiData.length > 0 ? (
                  apiData.map(renderItem)
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No requests found
                  </div>
                )
              ) : (
                hardcodedOfferings.map(renderItem)
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Listing;