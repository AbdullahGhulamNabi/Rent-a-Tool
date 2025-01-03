import { useState } from 'react'
import './App.css'
import Navbar from './components/Nav and Footer/Navbar'
import Footer from './components/Nav and Footer/Footer'
import Home from './components/HomePage/Home'
import Tools from './components/HomePage/Tools'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>
      <Home/>
      <Tools/>
      <Footer/>
    </>
  )
}

export default App
