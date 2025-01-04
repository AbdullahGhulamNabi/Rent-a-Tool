import { useState } from 'react'
import './App.css'
import Navbar from './components/Nav and Footer/Navbar'
import LoggedNavbar from './components/Dashboard/LoggedNavbar'
import Footer from './components/Nav and Footer/Footer'
import Home from './components/HomePage/Home'
import Tools from './components/HomePage/Tools'
import DashBoard from './components/Dashboard/Dashboard'

function App() {

  return (

    <>
      {/* displays navbar with no setting, home and listing icon if user is not logged in*/}
      {/* <Navbar/> */}
      <Home/>
      <Tools/>
      <Footer/>
    </>
  )
}

export default App
