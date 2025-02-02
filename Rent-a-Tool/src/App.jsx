import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './components/Home'
import UserGuide from './components/Help'
import FeedbackPage from './components/FeedbackPage'
import Listing from './components/Listing'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

    
      <Navbar/>
      <UserGuide/>
      


      {/* <FeedbackPage/> */}

      {/* <Listing/> */}

      <Home/>
      <Footer/>
    </>
  )
}

export default App

