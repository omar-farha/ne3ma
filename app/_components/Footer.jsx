import Image from "next/image";
import React from "react";
import logo from "../../public/logo.png";

const Footer = () => {
  return (
    <div className="bg-white pt-8 px-4 sm:px-6 lg:px-8 w-[100%] pb-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-flow-col lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Image src={logo} alt="logo" width={130} height={130} />
          </div>
          <div className="text-[#9da4b0] ">
            <a href="/">
              <h3 className="text-lg font-semibold mb-4 hover:text-gray-800">
                Home
              </h3>
            </a>
            <ul className="space-y-2 ">
              <li>
                <a
                  className="text-[#9da4b0] hover:text-gray-800"
                  href="/donate"
                >
                  {" "}
                  Donate
                </a>
              </li>
              <li>
                <a className="text-[#9da4b0] hover:text-gray-800" href="/rent">
                  Request
                </a>
              </li>
              <li>
                <a
                  className="text-[#9da4b0] hover:text-gray-800"
                  href="/contact-us"
                >
                  Contact us
                </a>
              </li>
              <li>
                <a
                  href="/"
                  rel="noopener noreferrer"
                  className="text-[#9da4b0] hover:text-gray-800"
                >
                  Tutorial
                </a>
              </li>
            </ul>
          </div>
          <div className="">
            <h3 className="text-lg font-semibold mb-4">LEGAL</h3>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-gray-600 hover:text-gray-800"
                  href="/privacy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-800" href="/terms">
                  Terms &amp; Conditions
                </a>
              </li>
            </ul>
          </div>
          <div className="">
            <h3 className="text-lg font-semibold mb-4">FOLLOW US</h3>
            <ul className="space-y-2">
              <li>
                <a
                  target="_blank"
                  className="text-gray-600 hover:text-gray-800"
                  href=""
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  className="text-gray-600 hover:text-gray-800"
                  href=""
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  className="text-gray-600 hover:text-gray-800"
                  href=""
                >
                  Linkedin
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  className="text-gray-600 hover:text-gray-800"
                  href=""
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>
          <div className="">
            <h3 className="text-lg font-semibold mb-4">CONTACT US</h3>
            <p className="text-gray-600 mb-2">PHONE NUMBER </p>
            <a
              href="https://wa.me/+201141412551"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="text-gray-800 mb-4 hover:text-blue-800">
                01141412551
              </p>
            </a>
            <p className="text-gray-600 mb-2">E-MAIL ADDRESS</p>
            <a
              href="mailto:vondera.eg@gmail.com"
              target="_blank"
              rel="noopener noreferrer "
            >
              <p className="text-gray-800 hover:text-blue-800">
                info@Ne3ma.app
              </p>
            </a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col items-center">
            <p className="text-gray-600 text-sm mb-4">
              © 2025 Ne3ma™. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
