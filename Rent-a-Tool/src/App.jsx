import React, { useState } from 'react';
import { Routes, Route, createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/Nav and Footer/Navbar';
import NavbarForLoggedIn from './components/Nav and Footer/NavbarForLoggedIn';
import Footer from './components/Nav and Footer/Footer';
import LoginModal from "./components/Login and Sign Up/Login";
import SignUpModal from "./components/Login and Sign Up/SignUp";
import Home from './components/HomePage/Home';
import Tools from './components/HomePage/Tools';
import DashBoard from './components/Dashboard/Dashboard';
import MyTools from './components/Dashboard/MyTools';
import SettingsModal from "./components/Dashboard/Modal";
import FeedBackPage from "./components/FeedBack and Help/FeedbackPage"
import Help from "./components/FeedBack and Help/Help"
// import UserGuide from './components/Help'
import Listing from "./components/FeedBack and Help/Listing"
import ToolDetail from './components/Tool-Description/ToolDetail';
import AddUpdate from './components/Add-Update/AddUpdate';
import ChatInterface from './components/Chat-Module/ChatInterface';
import SignUp from './components/Login and Sign Up/SignUp';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element:
        <div>
          <Navbar />
          <Home />
          <Tools />
          <Footer />
        </div>
    },
    {
      path: "/Dashboard",
      element: (
        <div>
          <NavbarForLoggedIn />
          <Outlet />
          <Footer />
        </div>
      ),
      children: [
        {
          index: true, // Default content for "/dashboard"
          element: (
            <div>
              <DashBoard />
              <MyTools />
            </div>
          ),
        },
        {
          path: "Listing",
          element: <Listing />,
        },
        {
          path: "Help",
          element: <Help />,
        },
        {
          path:"Tools",
          element:<Tools/>
        }
      ],
    },
    {
      path: '/ToolDescription',
      element:
      <div>
        <Navbar/>
        <ToolDetail/>
          <Footer />
      </div>
    },
    {
      path: '/Tools',
      element:
      <div>
        <Navbar/>
        <Tools/>
          <Footer />
      </div>
    }

  ]
)

function App() {


  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
