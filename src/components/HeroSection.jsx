import React from 'react'
import { assets } from '../assets/assets/assets'
import { ArrowRight, Calendar1Icon, ClockIcon } from 'lucide-react'
import backgroundImage from '../assets/assets/backgroundImage.png';
import { useNavigate } from 'react-router-dom';
import disney from '../assets/disney.png'
const HeroSection = () => {

const navigate = useNavigate();

  return (
    <div className='flex flex-col items-start justify-center gap-4  px-6 md:px-16
     lg:px-36 bg-cover bg-center h-screen'  style={{ backgroundImage: `url(${'https://image.tmdb.org/t/p/original/7Zx3wDG5bBtcfk8lcnCWDOLM4Y4.jpg'})` }}>
        <img src={disney} alt="logo" className='max-h-24  lg:h-20 mt-20' />

    <h1 className='text-5xl md:text-[70px]  md:leading-18 font-semibold max-w-110'>Lilo and Stitch</h1>
    
    <div className='flex items-center gap-4 text-gray-100'>
        <span>Comedy | Adventure  | Sci-Fi</span>
        <div className='flex items-center gap-1'>
            <Calendar1Icon className='w-4.5 h-4.5'/> 2025
        </div>
         <div className='flex items-center gap-1'>
            <ClockIcon className='w-4.5 h-4.5'/> 1h 48m
        </div>
    </div>
   
    <p className='max-w-md text-gray-100'>Lilo & Stitch is a 2025 American science fiction comedy film produced by Walt Disney Pictures and Rideback, and distributed by Walt Disney Studios Motion Pictures.</p>
    <button onClick={()=> navigate('/movies')} className='flex items-center gap-1 px-6 py-3 text-sm bg-indigo-700 hover:bg-indigo-800 transition rounded-full font-medium cursor-pointer '>
        Explore Movies
        <ArrowRight className='w-5 h-5'/>
    </button>
    </div>
  )
}

export default HeroSection