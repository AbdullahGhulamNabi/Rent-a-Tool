import React, { useState, useEffect, useContext } from "react";
import { toolService } from '../../services';
import AddUpdate from "../Add-Update/AddUpdate";
import { useNavigate } from 'react-router-dom';
import { Api_Route } from "../../config";
import Tools from "../HomePage/Tools";
import ToolExceptMyTool from "./ToolExceptMyTool";
import { SearchContext } from "../../Context/SearchContext";

const MyTools = () => {
   const { searchTerm } = useContext(SearchContext);
     // Filter tools based on the search term
   
    console.log(searchTerm , "searchTerm in ToolMyTool")
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddUpdate, setShowAddUpdate] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [activeTab, setActiveTab] = useState("myTools");

  const navigate = useNavigate();

  const handleCardClick = (tool) => {
    navigate(`/ToolDescription/${tool._id}`);
  };



  // Fetch tools when component mounts
  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const fetchedTools = await toolService.getMyTools();
      setTools(fetchedTools);
      setError('');
    } catch (err) {
      setError('Failed to fetch tools: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };
 // Filter tools based on searchTerm
 const filteredTools = tools.filter(tool => {
  return tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         (tool.description && tool.description.toLowerCase().includes(searchTerm.toLowerCase()));
});
  const handleEdit = (tool) => {
    setSelectedTool(tool);
    setShowAddUpdate(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tool?")) {
      try {
        await toolService.deleteTool(id);
        setTools(tools.filter((tool) => tool._id !== id));
    window.location.reload();

      } catch (err) {
        alert('Failed to delete tool: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleAddUpdateClose = () => {
    setShowAddUpdate(false);
    setSelectedTool(null);
    fetchTools();
 // Refresh the tools list
  };

  const [visibleTools, setVisibleTools] = useState(8); 

  const handleLoadMore = () => {
    setVisibleTools((prev) => prev + 4); 
  };

  if (loading) {
    return <div class="flex justify-center items-center my-12">

    <div class="w-16 h-16 border-4 border-t-transparent border-[#7bafa3] border-solid rounded-full animate-spin"></div>
  </div>;
  }

  if (error) {
    return <div className="p-4 text-red-600 text-center">{error}</div>;
  }
  return (
    <div className="p-4">
      <div className="flex items-center justify-center space-x-8 mb-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === "myTools" ? "bg-[#7bafa3] text-white" : "bg-gray-300"}`}
          onClick={() => setActiveTab("myTools")}
        >
         <h3 className="text-xl font-bold"> Tools to Rent</h3>
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "allTools" ? "bg-[#7bafa3] text-white" : "bg-gray-300"}`}
          onClick={() => setActiveTab("allTools")}
        >
         <h3 className="text-xl font-bold">My Tools</h3>
        </button>
      </div>
   

    {activeTab === "myTools" && <div>
      <ToolExceptMyTool/>
      </div>}

    {activeTab === "allTools" && (
      <>
      {showAddUpdate && (
        <AddUpdate onClose={handleAddUpdateClose} toolToEdit={selectedTool} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Map over filtered tools and show the ones that should be visible */}
        {filteredTools.slice(0, visibleTools).map((tool) => (
          <div
            key={tool._id}
            className="border rounded-lg shadow-md p-4 flex flex-col items-center cursor-pointer"
          >
            <div
              className="w-full h-32 bg-gray-300 flex items-center justify-center rounded mb-4"
              onClick={() => handleCardClick(tool)}
            >
              {tool.image ? (
                <img
                  className="w-full h-full object-cover rounded"
                  src={`${Api_Route}/uploads/tools/${tool.image}`}
                  alt={tool.name}
                />
              ) : (
                <div className="text-gray-500">No image</div>
              )}
            </div>

            <h2 className="text-lg font-semibold">{tool.name}</h2>
            <p className="text-gray-600 text-sm mb-2">
              {tool.description
                ? tool.description.split(" ").slice(0, 5).join(" ") + "..."
                : "No description available."}
            </p>

            {tool.price > 0 && (
              <p className="text-green-600 font-semibold mb-4">
                Rent: ₨.{tool.price}/day
              </p>
            )}

            <div className="flex space-x-4">
              <button onClick={() => handleEdit(tool)} className="text-blue-600 hover:text-blue-800">
                ✏️
              </button>
              <button onClick={() => handleDelete(tool._id)} className="text-red-600 hover:text-red-800">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {visibleTools < filteredTools.length && (
        <div className="flex justify-center mt-4">
          <button onClick={handleLoadMore} className="bg-HomeText text-white px-4 py-2 rounded">
            Load More
          </button>
        </div>
      )}
    </>
    )}
  </div>
  );
};

export default MyTools;
