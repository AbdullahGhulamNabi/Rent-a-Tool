import React from "react";
import { Link } from "react-router-dom"; // Link use for navigation
import fb from "../../assets/Footer/fb.png";
import insta from "../../assets/Footer/instagram.png";
import twitter from "../../assets/Footer/twitter.png";
import youtube from "../../assets/Footer/youtube.png";
import help from "../FeedBack and Help/Help"

function Footer() {
  return (
    <div className="w-full bg-footer mt-2">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* About Section */}
          <div className="flex flex-col">
            <div className="font-bold mb-1 text-sm sm:text-base">About Rent-a-Tool</div>
            <p className="text-footerText text-xs">We provide an easy and affordable way to rent tools.</p>
            <Link to="/Help" className="text-footerText hover:text-gray-400 mt-1 text-xs">
              Tutorial & Help
            </Link>       
            <Link to="/terms" className="text-footerText hover:text-gray-400 mt-1 text-xs">Terms and Conditions</Link>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <div className="font-bold mb-1 text-sm sm:text-base">Quick Links</div>
            <Link to="/categories" className="text-footerText hover:text-gray-400 text-xs">Browse Categories</Link>
            <Link to="/pricing" className="text-footerText hover:text-gray-400 mt-1 text-xs">Pricing Plans</Link>
            <Link to="/faq" className="text-footerText hover:text-gray-400 mt-1 text-xs">FAQs</Link>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col">
            <div className="font-bold mb-1 text-sm sm:text-base">Contact Us</div>
            <p className="text-footerText text-xs">Email: support@rentatool.com</p>
            <p className="text-footerText text-xs">Phone: +92 123 456 7890</p>
            <p className="text-footerText text-xs">Address: Lahore, Pakistan</p>
          </div>

          {/* Social Media */}
          <div className="flex flex-col">
            <div className="font-bold mb-1 text-sm sm:text-base">Follow Us</div>
            <div className="flex space-x-1">
              <img src={fb} alt="Facebook" className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
              <img src={insta} alt="Instagram" className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
              <img src={youtube} alt="YouTube" className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
              <img src={twitter} alt="Twitter" className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
