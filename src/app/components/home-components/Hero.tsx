"use client";
import React from 'react'
import Slider from '../Slider'
import Link from 'next/link'
import { motion } from 'framer-motion'
import FastLinks from './FastLinks'


const Hero = () => {

    return (
        <div
            className='w-full mt-4  min-h-full  flex flex-col  items-center justify-start gap-3'
        >

            <div className='w-full min-h-full flex flex-col sm:flex-row-reverse gap-3 lg:gap-6 items-stretch justify-center'>
                <Slider />
                
            </div>


        </div>
    )
}

export default Hero