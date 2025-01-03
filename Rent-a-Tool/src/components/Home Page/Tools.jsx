import React, { useState } from 'react';
import hammer from '../../assets/Tools/Tools/hammer.jpg'
import backsaw from '../../assets/Tools/Tools/backsaw.jpg'
import bradawl from '../../assets/Tools/Tools/bradawl.jpg'
import chainsaw from '../../assets/Tools/Tools/chainsaw.jpg'
import corkscrew from '../../assets/Tools/Tools/corkscrew.png'
import drill from '../../assets/Tools/Tools/drill.jpg'
import ladder from '../../assets/Tools/Tools/ladder.jpg'
import mallet from '../../assets/Tools/Tools/Mallet.jpg'
import plunger from '../../assets/Tools/Tools/Plunger.jpg'
import ranch from '../../assets/Tools/Tools/ranch.jpg'
import ratchet from '../../assets/Tools/Tools/ratchet.jpg'
import Scissor from '../../assets/Tools/Tools/Scissor.jpg'
import tape from '../../assets/Tools/Tools/tapemeasure.jpg'
import person from '../../assets/Tools/person.jpg'

const Tools = () => {
  const [visibleCount, setVisibleCount] = useState(8);

  const tools = [
    {
      id: 1,
      imageName: drill,
      toolName: 'Drill Machine',
      location: 'Lahore, Pakistan',
      profileImage: person,
      personName: 'Ali',
      rating: 4.5,
      price: '$50',
    },
    {
      id: 2,
      imageName: hammer,
      toolName: 'Hammer',
      location: 'Karachi, Pakistan',
      profileImage: person,
      personName: 'Ahmed',
      rating: 4.2,
      price: '$20',
    },
    {
      id: 3,
      imageName: corkscrew,
      toolName: 'Corkscrew',
      location: 'Islamabad, Pakistan',
      profileImage: person,
      personName: 'Usman',
      rating: 4.8,
      price: '$15',
    },
    {
      id: 4,
      imageName: backsaw,
      toolName: 'Backsaw',
      location: 'Peshawar, Pakistan',
      profileImage: person,
      personName: 'Bilal',
      rating: 4.7,
      price: '$25',
    },
    {
      id: 5,
      imageName: bradawl,
      toolName: 'Bradawl',
      location: 'Quetta, Pakistan',
      profileImage: person,
      personName: 'Faisal',
      rating: 4.6,
      price: '$18',
    },
    {
      id: 6,
      imageName: chainsaw,
      toolName: 'Chain Saw',
      location: 'Multan, Pakistan',
      profileImage: person,
      personName: 'Hassan',
      rating: 4.3,
      price: '$30',
    },
    {
      id: 7,
      imageName: ladder,
      toolName: 'Ladder',
      location: 'Rawalpindi, Pakistan',
      profileImage: person,
      personName: 'Kamran',
      rating: 4.4,
      price: '$22',
    },
    {
      id: 8,
      imageName: tape,
      toolName: 'Measuring Tape',
      location: 'Sialkot, Pakistan',
      profileImage: person,
      personName: 'Nabeel',
      rating: 4.5,
      price: '$12',
    },
    {
      id: 9,
      imageName: mallet,
      toolName: 'Mallet',
      location: 'Faisalabad, Pakistan',
      profileImage: person,
      personName: 'Zahid',
      rating: 4.7,
      price: '$28',
    },
    {
      id: 10,
      imageName: plunger,
      toolName: 'Plunger',
      location: 'Hyderabad, Pakistan',
      profileImage: person,
      personName: 'Adnan',
      rating: 4.6,
      price: '$35',
    },
    {
      id: 11,
      imageName: ranch,
      toolName: 'wranch',
      location: 'Gujranwala, Pakistan',
      profileImage: person,
      personName: 'Shahbaz',
      rating: 4.8,
      price: '$10',
    },
    {
      id: 12,
      imageName: ratchet,
      toolName: 'Ratchet',
      location: 'Bahawalpur, Pakistan',
      profileImage: person,
      personName: 'Saad',
      rating: 4.9,
      price: '$40',
    },
    {
      id: 13,
      imageName: Scissor,
      toolName: 'Scissor',
      location: 'Abbottabad, Pakistan',
      profileImage: person,
      personName: 'Irfan',
      rating: 4.5,
      price: '$60',
    },
    // Add more tool objects here
  ];

  const showMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <div className="p-4 w-[96%] m-auto">
      <div className='font-bold text-5xl text-HomeText w-[120px] m-auto my-5'>Tools</div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tools.slice(0, visibleCount).map((tool) => (
          <div
            key={tool.id}
            className="rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer"
          >
            <div className="relative">
              <img src={tool.imageName} alt={tool.toolName} className="w-full h-40 sm:h-48 object-fill" />
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-30 text-white p-1 text-sm">{tool.price}</div>
              <div className="absolute bottom-0 right-0 bg-black bg-opacity-30 text-white p-1 text-sm">{tool.rating} ⭐</div>
            </div>
            <div className="p-2">
              <h3 className="font-bold text-lg text-HomeText">{tool.toolName}</h3>
              <p className="text-gray-500 text-sm">{tool.location}</p>
              <div className="flex items-center mt-2">
                <img
                  src={tool.profileImage}
                  alt={tool.personName}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-sm font-medium text-HomeText">{tool.personName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {visibleCount < tools.length && (
        <div className="text-center mt-4">
          <button
            className="bg-HomeText text-white px-4 py-2 rounded"
            onClick={showMore}
          >
            More
          </button>
        </div>
      )}
    </div>
  );
};

export default Tools;
