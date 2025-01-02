import { useState } from 'react'
import './App.css'
import Navbar from './components/HomePage/Navbar'
import LoggedNavbar from './components/Dashboard/LoggedNavbar'
import Footer from './components/HomePage/Footer'
import Home from './components/HomePage/Home'
import DashBoard from './components/Dashboard/Dashboard'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (

    <>
      {/* displays navbar with no setting, home and listing icon if user is not logged in*/}
      {isLoggedIn ? (<DashBoard />  ) : (  <Navbar />)} 

      {/* temporarily used so that when click on login takes us to dashboard page */}
      {!isLoggedIn && <Home setIsLoggedIn={setIsLoggedIn} />}
      <Footer/>
    </>
  )
}

export default App
