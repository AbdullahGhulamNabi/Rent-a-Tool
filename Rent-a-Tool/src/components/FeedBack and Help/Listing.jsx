import React, { useState } from "react";

function Listing() {
  const [activeTab, setActiveTab] = useState("requests");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sample data for all tabs
  const requestsData = [
    {
      name: "Abdullah Denver",
      title: "Chairs",
      description: "For party at home...",
      date: "Jan 04 - Jan 05",
      status: "Moderation",
      approvalMessage: "Your request is waiting for approval and is not visible to the public yet.",
      messages: "No messages yet",
    },
    {
      name: "Usama Denver",
      title: "Tables",
      description: "Needed for a conference...",
      date: "Feb 10 - Feb 12",
      status: "Moderation",
      approvalMessage: "Your request is waiting for approval and is not visible to the public yet.",
      messages: "No messages yet",
    },
  ];

  const offeringsData = [
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

  const chatData = [
    {
      participant: "Ali Ahmed",
      lastMessage: "Hi! I'm interested in your chairs...",
      time: "2h ago",
      unread: 3,
    },
    {
      participant: "Sara Khan",
      lastMessage: "When can I pick up the tent?",
      time: "4h ago",
      unread: 0,
    },
    {
      participant: "John Doe",
      lastMessage: "Thanks for the confirmation!",
      time: "1d ago",
      unread: 1,
    },
  ];

  return (
    <div className="grid grid-cols-[80px_1fr] md:grid-cols-[200px_1fr] h-screen transition-all duration-300">
      {/* Sidebar (unchanged) */}
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

          {/* New Chat Tab */}
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
            {activeTab === "requests" 
              ? "My Requests" 
              : activeTab === "offerings" 
              ? "My Offerings" 
              : "Chat"}
          </h1>

          <div className="grid gap-4">
            {/* Requests Tab Content */}
            {activeTab === "requests" && requestsData.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 mt-1">{item.title}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    item.status === "Moderation" 
                    ? "bg-yellow-100 text-yellow-700" 
                    : "bg-green-100 text-green-700"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-3">{item.description}</p>
                <p className="text-gray-400 text-sm mt-2">{item.date}</p>
                <div className={`mt-4 p-3 rounded-lg ${
                  item.status === "Moderation" 
                  ? "bg-yellow-50 text-yellow-700" 
                  : "bg-green-50 text-green-700"
                }`}>
                  <p className="text-sm">{item.approvalMessage}</p>
                </div>
                <div className="mt-3 flex items-center text-gray-500 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {item.messages}
                </div>
              </div>
            ))}

            {/* Offerings Tab Content */}
            {activeTab === "offerings" && offeringsData.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                {/* Same structure as Requests */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 mt-1">{item.title}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    item.status === "Moderation" 
                    ? "bg-yellow-100 text-yellow-700" 
                    : "bg-green-100 text-green-700"
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-3">{item.description}</p>
                <p className="text-gray-400 text-sm mt-2">{item.date}</p>
                <div className={`mt-4 p-3 rounded-lg ${
                  item.status === "Moderation" 
                  ? "bg-yellow-50 text-yellow-700" 
                  : "bg-green-50 text-green-700"
                }`}>
                  <p className="text-sm">{item.approvalMessage}</p>
                </div>
                <div className="mt-3 flex items-center text-gray-500 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {item.messages}
                </div>
              </div>
            ))}

            {/* Chat Tab Content */}
            {activeTab === "chat" && chatData.map((chat, index) => (
              <div key={index} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-gray-500">{chat.participant[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{chat.participant}</h3>
                      <p className="text-gray-600 text-sm">{chat.lastMessage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{chat.time}</p>
                    {chat.unread > 0 && (
                      <span className="bg-green-500 text-white rounded-full px-2 py-1 text-xs mt-1 inline-block">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Listing;