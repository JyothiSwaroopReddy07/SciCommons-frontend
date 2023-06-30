import React from 'react'
import './Home.css'
import NavBar from '../../Components/NavBar/NavBar'
import Footer from '../../Components/Footer/Footer'
import Testimonials from '../../Components/Testimonials'


const Home = () => {
  return (
    <>
        <NavBar />
        <Testimonials/>
        <Footer/>
    </>
  )
}

export default Home