import { useState } from 'react'
import './App.css'
import Navbar from './components/HomePage/Navbar'
import Footer from './components/HomePage/Footer'
import Home from './components/HomePage/Home'

function App() {
  const [count, setCount] = useState(0)

  return (

    <>
      <Navbar/>    
      <Home/>  
      <Footer/>
    </>
  )
}

export default App
