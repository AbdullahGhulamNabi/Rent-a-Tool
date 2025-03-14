import React, { useState } from "react";
import hammer from '../../assets/Tools/Tools/hammer.jpg'
import drill from '../../assets/Tools/Tools/drill.jpg'
import ranch from '../../assets/Tools/Tools/ranch.jpg'
import backsaw from '../../assets/Tools/Tools/backsaw.jpg'
import chainsaw from '../../assets/Tools/Tools/chainsaw.jpg'
import corkscrew from '../../assets/Tools/Tools/corkscrew.png'
import { useNavigate } from "react-router-dom";



const MyTools = () => {
  const [tools, setTools] = useState([
    { id: 1, name: "Hammer", description: "A sturdy hammer for daily use.", image :hammer },
    { id: 2, name: "Drill Machine", description: "Cordless drill machine.",image:drill },
    { id: 3, name: "Wrench Set", description: "Complete set of wrenches.", image:ranch},
    { id: 4, name: "BackSaw", description: "Useful for mending wooden things.", image:backsaw},
    { id: 5, name: "ChainSaw", description: "Great for cutting metal and wood items.",image:chainsaw },
    { id: 6, name: "CorkScrew", description: "Useful for making wooden holes.", image:corkscrew},
  ]);

  const handleEdit = (id) => {
    alert(`Edit tool with ID: ${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tool?")) {
      setTools(tools.filter((tool) => tool.id !== id));
    }
  };

  // const navigate = useNavigate()
  // function handleNavigate(){
  //   navigate("/ToolDescription")
  // }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Tools</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="border rounded-lg shadow-md p-4 flex flex-col items-center cursor-pointer"
          >

            
            {/* <div onClick={handleNavigate} className="w-full h-40 bg-gray-300 flex items-center justify-center rounded mb-4"> */}
            <div  className="w-full h-40 bg-gray-300 flex items-center justify-center rounded mb-4">
                <img className="w-full h-full object-cover rounded" src={tool.image} alt="img" />
            </div>

            <h2 className="text-lg font-semibold">{tool.name}</h2>
            <p className="text-gray-600 text-sm mb-4">{tool.description}</p>

            <div className="flex space-x-4">
              <button
                onClick={() => handleEdit(tool.id)}
                className="text-blue-600 hover:text-blue-800"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(tool.id)}
                className="text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTools;
