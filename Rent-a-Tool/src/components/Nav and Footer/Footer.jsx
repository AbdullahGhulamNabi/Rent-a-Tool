import React from "react";
import { Link } from "react-router-dom"; // Link use for navigation
import fb from "../../assets/Footer/fb.png";
import insta from "../../assets/Footer/instagram.png";
import twitter from "../../assets/Footer/twitter.png";
import youtube from "../../assets/Footer/youtube.png";
import help from "../FeedBack and Help/Help"

function Footer() {
  return (
    <div className="h-auto w-full bg-footer mt-4 flex flex-wrap justify-between px-10 py-8 text-black">
      {/* About Section */}
      <div className="md:w-[300px] sm:w-[250px] w-[200px] flex flex-col">
        <div className="font-bold mb-3 text-lg">About Rent-a-Tool</div>
        <p className="text-footerText">We provide an easy and affordable way to rent tools.</p>
        <Link to="/Help" className="text-footerText hover:text-gray-400 mt-2">
          Tutorial & Help
        </Link>       
         <Link to="/terms" className="text-footerText hover:text-gray-400 mt-1">Terms and Conditions</Link>
      </div>

      {/* Quick Links */}
      <div className="md:w-[300px] sm:w-[250px] w-[200px] flex flex-col">
        <div className="font-bold mb-3 text-lg">Quick Links</div>
        <Link to="/categories" className="text-footerText hover:text-gray-400">Browse Categories</Link>
        <Link to="/pricing" className="text-footerText hover:text-gray-400 mt-1">Pricing Plans</Link>
        <Link to="/faq" className="text-footerText hover:text-gray-400 mt-1">FAQs</Link>
      </div>

      {/* Contact Us */}
      <div className="md:w-[300px] sm:w-[250px] w-[200px] flex flex-col">
        <div className="font-bold mb-3 text-lg">Contact Us</div>
        <p className="text-footerText">Email: support@rentatool.com</p>
        <p className="text-footerText">Phone: +92 123 456 7890</p>
        <p className="text-footerText">Address: Lahore, Pakistan</p>
      </div>

      {/* Social Media */}
      <div className="md:w-[300px] sm:w-[250px] w-[200px] flex flex-col">
        <div className="font-bold mb-3 text-lg">Follow Us</div>
        <div className="flex">
          <img src={fb} alt="Facebook" className="h-[30px] w-[30px] mx-1 cursor-pointer" />
          <img src={insta} alt="Instagram" className="h-[30px] w-[30px] mx-1 cursor-pointer" />
          <img src={youtube} alt="YouTube" className="h-[30px] w-[30px] mx-1 cursor-pointer" />
          <img src={twitter} alt="Twitter" className="h-[30px] w-[30px] mx-1 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

export default Footer;
