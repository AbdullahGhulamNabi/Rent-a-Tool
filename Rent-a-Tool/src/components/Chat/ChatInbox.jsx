import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Api_Route } from "../../config";
import { toast } from "react-hot-toast";

function ChatInbox() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
    // Set up polling for new messages
    const interval = setInterval(fetchChats, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        toast.error("Please login to view your chats");
        return;
      }

      const response = await fetch(`${Api_Route}/api/chats`, {
        headers: {
          'Authorization': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }

      const data = await response.json();
      setChats(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chats:", error);
      // Only show error toast on first load, not during polling
      if (loading) {
        toast.error("Failed to load your chats");
      }
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTotalUnreadCount = () => {
    return chats.reduce((total, chat) => total + chat.unreadCount, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Messages</h2>
          {getTotalUnreadCount() > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full h-5 px-2 flex items-center justify-center">
              {getTotalUnreadCount()} new
            </span>
          )}
        </div>
      </div>
      
      <div className="overflow-y-auto h-[calc(100%-60px)]">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No conversations yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Chat with tool owners or renters to coordinate your rentals
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {chats.map(chat => (
              <Link 
                key={chat._id} 
                to={`/dashboard/chat/${chat._id}`}
                className="block p-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <img 
                        src={chat.participants[0]?.profilePhoto 
                          ? `${Api_Route}/public/uploads/users/${chat.participants[0].profilePhoto}`
                          : '/Default_ProfilePic.png'} 
                        alt="Profile" 
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      {chat.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">
                        {chat.participants[0]?.firstName} {chat.participants[0]?.lastName}
                      </p>
                      {chat.lastMessage && (
                        <p className="text-sm text-gray-600 truncate w-48">
                          {chat.lastMessage.isFromUser ? 'You: ' : ''}{chat.lastMessage.text}
                        </p>
                      )}
                    </div>
                  </div>
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatTime(chat.lastMessage.time)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatInbox; 