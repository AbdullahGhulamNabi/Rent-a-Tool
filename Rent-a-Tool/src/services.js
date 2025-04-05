const API_BASE_URL = 'http://localhost:3000';

// Helper function to get the logged-in user's ID
// const getLoggedInUserId = () => {
//     // const userString = localStorage.getItem('user');
//     // if (!userString) {
//     //     console.log("User not found in localStorage.");
//     //     return null;
//     // }

//     // try {
//     //     const user = JSON.parse(userString);
//     //     console.log("User Data:", user);
//     //     return user._id || null;
//     // } catch (error) {
//     //     console.error("Error parsing user data:", error);
//     //     return null;
//     // }
//   const userExists = await User.findOne({ email: signUPDetails.email });

// };

const getLoggedInUserEmail = () => {
    const userString = localStorage.getItem("user");
    if (!userString) {
        console.log("User not found in localStorage.");
        return null;
    }

    try {
        const user = JSON.parse(userString);
        console.log("User Email:", user.email);
        return user.email || null;
    } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
    }
};

// Helper function to get the auth token
const getAuthToken = () => {
    const token = localStorage.getItem('token');
    console.log("Token:", token)
    return token ? `Bearer ${token}` : null;
};

// Helper function to handle API responses
const handleResponse = async (response) => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        return data;
    }
    throw new Error('Invalid response format');
};

// Tool Services
export const toolService = {
    // Get all tools (public)
    getAllTools: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tools`);
            return handleResponse(response);
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch tools');
        }
    },

    // Get logged-in user's tools
    getMyTools: async () => {
        try {
           
            const response = await fetch(`${API_BASE_URL}/api/tools/my-tools`, {
                headers: {
                    'Authorization': localStorage.getItem("jwt_token")
                }
            });
            return handleResponse(response);
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch your tools');
        }
    },

// Get all tools except the logged-in user's tools
getOtherTools: async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tools/other-tools`, {
            headers: {
                'Authorization': localStorage.getItem("jwt_token")
            }
        });
        return handleResponse(response);
    } catch (error) {
        throw new Error(error.message || 'Failed to fetch other users\' tools');
    }
},


    // Get a single tool by ID
    getToolById: async (toolId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tools/${toolId}`);
            return handleResponse(response);
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch tool');
        }
    },

    // Create a new tool
    createTool: async (toolData) => {
        try {
 
            if (toolData.image && !toolData.image.type.startsWith('image/')) {
                throw new Error('Only image files are allowed');
            }

            if (toolData.image && toolData.image.size > 5 * 1024 * 1024) {
                throw new Error('File size is too large. Maximum size is 5MB');
            }

            const formData = new FormData();
            formData.append('name', toolData.name);
            formData.append('description', toolData.description);
            formData.append('price', toolData.price || 0);
            if (toolData.image) {
                formData.append('image', toolData.image);
            }

            const response = await fetch(`${API_BASE_URL}/api/tools`, {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem("jwt_token")
                    
                },
                body: formData
            });

            return handleResponse(response);
        } catch (error) {
            throw new Error(error.message || 'Failed to create tool');
        }
    },

    // Update a tool
    updateTool: async (toolId, toolData) => {
        try {
            // Validate image file if provided
            if (toolData.image && !toolData.image.type.startsWith('image/')) {
                throw new Error('Only image files are allowed');
            }

            if (toolData.image && toolData.image.size > 5 * 1024 * 1024) {
                throw new Error('File size is too large. Maximum size is 5MB');
            }

            const formData = new FormData();
            formData.append('name', toolData.name);
            formData.append('description', toolData.description);
            formData.append('price', toolData.price || 0);
            if (toolData.image) {
                formData.append('image', toolData.image);
            }

            const response = await fetch(`${API_BASE_URL}/api/tools/${toolId}`, {
                method: 'PUT',
                body: formData
            });

            return handleResponse(response);
        } catch (error) {
            throw new Error(error.message || 'Failed to update tool');
        }
    },

    // Delete a tool
    deleteTool: async (toolId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tools/${toolId}`, {
                method: 'DELETE'
            });

            return handleResponse(response);
        } catch (error) {
            throw new Error(error.message || 'Failed to delete tool');
        }
    },

    // Rent a tool
    rentTool: async (toolId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tools/${toolId}/rent`, {
                method: 'POST'
            });

            return handleResponse(response);
        } catch (error) {
            throw new Error(error.message || 'Failed to rent tool');
        }
    },

    // Return a rented tool
    returnTool: async (toolId) => {
        try {
            const token = localStorage.getItem("jwt_token");
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`${API_BASE_URL}/api/tools/${toolId}/return`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });

            return handleResponse(response);
        } catch (error) {
            throw new Error(error.message || 'Failed to return tool');
        }
    },

    // Request a tool
    requestTool: async (toolId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tools/${toolId}/request`, {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem("jwt_token")
                }
            });
            return handleResponse(response);
        } catch (error) {
            throw new Error(error.message || 'Failed to request tool');
        }
    }
};

export default toolService; 