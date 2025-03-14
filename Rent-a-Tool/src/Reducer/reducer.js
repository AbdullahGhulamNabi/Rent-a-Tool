export const reducer = (state, action) => {
    if (action.type === "USER") {
      return action.payload;
    }
  
    if(action.type == "SET_PROFILE_IMAGE"){
      return { ...state, profileImage: action.payload }
    }
  
    return state;
  };
  
export const initialState = null;