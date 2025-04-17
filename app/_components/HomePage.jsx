"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import hero from "../../public/hero.png";
import { useRef, useState } from "react";
import {
  motion,
  Variants,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import tech1 from "@/public/tech-1.png";
import tech2 from "@/public/tech-2.png";
import tech3 from "@/public/tech-4.png";
import banner from "@/public/process-banner.png";
import * as variants from "@/lib/motionVariants";
import { Box, BoxIcon, CreditCard, Laptop, ShoppingBag, X } from "lucide-react";
import Link from "next/link";

import { PeopleReact } from "./PeopleReact";
import { AnimatedTestimonialsDemo } from "./AboutUs";
import Pricing from "./Pricing";
import Footer from "./Footer";

// import videoTO from "@/public/TutorislViedio.mp4";

const heroMotion = {
  start: {},
  end: {
    transition: {
      staggerChildren: 0.4,
    },
  },
};
const chlideMotion = {
  start: {
    y: 30,
    opacity: 0,
    filter: "blur(50px)",
  },
  end: {
    y: 0,
    opacity: 1,
    filter: "blur(0)",
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};
function HomePage() {
  const homeRef = useRef(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Add to iframe: onLoad={() => setIsLoading(false)}
  // Show spinner while loading

  const { scrollYProgress } = useScroll({
    target: homeRef,
    offset: ["start 1080px", "50% start"],
  });

  const scrollYTransform = useTransform(scrollYProgress, [0, 1], [0.85, 1]);

  const scale = useSpring(scrollYTransform, {
    stiffness: 300,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <div>
      <div className="p-10">
        <section className=" md:px-16">
          <motion.div
            variants={heroMotion}
            initial="start"
            animate="end"
            className=" container text-center"
          >
            <div className="max-w-screen-md mx-auto">
              <motion.p
                variants={chlideMotion}
                className="text-sm uppercase tracking-wider bg-secondary/50 text-secondary-foreground max-w-max mx-auto px-3 py-1 rounded-full border-t border-primary/10 backdrop-blur-3xl mb-5 md:mb-8"
              >
                A Community Built on Giving
              </motion.p>

              <motion.h2
                variants={chlideMotion}
                className="text-4xl font-semibold !leading-tight mb-4 md:text-5xl lg:text-6xl"
              >
                Give More, Waste Less!
                {/* <span className="relative ms-4">
              <span className=" absolute -z-10 top-2 -left-6 -right-4 bottom-0.5  rounded-full px-8 ms-3 shadow-[insrt_0px_0px_50px_10px] shadow-primary md:top-3 md:bottom-1 lg:top-4 lg:bottom-2"></span>
            </span> */}
              </motion.h2>
              <motion.p
                variants={chlideMotion}
                className="text-muted-foreground md:text-xl"
              >
                Ne3ma makes donating easy, impactful, and sustainable helping
                communities while reducing waste.
              </motion.p>

              <motion.div
                variants={chlideMotion}
                className="flex justify-center gap-2 mt-6 md:mt-10 z-20"
              >
                <Link href="/sign-in">
                  <Button>Get Started</Button>
                </Link>
                <Button variant="outline" onClick={() => setIsVideoOpen(true)}>
                  Watch Tutorial
                </Button>
              </motion.div>
              {isVideoOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
                  <div className="relative w-full max-w-6xl mx-4">
                    {/* Close Button */}
                    <button
                      onClick={() => setIsVideoOpen(false)}
                      className="absolute -top-10 right-0 z-10 text-white hover:text-gray-300"
                    >
                      <X size={24} />
                    </button>

                    {/* Video Container with Aspect Ratio */}
                    <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
                      {" "}
                      {/* 16:9 aspect ratio */}
                      <iframe
                        src="https://player.vimeo.com/video/1076231197?h=771460c47d&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1"
                        className="absolute top-0 left-0 w-full h-full"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                      />
                    </div>

                    {/* Video Info (optional) */}
                    <div className="p-4 bg-[#0c0d10] text-white rounded-b-lg">
                      <h3 className="text-xl font-semibold">
                        How to Use Ne3ma
                      </h3>
                      <p className="text-gray-300 mt-2">
                        Learn how to get started with our platform in just 4
                        minutes.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className=" relative mt-14 max-w-screen-xl mx-auto isolate rounded-xl md:mt-16">
              <motion.figure
                className="bg-background/60 border border-pink-200 backdrop-blur-3xl rounded-xl shadow-2xl overflow-hidden"
                initial={{
                  y: 120,
                  opacity: 0,
                  filter: "blur(5px)",
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                  filter: "blur(0)",
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.5,
                  ease: "backInOut",
                }}
                ref={homeRef}
                style={{ scale }}
              >
                <Image src={hero} width={1368} height={715} alt="hero"></Image>
              </motion.figure>
              {/* blur  */}
              <motion.div
                // className=" absolute bg-primary inset-1 blur-[50px] -z-10"
                initial={{
                  scale: 0.8,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  duration: 2,
                  delay: 0.5,
                  ease: "backInOut",
                }}
              ></motion.div>
              <motion.div
                className=" absolute top-10 inset-0 bg-primary blur-[100px]  rounded-full -z-20"
                initial={{
                  scale: 0.4,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  duration: 2,
                  delay: 1,
                  ease: "backInOut",
                }}
              ></motion.div>
            </div>
          </motion.div>
        </section>
        <section className="mt-16 pt-10">
          <PeopleReact />
        </section>
        <section className="py-14  mt-10 md:mt-6 md:py-18">
          <div className="container">
            <div className="pb-8 text-center md:pb-16 lg:max-w-screen-sm lg:mx-auto">
              <motion.p
                variants={variants.fadeInUp}
                initial="start"
                whileInView="end"
                viewport={{ once: true }}
                className="text-primary text-sm font-medium uppercase"
              >
                How it works
              </motion.p>
              <motion.h2
                variants={variants.fadeInUp}
                initial="start"
                whileInView="end"
                viewport={{ once: true }}
                className=" text-foreground text-3xl font-semibold leading-snug py-3 md:text-[40px] "
              >
                Easy Process to Get Started
              </motion.h2>
              <motion.p
                variants={variants.fadeInUp}
                initial="start"
                whileInView="end"
                viewport={{ once: true }}
                className=" text-muted-foreground md:text-xl"
              >
                Discover how it works by joining us and be part of Ne3ma.
              </motion.p>
            </div>

            <div className=" grid gap-14 lg:items-center lg:grid-cols-2  ">
              <div className=" grid gap-7 lg:gap-10 pl-20">
                <motion.div
                  className=" flex flex-col gap-4 md:flex-row lg:gap-7"
                  variants={variants.staggerContainer}
                  initial="start"
                  whileInView="end"
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="w-16 h-16 flex justify-center items-center rounded-full border border-foreground/5 shrink-0"
                    variants={variants.fadeInScale}
                  >
                    <Laptop className=" size-9" />
                  </motion.div>
                  <div className=" grid gap-2 md:gap-3">
                    <motion.h3
                      className="text-xl lg:text-2xl"
                      variants={variants.fadeInLeft}
                    >
                      Create your account
                    </motion.h3>
                    <motion.p
                      className="text-sm text-muted-foreground md:text-base"
                      variants={variants.fadeInLeft}
                    >
                      Sign up in just a few steps and become part of the Ne3ma
                      community. Create your profile and start contributing to a
                      more sustainable future.
                    </motion.p>
                  </div>
                </motion.div>

                <motion.div
                  className=" flex flex-col gap-4 md:flex-row lg:gap-7"
                  variants={variants.staggerContainer}
                  initial="start"
                  whileInView="end"
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="w-16 h-16 flex justify-center items-center rounded-full border border-foreground/5 shrink-0"
                    variants={variants.fadeInScale}
                  >
                    <ShoppingBag className="size-9" />
                  </motion.div>
                  <div className="grid gap-2 md:gap-3">
                    <motion.h3
                      className="text-xl lg:text-2xl"
                      variants={variants.fadeInLeft}
                    >
                      Share What You Don’t Need
                    </motion.h3>
                    <motion.p
                      className="text-sm text-muted-foreground md:text-base"
                      variants={variants.fadeInLeft}
                    >
                      Share surplus food, furniture, medicine, or other items
                      with those in need. Simply upload details, set pickup
                      preferences, and help reduce waste.
                    </motion.p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-col gap-4 md:flex-row lg:gap-7"
                  variants={variants.staggerContainer}
                  initial="start"
                  whileInView="end"
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="w-16 h-16 flex justify-center items-center rounded-full border border-foreground/5 shrink-0"
                    variants={variants.fadeInScale}
                  >
                    <CreditCard className="size-9" />
                  </motion.div>
                  <div className="grid gap-2 md:gap-3">
                    <motion.h3
                      className="text-xl lg:text-2xl"
                      variants={variants.fadeInLeft}
                    >
                      Find, Connect & Benefit
                    </motion.h3>
                    <motion.p
                      className="text-sm text-muted-foreground md:text-base"
                      variants={variants.fadeInLeft}
                    >
                      Browse available listings, connect with donors, and access
                      what you need—all while contributing to a more sustainable
                      world.
                    </motion.p>
                  </div>
                </motion.div>
              </div>

              <div className=" max-lg:-order-1">
                <motion.figure
                  className=" mx-auto bg-primary rounded-3xl max-w-[580px] overflow-hidden p-8 !pb-0 lg:p-12"
                  variants={variants.fadeInUp}
                  initial="start"
                  whileInView="end"
                  viewport={{ once: true }}
                >
                  <Image
                    src={banner}
                    alt="banner"
                    width={500}
                    height={528}
                    className="w-full h-full object-contain object-bottom"
                  ></Image>
                </motion.figure>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="pb-8 text-center md:pb-16 lg:max-w-screen-sm lg:mx-auto">
              <motion.p
                variants={variants.fadeInUp}
                initial="start"
                whileInView="end"
                viewport={{ once: true }}
                className="text-primary text-sm font-medium uppercase"
              >
                Innovation Meets Creativity
              </motion.p>
              <motion.h2
                variants={variants.fadeInUp}
                initial="start"
                whileInView="end"
                viewport={{ once: true }}
                className=" text-foreground text-3xl font-semibold leading-snug py-3 md:text-[40px] "
              >
                About Ne3ma
              </motion.h2>
              <motion.p
                variants={variants.fadeInUp}
                initial="start"
                whileInView="end"
                viewport={{ once: true }}
                className=" text-muted-foreground md:text-xl"
              >
                At Ne3ma, we craft digital experiences that inspire, engage, and
                elevate brands. From web development to design and beyond, we
                bring your ideas to life with precision and passion.
              </motion.p>
            </div>
            <motion.div
              variants={variants.fadeInUp}
              initial="start"
              whileInView="end"
              viewport={{ once: true }}
            >
              <AnimatedTestimonialsDemo />
            </motion.div>
          </div>
        </section>
        <section>
          <Pricing />
        </section>
      </div>

      <section id="contact" className=" mb-2.5 bg-red-gradient my-3 ">
        <div className="px-8 py-20 lg:flex lg:justify-center">
          <div className="">
            <h3 className=" max-sm:text-[17px] md:text-5xl text-2xl font-bold text-center text-white">
              {" "}
              Questions? We'd love to hear from you !{" "}
            </h3>
            <div className="items-center justify-center mt-6 flex">
              <a href="/contact-us" className="md:text-xl text-base w-fit">
                <button className="transform hover:scale-105 duration-500 ease-in-out text-primary font-bold  bg-white w-fit py-2 px-6 rounded md:h-12">
                  Contact US
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section>
        <Footer />
      </section>
    </div>
  );
}

export default HomePage;
