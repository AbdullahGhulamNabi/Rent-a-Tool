import UserGuide from "./components/FeedBack and Help/Help";
import FeedbackPage from "./components/Feedback and Help/FeedBackPage";
import {
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useNavigate
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Nav and Footer/Navbar";
import Footer from "./components/Nav and Footer/Footer";
import LoginModal from "./components/Login and Sign Up/Login";
import SignUpModal from "./components/Login and Sign Up/SignUp";
import Home from "./components/HomePage/Home";
import Tools from "./components/HomePage/Tools";
import DashBoard from "./components/Dashboard/Dashboard";
import MyTools from "./components/Dashboard/MyTools";
import SettingsModal from "./components/Dashboard/Modal";
import Help from "./components/FeedBack and Help/Help";
// import Help from "./components/FeedBack and Help/Help";
import Listing from "./components/FeedBack and Help/Listing";
import ToolDetail from "./components/Tool-Description/ToolDetail";
import AddUpdate from "./components/Add-Update/AddUpdate";
import ChatInterface from "./components/Chat-Module/ChatInterface";
import SignUp from "./components/Login and Sign Up/SignUp";
import Order from "./components/Order Tool/Order";
import { createContext, useReducer, useState, useEffect} from "react";
import { reducer, initialState } from "./Reducer/reducer"; 
import ToolDetailsLanding from "./components/Tool-Description/ToolDetailsLanding";
import TermsAndPolicy from "./components/FeedBack and Help/TermsAndPolicy";
import { Api_Route } from "./config";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("jwt_token");

  useEffect(() => {
    if (token && window.location.pathname === "/") {
      window.location.replace("/Dashboard"); 
    }

    if (token) {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", function () {
        window.history.pushState(null, "", window.location.href);
      });
    }
  }, [token]);

  return token ? children : <Navigate to="/" />;
}


const RoutesOfRent_a_Tool = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Outlet />
        <Footer />
      </>
    ),

    children: [
      {
        index: true,
        element: (
          <>
            <Home />
            <Tools />
          </>
        ),
      },
      //new path add for user help
      {
        path: "help",
        element: <Help />
      },
      {
        path: "terms",
        element: <TermsAndPolicy />
      },
      {
        path: "Dashboard",
        element: (
          <>
            <PrivateRoute>
              <Outlet />
            </PrivateRoute>
          </>
        ),
        children: [
          {
            index: true,
            element: (
              <>
                <DashBoard />
                <MyTools />
              </>
            ),
          },
          { path: "Listing", element: <Listing /> },
          { path: "Help", element: <Help /> },
          { path: "Tools", element: <Tools /> },
        ],
      },
      {
        path: "ToolDescription",
        element: <Outlet />,
        children: [
          { index: true, element: <ToolDetail /> },
          {
            path: "Chat",
            element: (
              <>
                <PrivateRoute>
                  <ChatInterface />
                </PrivateRoute>
              </>
            ),
          },
          {
            path: "Order",
            element: (
              <>
                <PrivateRoute>
                  <Order />
                </PrivateRoute>
              </>
            ),
          },
          {
            path: "Listing",
            element: (
              <>
                <PrivateRoute>
                <Listing /> 
               </PrivateRoute>
              </>
            ),
          },
          {
            path: "Feedback",
            element: (
              <>
                <PrivateRoute>
                  <FeedbackPage />
                </PrivateRoute>
              </>
            ),
          },
        ],
      },
      {
        path: "ToolDescriptions",
        element: <Outlet />,
        children: [
          { index: true, element: <ToolDetailsLanding /> },
          {
            path: "Chat",
            element: (
              <>
                <PrivateRoute>
                  <ChatInterface />
                </PrivateRoute>
              </>
            ),
          },
          {
            path: "Order",
            element: (
              <>
                <PrivateRoute>
                  <Order />
                </PrivateRoute>
              </>
            ),
          },
          {
            path: "Listing",
            element: (
              <>
                <PrivateRoute>
                  <Listing />
                </PrivateRoute>
              </>
            ),
          },
          {
            path: "Feedback",
            element: (
              <>
                <PrivateRoute>
                  <FeedbackPage />
                </PrivateRoute>
              </>
            ),
          },
        ],
      },
      {
        path: "Tools",
        element: <Tools />,
      },
    ],
  },
]);



export const UserContext = createContext();
function App() {
  const [state, dispatch] = useReducer(reducer, null);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        try {
          const response = await fetch(`${Api_Route}/api/user/profile`, {
            headers: {
              Authorization: token,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            dispatch({ type: "USER", payload: userData });
          } else {
            // If token is invalid, clear localStorage
            localStorage.removeItem("jwt_token");
            localStorage.removeItem("userState");
            dispatch({ type: "LOGOUT" });
          }
        } catch (error) {
          console.error("Error validating token:", error);
          localStorage.removeItem("jwt_token");
          localStorage.removeItem("userState");
          dispatch({ type: "LOGOUT" });
        }
      }
    };

    validateToken();
  }, []);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <RouterProvider router={RoutesOfRent_a_Tool} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </UserContext.Provider>
  );
}

export default App;
