import React from "react";
import contact from "@/public/contact.png";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Footer from "@/app/_components/Footer";

const ContactPage = () => {
  return (
    <div>
      <section
        className="bg-cover bg-fixed  text-black text-center flex flex-col justify-center items-center h-[40vh] px-4 "
        // style={{
        //   backgroundImage:
        //     "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url('../public/ripe-rice-paddy-field-background_127755-665.jpg')",
        // }}
      >
        <h3 className="text-lg font-normal">Get in Touch with Us</h3>
        <h2 className="text-4xl uppercase tracking-widest py-2">contact us</h2>
        <div className="flex items-center my-4">
          <div className="h-[3px] w-[70px] bg-primary rounded-full mx-1"></div>
          <div className="w-[10px] h-[10px] bg-primary rounded-full mx-1"></div>
          <div className="h-[3px] w-[70px] bg-primary rounded-full mx-1"></div>
        </div>
        <p className="font-light opacity-90 max-w-xl mt-4">
          We’re always excited to hear from you! Whether you have questions,
          feedback, or need assistance, our team is here to help.
        </p>
      </section>

      <div className="max-w-[1320px] mx-auto px-4">
        {/* Contact Info */}
        <div className="my-8 text-center py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4">
              <Phone size={32} className="mx-auto pb-3 text-primary" />
              <span className="block font-medium text-lg">Phone No.</span>
              <span className="block pt-1 text-gray-600">01141412551</span>
            </div>
            <div className="p-4">
              <Mail size={32} className="mx-auto pb-3 text-primary" />
              <span className="block font-medium text-lg">E-mail</span>
              <span className="block pt-1 text-gray-600">ne3ma@gmail.com</span>
            </div>
            <div className="p-4">
              <MapPin size={32} className="mx-auto pb-3 text-primary" />
              <span className="block font-medium text-lg">Address</span>
              <span className="block pt-1 text-gray-600">
                cairo - Egypt, 12345
              </span>
            </div>
            <div className="p-4">
              <Clock size={32} className="mx-auto pb-3 text-primary" />
              <span className="block font-medium text-lg">Opening Hours</span>
              <span className="block pt-1 text-gray-600">24/7 - 365 Days</span>
            </div>
          </div>
        </div>

        {/* Contact Form and Image - Parallel Layout */}
        <div className="py-8 border-t border-gray-300 pt-12">
          {" "}
          {/* Added pt-12 for top padding */}
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {" "}
            {/* Increased gap and centered items */}
            {/* Form - Takes half width on larger screens */}
            <form className="w-full md:w-1/2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-200 focus:border-primary outline-none transition"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-200 focus:border-primary outline-none transition"
                  placeholder="Last Name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-200 focus:border-primary outline-none transition"
                  placeholder="E-mail"
                />
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-200 focus:border-primary outline-none transition"
                  placeholder="Phone"
                />
              </div>
              <textarea
                rows={5}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-200 focus:border-primary outline-none transition"
                placeholder="Message"
              ></textarea>
              <button
                type="submit"
                className="uppercase text-white bg-primary rounded-md px-6 py-3 cursor-pointer hover:opacity-80 transition w-full md:w-auto"
              >
                send message
              </button>
            </form>
            {/* Image - Takes half width on larger screens */}
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src={contact}
                alt="Contact"
                className="w-[85%] max-w-md object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      <section id="contact" className=" mb-2.5 bg-red-gradient my-3 ">
        <div className="px-8 py-20 lg:flex lg:justify-center">
          <div className="">
            <h3 className=" max-sm:text-[17px] md:text-5xl text-2xl font-bold text-center text-white">
              {" "}
              Thanks for reaching out to us!
            </h3>
            <div className="items-center justify-center mt-6 flex">
              <a href="/donate" className="md:text-xl text-base w-fit">
                <button className="transform hover:scale-105 duration-500 ease-in-out text-primary font-bold  bg-white w-fit py-2 px-6 rounded md:h-12">
                  Continue Explore
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactPage;
