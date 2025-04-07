import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Api_Route } from "../../config";
import { toast } from "react-hot-toast";

function ChatConversation() {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUserId = JSON.parse(localStorage.getItem("userState"))?._id;
  const pollingIntervalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChat();
    
    // Set up polling for new messages
    pollingIntervalRef.current = setInterval(fetchChat, 5000); // Poll every 5 seconds
    
    // Mark messages as read when conversation is opened
    markMessagesAsRead();
    
    return () => {
      // Clear polling interval when component unmounts
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [chatId]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [chat?.messages]);

  const fetchChat = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        toast.error("Please login to view this conversation");
        return;
      }

      const response = await fetch(`${Api_Route}/api/chats/${chatId}`, {
        headers: {
          'Authorization': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }

      const data = await response.json();
      setChat(data);
      
      // Mark messages as read if there are any new messages
      const hasUnreadMessages = data.messages.some(m => 
        !m.read && m.sender._id !== currentUserId
      );
      
      if (hasUnreadMessages) {
        markMessagesAsRead();
      }
    } catch (error) {
      console.error("Error fetching conversation:", error);
      if (loading) {
        toast.error("Failed to load conversation");
      }
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) return;

      await fetch(`${Api_Route}/api/chats/${chatId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': token
        }
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    try {
      setSending(true);
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        toast.error("Please login to send messages");
        return;
      }

      const response = await fetch(`${Api_Route}/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: message })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Fetch updated chat after sending
      await fetchChat();
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const deleteChat = async () => {
    if (!window.confirm("Are you sure you want to delete this conversation? This cannot be undone.")) {
      return;
    }

    try {
      setDeleting(true);
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        toast.error("Please login to delete this chat");
        return;
      }

      const response = await fetch(`${Api_Route}/api/chats/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }

      toast.success("Chat deleted successfully");
      navigate("/dashboard/chat");
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px]">
        <p className="text-gray-600 mb-4">Conversation not found</p>
        <Link to="/dashboard/chat" className="text-blue-500 hover:underline">
          Back to Messages
        </Link>
      </div>
    );
  }

  // Get the other participant
  const otherParticipant = chat.participants.find(p => p._id !== currentUserId);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden min-h-[600px]">
      {/* Header */}
      <div className="bg-gray-50 p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/dashboard/chat" className="mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <img 
            src={otherParticipant?.profilePhoto 
              ? `${Api_Route}/Images/${otherParticipant.profilePhoto}`
              : '/Default_ProfilePic.png'} 
            alt="Profile" 
            className="h-10 w-10 rounded-full object-cover mr-3"
          />
          <div>
            <h2 className="font-medium">{otherParticipant?.firstName} {otherParticipant?.lastName}</h2>
          </div>
        </div>
        
        <button
          onClick={deleteChat}
          disabled={deleting}
          className="p-2 text-gray-500 hover:text-red-500 rounded-full flex items-center"
          title="Delete conversation"
        >
          {deleting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-red-500"></div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="text-sm hidden sm:inline">Delete</span>
            </>
          )}
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 min-h-[450px]">
        {chat.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-gray-200 p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-600">No messages yet</p>
            <p className="text-sm text-gray-500 mt-2">Send your first message to start the conversation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chat.messages.map((msg, index) => {
              const isFromMe = msg.sender._id === currentUserId;
              
              // Check if we should show the date
              const showDate = index === 0 || 
                new Date(msg.time).toDateString() !== new Date(chat.messages[index-1].time).toDateString();
              
              return (
                <React.Fragment key={index}>
                  {showDate && (
                    <div className="text-center my-4">
                      <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {formatDate(msg.time)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex items-end">
                      {!isFromMe && (
                        <img 
                          src={msg.sender.profilePhoto 
                            ? `${Api_Route}/Images/${msg.sender.profilePhoto}`
                            : '/Default_ProfilePic.png'} 
                          alt="Profile" 
                          className="h-8 w-8 rounded-full object-cover mr-2 mb-1"
                        />
                      )}
                      <div 
                        className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${
                          isFromMe 
                            ? 'bg-green-500 text-white rounded-br-none'
                            : 'bg-white border rounded-bl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${isFromMe ? 'text-green-100' : 'text-gray-500'}`}>
                          {formatTime(msg.time)}
                          {isFromMe && (
                            <span className="ml-2">
                              {msg.read ? '✓✓' : '✓'}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t bg-white">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Type a message..."
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!message.trim() || sending}
            className={`bg-green-500 text-white px-4 py-2 rounded-r-lg ${
              (!message.trim() || sending) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
            }`}
          >
            {sending ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11h2v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatConversation; 