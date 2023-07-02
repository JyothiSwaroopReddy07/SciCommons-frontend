import React from 'react'
import './Home.css'
import NavBar from '../../Components/NavBar/NavBar'
import Footer from '../../Components/Footer/Footer'
import Testimonials from '../../Components/Testimonials/Testimonials'
import HeroBanner from '../../Components/HeroBanner/HeroBanner'
import Features from '../../Components/Features/Features'



const Home = () => {
  return (
    <>
        <NavBar />
        <HeroBanner/>
        <Features/>
        <Testimonials/>
        <Footer/>
    </>
  )
}

export default Home