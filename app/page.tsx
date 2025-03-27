"use client";
import React from "react";
import Image from "next/image";
import MultiStepAccordian from "@/components/MultistepAccordian";
import HeroCarousel from "@/components/HeroCarousel";
const Home = () => {
  return (
    <>
      <section className=" w-full h-full">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col py-[80px]">
            <p className="small-text">
              Smart Shopping Starts Here:
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={16}
                height={14}
              />
            </p>
            <h1 className="head-text">
              Unleash the Power of
              <span className="icon "> FitPrice</span>
            </h1>
            <p className="pt6">
              Powerful, self-serve product and growth analytics to help you
              convert, engage, and retain more users.
            </p>
            <MultiStepAccordian />
          </div>
          <div>
            <HeroCarousel />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
