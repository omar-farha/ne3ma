import React from "react";
import contact from "@/public/contact.png";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const ContactPage = () => {
  return (
    <div>
      <section
        className="bg-cover bg-fixed text-white text-center flex flex-col justify-center items-center h-[40vh] px-4 "
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url('../public/ripe-rice-paddy-field-background_127755-665.jpg')",
        }}
      >
        <h3 className="text-lg font-normal">Get in Touch with Us</h3>
        <h2 className="text-4xl uppercase tracking-widest py-2">contact us</h2>
        <div className="flex items-center my-4">
          <div className="h-[3px] w-[70px] bg-green-600 rounded-full mx-1"></div>
          <div className="w-[10px] h-[10px] bg-green-600 rounded-full mx-1"></div>
          <div className="h-[3px] w-[70px] bg-green-600 rounded-full mx-1"></div>
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
              <Phone size={32} className="mx-auto pb-3 text-green-600" />
              <span className="block font-medium text-lg">Phone No.</span>
              <span className="block pt-1 text-gray-600">1-2392-23928-2</span>
            </div>
            <div className="p-4">
              <Mail size={32} className="mx-auto pb-3 text-green-600" />
              <span className="block font-medium text-lg">E-mail</span>
              <span className="block pt-1 text-gray-600">mail@company.com</span>
            </div>
            <div className="p-4">
              <MapPin size={32} className="mx-auto pb-3 text-green-600" />
              <span className="block font-medium text-lg">Address</span>
              <span className="block pt-1 text-gray-600">
                2939 Patrick Street, Victoria TX, United States
              </span>
            </div>
            <div className="p-4">
              <Clock size={32} className="mx-auto pb-3 text-green-600" />
              <span className="block font-medium text-lg">Opening Hours</span>
              <span className="block pt-1 text-gray-600">
                Monday - Friday (9:00 AM to 5:00 PM)
              </span>
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
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition"
                  placeholder="Last Name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition"
                  placeholder="E-mail"
                />
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition"
                  placeholder="Phone"
                />
              </div>
              <textarea
                rows={5}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-green-200 focus:border-green-500 outline-none transition"
                placeholder="Message"
              ></textarea>
              <button
                type="submit"
                className="uppercase text-white bg-green-600 rounded-md px-6 py-3 cursor-pointer hover:opacity-80 transition w-full md:w-auto"
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
      <footer className="bg-[#101e19] text-white pt-16">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl mb-4">About Us</h3>
            <p className="text-gray-400 leading-7">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Temporibus nulla rem, dignissimos iste aspernatur.
            </p>
            <ul className="flex gap-4 mt-4">
              <li>
                <a
                  href="#"
                  className="w-12 h-12 flex items-center justify-center bg-gray-800 text-gray-300 hover:bg-[#1877f2]"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="w-12 h-12 flex items-center justify-center bg-gray-800 text-gray-300 hover:bg-[#1da1f2]"
                >
                  <i className="fab fa-twitter"></i>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="w-12 h-12 flex items-center justify-center bg-gray-800 text-gray-300 hover:bg-[#ff0000]"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl mb-4">Support</h3>
            <ul className="text-gray-400">
              <li className="py-2 border-b border-gray-700 hover:pl-4 transition">
                <a href="#">FAQ</a>
              </li>
              <li className="py-2 border-b border-gray-700 hover:pl-4 transition">
                <a href="#">Privacy Policy</a>
              </li>
              <li className="py-2 border-b border-gray-700 hover:pl-4 transition">
                <a href="#">Help</a>
              </li>
              <li className="py-2 hover:pl-4 transition">
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl mb-4">Address</h3>
            <div className="flex items-start mb-6 text-gray-400">
              <i className="fas fa-location-dot text-green-600 mr-3"></i>
              <p>Egypt, Giza, Inside The Sphinx, Room Number 220</p>
            </div>
            <div className="flex items-start mb-6 text-gray-400">
              <i className="fas fa-clock text-green-600 mr-3"></i>
              <p>Business Hours: From 10:00 To 18:00</p>
            </div>
            <div className="flex items-start text-gray-400">
              <i className="fas fa-phone text-green-600 mr-3"></i>
              <div>
                <span className="block">+20123456789</span>
                <span className="block">+20123456789</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-400 mt-12 py-6 border-t border-gray-700">
          © 2024 by Celluplast
        </p>
      </footer>
    </div>
  );
};

export default ContactPage;
