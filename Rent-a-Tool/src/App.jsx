import { useState } from 'react'
import './App.css'
import Navbar from './components/Nav and Footer/Navbar'
import LoggedNavbar from './components/Dashboard/LoggedNavbar'
import Footer from './components/Nav and Footer/Footer'
import Home from './components/HomePage/Home'
import Tools from './components/HomePage/Tools'
import DashBoard from './components/Dashboard/Dashboard'
import Login from './components/Login and Sign Up/Login'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (

    <>
      {/* displays navbar with no setting, home and listing icon if user is not logged in*/}
      {/* {isLoggedIn ? (<DashBoard />  ) : (  <Navbar />)}  */}

      {/* temporarily used so that when click on login takes us to dashboard page */}
      {/* {!isLoggedIn && <Home setIsLoggedIn={setIsLoggedIn} />} */}
      {/* ==== */}
      {/* hello */}
      {/* <Tools/>
      <Footer/>  */}
      <Navbar/>
      
       <Home/>
    
    </>
  )
}

export default App
