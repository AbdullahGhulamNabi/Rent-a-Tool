import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './components/Home'
import UserGuide from './components/Help'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

    
      <Navbar/>
      <UserGuide/>
      <Home/>
      <Footer/>
    </>
  )
}

export default App
