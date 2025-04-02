"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import hero from "../../public/hero.png";
import { useRef } from "react";
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
import { Box, BoxIcon, CreditCard, Laptop, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { PeopleReact } from "./PeopleReact";
import { AnimatedTestimonialsDemo } from "./AboutUs";
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
                <Button variant="outline">Watch Tutorial</Button>
              </motion.div>
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

          {/* <div className=" container max-w-screen-2xl">
          <motion.p
            variants={variants.fadeInUp}
            initial="start"
            whileInView="end"
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-10  md:text-xl text-black "
          >
            At Ne3ma, we are dedicated to making a positive impact through our
            initiatives.
          </motion.p>
          <motion.div
            variants={variants.staggerContainer}
            initial="start"
            whileInView="end"
            viewport={{ once: true }}
            className="flex justify-center flex-wrap gap-5 md:gap-10"
          >
            <motion.figure variants={variants.fadeInUp}>
              <Image src={tech1} alt="brand" className="w-[100px]"></Image>
            </motion.figure>
            <motion.figure variants={variants.fadeInUp}>
              <Image src={tech1} alt="brand" className="w-[100px] "></Image>
            </motion.figure>
            <motion.figure variants={variants.fadeInUp}>
              <Image src={tech1} alt="brand" className="w-[100px]"></Image>
            </motion.figure>
            <motion.figure variants={variants.fadeInUp}>
              <Image src={tech1} alt="brand" className="w-[100px]"></Image>
            </motion.figure>
            <motion.figure variants={variants.fadeInUp}>
              <Image src={tech1} alt="brand" className="w-[100px]"></Image>
            </motion.figure>
          </motion.div>
        </div> */}
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

        <section>{/* <PeopleReact /> */}</section>

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
      </div>
    </div>
  );
}

export default HomePage;
