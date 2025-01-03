import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';

import './App.css'
import Navbar from './components/Nav and Footer/Navbar'
import LoggedNavbar from './components/Dashboard/LoggedNavbar'
import Footer from './components/Nav and Footer/Footer'
import Home from './components/HomePage/Home'
import Tools from './components/HomePage/Tools'
import DashBoard from './components/Dashboard/Dashboard'
import Login from './components/Login and Sign Up/Login'
import SignUp from './components/Login and Sign Up/SignUp';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (

    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        {/* <Route path='/dashboard' element={<DashBoard />} /> */}
        <Route path='/signup' element={<SignUp />} />
      </Routes>
      <Footer />
      {/* <Navbar/>
      <Footer />  */}

    </>
  )
}

export default App
