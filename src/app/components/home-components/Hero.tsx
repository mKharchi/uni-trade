"use client";
import React from 'react'
import Slider from '../Slider'
import Link from 'next/link'
import { motion } from 'framer-motion'
import FastLinks from './FastLinks'


const Hero = () => {

    return (
        <div
            className='w-full my-4 md:my-8 lg:my-16 flex flex-col  items-center justify-center gap-3'
        >

            <div className='w-full flex flex-col md:flex-row-reverse gap-3 md:gap-6 items-stretch justify-center'>
                <Slider />
                <FastLinks />

            </div>


        </div>
    )
}

export default Hero