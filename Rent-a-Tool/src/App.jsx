import { useState } from 'react'
import './App.css'
import Navbar from './components/HomePage/Navbar'
import LoggedNavbar from './components/Dashboard/LoggedNavbar'
import Footer from './components/HomePage/Footer'
import Home from './components/HomePage/Home'
import DashBoard from './components/Dashboard/Dashboard'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Example function to toggle login state
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };
  // write the code for checking if we are on dashboard page then show the dashboard otherwise navbar only

  return (

    <>
 {isLoggedIn ? (<DashBoard />  ) : (  <Navbar />)}
      {/* <DashBoard/> */}
      <Footer/>
    </>
  )
}

export default App
