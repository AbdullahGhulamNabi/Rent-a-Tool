import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api_Route } from '../../config'; // Ensure correct import
// import toolService from '../../services'; // Ensure correct import
import { toolService } from '../../services';

const ToolExceptMyTool = () => {
  const [tools, setTools] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  // const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const fetchedTools = await toolService.getOtherTools();
        setTools(fetchedTools);
      } catch (err) {
        setError(err.message || 'Failed to fetch tools');
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  function handleNavigate(toolId) {
    navigate(`/ToolDescription/${toolId}`);
  }

  const fetchTools = async () => {
    try {
      setLoading(true);
      const fetchedTools = await toolService.getAllTools();
      setTools(fetchedTools);
      setError('');
    } catch (err) {
      setError('Failed to fetch tools: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (tool) => {
    // Ensure tool data has the correct structure
    const toolData = {
      ...tool,
      price: Number(tool.price) || 0,
      _id: tool._id,
      name: tool.name,
      description: tool.description,
      image: tool.image,
      owner: tool.owner || {}
    };
    console.log('Navigating with tool data:', toolData);
    navigate("/ToolDescriptions", { state: { tool: toolData } });
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='font-bold text-5xl text-HomeText w-[120px] m-auto my-5'>Tools</div>

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 cursor-pointer" >
            {tools.slice(0, visibleCount).map((tool) => {
              const owner = tool.owner || {}; // Ensure owner is always an object
              return (
                <div key={tool._id} className="rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer"> 
                  <div className="relative">
                    <div className="relative w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center"
                  onClick={() => handleCardClick(tool)} 
                  >
                      {tool.image ? (
                        <img
                          src={`${Api_Route}/uploads/tools/${tool.image}`}
                          alt={tool.name || "Tool"}
                          className="w-full h-full object-fill"
                        />
                      ) : (
                        <span className="text-gray-600 font-semibold">Image not available for {tool.name || "this tool"}</span>
                      )}
                    </div>
                    <div
                      className={`absolute bottom-0 left-0 p-1 text-sm 
    ${tool.price && tool.price > 0 ? "bg-black bg-opacity-30 text-white" : "bg-green-200 text-black "}`}
                    >
                      {tool.price && tool.price > 0 ? `RS ${tool.price} / day` : "Free to Borrow"}
                    </div>
                    <div
                      className={`absolute bottom-0 right-0 text-black p-1 text-sm ${tool.rented ? "bg-red-400" : "bg-green-200"
                        }`}
                    >
                      {tool.rented ? "Rented" : "Available"}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-HomeText">
                      {tool.name ? tool.name.split(" ").slice(0, 5).join(" ") : "Unnamed Tool"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {owner.address || "Location not available"}
                    </p>
                    <div className="flex items-center mt-2">
                      <img
                        src={owner.profilePhoto ? `${Api_Route}/Images/${owner.profilePhoto}` : "/user-placeholder.jpg"}
                        alt={`${owner.firstName || "Unknown"} ${owner.lastName || ""}`}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-sm font-medium text-HomeText">
                        {owner.firstName ? `${owner.firstName} ${owner.lastName || ""}` : "Unknown Owner"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {visibleCount < tools.length && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className="bg-HomeText text-white px-6 py-2 rounded hover:bg-opacity-90"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ToolExceptMyTool;


