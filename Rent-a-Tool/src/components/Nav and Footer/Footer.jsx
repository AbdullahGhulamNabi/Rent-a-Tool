import React from "react";
import fb from "../../assets/Footer/fb.png";
import insta from "../../assets/Footer/instagram.png";
import twitter from "../../assets/Footer/twitter.png";
import youtube from "../../assets/Footer/youtube.png";

function Footer() {
  return (
    <div className="h-[300px] w-full bg-footer mt-4 flex justify-start flex-wrap">
      <div className="md:w-[300px] sm:w-[250px] w-[200px] flex flex-col ml-10 mt-5">
        <div className="font-bold mb-5">About Rent-a-Tool</div>
        <div className="text-footerText">Tutorial and Help</div>
        <div className="text-footerText">Terms and Conditions</div>
      </div>
      <div className="md:w-[300px] sm:w-[250px] w-[200px] flex flex-col ml-10 mt-5">
        <div className="font-bold mb-5">Follow Rent-a-Tool</div>
        <div className="flex">
          <img src={fb} alt="FaceBook" className="h-[30px] w-[30px] mx-1" />
          <img src={insta} alt="Insta" className="h-[30px] w-[30px] mx-1" />
          <img src={youtube} alt="Youtube" className="h-[30px] w-[30px] mx-1" />
          <img src={twitter} alt="Twitter" className="h-[30px] w-[30px] mx-1" />
        </div>
      </div>
    </div>
  );
}

export default Footer;
