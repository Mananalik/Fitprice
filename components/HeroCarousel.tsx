"use client"
import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
const heroImages = [
    {imgUrl:'/assets/images/hero-1.png', alt:'Muscleblaze'},
    {imgUrl:'/assets/images/hero-2.png', alt:'Fuelone'},
    {imgUrl:'/assets/images/hero-6.png', alt:'Bigmuscles'},
    {imgUrl:'/assets/images/hero-4.png', alt:'Pintola'},
    {imgUrl:'/assets/images/hero-5.png', alt:'Creatine'},
]
function HeroCarousel() {
  return (
    <div className='hero-carousel'>
         <Carousel
         showThumbs={false}
         autoPlay
         infiniteLoop
         interval={2000}
         showArrows={false}
         showStatus={false}
         >
               {heroImages.map((image)=>(
                <Image
                src = {image.imgUrl}
                alt={image.alt}
                width={484}
                height={484}
                key={image.alt}
                className='object-contain'

                />
               ))}
            </Carousel>
            <Image
            src="/assets/icons/hand-drawn-arrow.svg"
            alt="arrow-left"
            width={175}
            height={175}
            className='max-xl:hidden absolute -left-[15%] bottom-0 z-0'
            />
    </div>
  )
}

export default HeroCarousel 