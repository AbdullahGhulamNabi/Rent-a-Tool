import React, { useState, useEffect } from "react";
import { toolService } from '../../services';
import AddUpdate from "../Add-Update/AddUpdate";
import { useNavigate } from 'react-router-dom';
import { Api_Route } from "../../config";

const MyTools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddUpdate, setShowAddUpdate] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (tool) => {
    navigate("/ToolDescription", { state: { tool } });

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

  const [visibleCount, setVisibleCount] = useState(8); // Initial tools shown

  const loadMore = () => {
    setVisibleCount((prev) => prev + 4); // Load 4 more tools on each click
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Tools</h1>
      </div>

      {showAddUpdate && (
        <AddUpdate
          onClose={handleAddUpdateClose}
          toolToEdit={selectedTool}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <div
            key={tool._id}
            className="border rounded-lg shadow-md p-4 flex flex-col items-center cursor-pointer"
            
          >
            <div className="w-full h-32 bg-gray-300 flex items-center justify-center rounded mb-4"
             onClick={() => handleCardClick(tool)}>
              {tool.image ? (
                <img
                  className="w-full h-full object-cover rounded"
                  // src={`http://localhost:3000/uploads/tools/${tool.image}`}
                  src={`${Api_Route}/uploads/tools/${tool.image}`}
                  alt={tool.name}
                />
              ) : (
                <div className="text-gray-500">No image</div>
              )}
            </div>

            <h2 className="text-lg font-semibold">{tool.name}</h2>
            <p className="text-gray-600 text-sm mb-2">
              {tool.description ? tool.description.split(" ").slice(0, 5).join(" ") + "..." : "No description available."}
            </p>

            {tool.price > 0 && (
              <p className="text-green-600 font-semibold mb-4">
                Rent: ₨.{tool.price}/day
              </p>
            )}

            <div className="flex space-x-4">
              <button
                onClick={() => handleEdit(tool)}
                className="text-blue-600 hover:text-blue-800"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(tool._id)}
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
