import React, { useState } from "react";

function Listing() {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <div className="grid grid-cols-[200px_1fr] md:grid-cols-[200px_1fr] h-screen">
      {/* Sidebar */}
      <aside className="m-4 bg-gray-50 border-r p-4">
        <button
          onClick={() => setActiveTab("requests")}
          className={`w-full py-2 text-left font-semibold rounded mb-2 ${
            activeTab === "requests"
              ? "bg-green-100 border-b-2 border-green-300"
              : "hover:bg-gray-100"
          }`}
        >
          My Requests
        </button>
        <button
          onClick={() => setActiveTab("offerings")}
          className={`w-full py-2 text-left font-semibold rounded ${
            activeTab === "offerings"
              ? "bg-green-100 border-b-2 border-green-300"
              : "hover:bg-gray-100"
          }`}
        >
          My Offerings
        </button>
      </aside>

      {/* Main Content */}
      <main className="p-4 bg-gray-100 flex-1 overflow-y-auto">
        {/* Requests Tab */}
        {activeTab === "requests" && (
          <>
            {[
              {
                name: "Abdullah ",
                title: "Chairs",
                description: "For party at home...",
                date: "Jan 04 - Jan 05",
                status: "Moderation",
                approvalMessage:
                  "Your request is waiting for approval and is not visible to the public yet.",
                messages: "No messages yet",
              },
              {
                name: "Usama ",
                title: "Tables",
                description: "Needed for a conference...",
                date: "Feb 10 - Feb 12",
                status: "Moderation",
                approvalMessage:
                  "Your request is waiting for approval and is not visible to the public yet.",
                messages: "No messages yet",
              },
            ].map((request, index) => (
              <div
                key={index}
                className="bg-white border rounded p-4 mb-4 shadow-sm"
              >
                <div className="font-bold text-lg">{request.name}</div>
                <p className="text-gray-700 font-semibold">{request.title}</p>
                <p className="text-gray-600">{request.description}</p>
                <p className="text-gray-500 text-sm">{request.date}</p>
                <span className="text-red-600 text-sm">{request.status}</span>
                <div className="bg-yellow-100 text-yellow-800 p-2 rounded mt-2">
                  {request.approvalMessage}
                </div>
                <div className="text-gray-500 text-sm mt-2">
                  {request.messages}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Offerings Tab */}
        {activeTab === "offerings" && (
          <>
            {[
              {
                name: "Ali Lahore",
                title: "Party Tents",
                description: "For outdoor events...",
                date: "Jan 15 - Jan 20",
                status: "Available",
                approvalMessage:
                  "Your offering is live and visible to others.",
                messages: "3 inquiries received",
              },
              {
                name: "Sara Khan",
                title: "Sound System",
                description: "High-quality speakers for events...",
                date: "Feb 05 - Feb 07",
                status: "Available",
                approvalMessage:
                  "Your offering is live and visible to others.",
                messages: "1 inquiry received",
              },
            ].map((offering, index) => (
              <div
                key={index}
                className="bg-white border rounded p-4 mb-4 shadow-sm"
              >
                <div className="font-bold text-lg">{offering.name}</div>
                <p className="text-gray-700 font-semibold">{offering.title}</p>
                <p className="text-gray-600">{offering.description}</p>
                <p className="text-gray-500 text-sm">{offering.date}</p>
                <span className="text-green-600 text-sm">{offering.status}</span>
                <div className="bg-green-100 text-green-800 p-2 rounded mt-2">
                  {offering.approvalMessage}
                </div>
                <div className="text-gray-500 text-sm mt-2">
                  {offering.messages}
                </div>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}

export default Listing;
