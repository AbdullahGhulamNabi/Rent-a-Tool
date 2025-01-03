import { useState } from 'react'
import './App.css'
import Navbar from './components/Nav and Footer/Navbar'
import Footer from './components/Nav and Footer/Footer'
import Home from './components/Home Page/Home'
import Tools from './components/Home Page/Tools'

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
