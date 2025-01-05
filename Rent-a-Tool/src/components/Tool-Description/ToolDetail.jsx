import React from 'react'
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import toolIcon from '../../assets/ToolDetail/toolsample.jpg'
import ProfileIcon from '../../assets/ToolDetail/profile.jpeg'
import ChatIcon from "@mui/icons-material/Chat";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { NavLink } from 'react-router-dom';


const ToolDetail = () => {

  const [value, setValue] = React.useState(5);

  return (
    <>
      <div className='w-full flex justify-center sm:p-5  '>
        {/* detail section */}
        <div className='min-w-[300px] max-w-[1000px] p-5 bg-[#ffffff] shadow-2xl rounded-lg focus:outline-none focus:ring-0'>

          <div className='flex justify-center border rounded-lg'>
            <img className='w-[900px] h-[350px] sm:h-[400px]'
              src={toolIcon} alt="" />
          </div>
          <div className='mt-4'>
            <h2 className='text-3xl font-bold '>Fietsendrager achterop for rent</h2>
            <p className='text-lg mt-4 font-light'>Price Details:<b> 200rs first day</b> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt, itaque!</p>
            <p className='text-lg mt-4 font-light'>Adress Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt, itaque!</p>
            <p className='text-lg mt-4 font-light'>Details Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt, itaque!</p>
            <hr className='mt-5 border-b-4 ' />
          </div>
          <div className='flex justify-between w-full p-5 m-3'>
            <div className='w-[70%] '>
              <h2 className='text-3xl font-bold'>
                Abdullah
              </h2>
              <p className='text-lg mt-4 font-light'>
                Member since 8 Dec 2024 <br />Lahore
              </p>
              <button className='text-blue-800 font-medium '>View Profile</button><br />

            </div>

            <div className='w-20% flex flex-col items-center gap-2'>
              <img src={ProfileIcon} alt=""
                className='h-[100px] w-[100px] rounded-full' />

              <Rating
                name="simple-controlled"
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              />
            </div>

          </div>
          <div className='w-full flex justify-evenly mb-3'>
            <NavLink to="/chat"><button className="w-[150px] sm:w-[270px] mt-4 bg-HomeText text-white py-2 rounded flex items-center justify-center space-x-2 gap-2">
              <ChatIcon className="w-7 h-7 " />
              <span>Chat to Rent</span>
            </button>
            </NavLink>
            <NavLink to="/place_order"><button className="w-[150px] sm:w-[270px] mt-4 bg-HomeText text-white py-2 rounded flex items-center justify-center space-x-2 gap-2">
              <ShoppingCartIcon className="w-7 h-7 " />
              <span>Place Order</span>
            </button>
            </NavLink>
           

          </div>
        </div>
      </div>
    </>
  )
}

export default ToolDetail
