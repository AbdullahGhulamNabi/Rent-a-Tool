export const reducer = (state, action) => {
    switch (action.type) {
        case "USER":
            // Save user state to localStorage when user logs in
            localStorage.setItem("userState", JSON.stringify(action.payload));
            return action.payload;
        
        case "SET_PROFILE_IMAGE":
            const updatedState = {
                ...state,
                profileImage: action.payload
            };
            localStorage.setItem("userState", JSON.stringify(updatedState));
            return updatedState;
        
        case "LOGOUT":
            // Clear localStorage when user logs out
            localStorage.removeItem("userState");
            localStorage.removeItem("jwt_token");
            return null;
        
        default:
            return state;
    }
};

export const initialState = null;