const API_BASE_URL = 'http://localhost:3000';

// Function to get the JWT token from localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
};

// Tool Services
export const toolService = {
    // Get all tools
    getAllTools: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tools`);
            return handleResponse(response);
        } catch (error) {
            throw error.message || 'Failed to fetch tools';
        }
    },

    // Get a single tool by ID
    getToolById: async (toolId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tools/${toolId}`);
            return handleResponse(response);
        } catch (error) {
            throw error.message || 'Failed to fetch tool';
        }
    },

    // Create a new tool
    createTool: async (toolData) => {
        try {
            const formData = new FormData();
            formData.append('name', toolData.name);
            formData.append('description', toolData.description);
            formData.append('price', toolData.price);
            if (toolData.image) {
                formData.append('image', toolData.image);
            }

            const response = await fetch(`${API_BASE_URL}/api/tools`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                },
                body: formData
            });

            return handleResponse(response);
        } catch (error) {
            throw error.message || 'Failed to create tool';
        }
    },

    // Update a tool
    updateTool: async (toolId, toolData) => {
        try {
            const formData = new FormData();
            formData.append('name', toolData.name);
            formData.append('description', toolData.description);
            formData.append('price', toolData.price);
            if (toolData.image) {
                formData.append('image', toolData.image);
            }

            const response = await fetch(`${API_BASE_URL}/api/tools/${toolId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                },
                body: formData
            });

            return handleResponse(response);
        } catch (error) {
            throw error.message || 'Failed to update tool';
        }
    },

    // Delete a tool
    deleteTool: async (toolId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tools/${toolId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            return handleResponse(response);
        } catch (error) {
            throw error.message || 'Failed to delete tool';
        }
    },

    // Rent a tool
    rentTool: async (toolId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tools/${toolId}/rent`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            return handleResponse(response);
        } catch (error) {
            throw error.message || 'Failed to rent tool';
        }
    },

    // Return a rented tool
    returnTool: async (toolId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/tools/${toolId}/return`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            return handleResponse(response);
        } catch (error) {
            throw error.message || 'Failed to return tool';
        }
    }
};

export default toolService; 