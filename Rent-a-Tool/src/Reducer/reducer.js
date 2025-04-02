export const reducer = (state, action) => {
    switch (action.type) {
        case "USER":
            return action.payload;
        
        case "SET_PROFILE_IMAGE":
            return { ...state, profileImage: action.payload };
        
        case "LOGOUT":
            return null;
        
        default:
            return state;
    }
};

export const initialState = null;