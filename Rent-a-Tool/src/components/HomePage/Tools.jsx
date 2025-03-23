import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toolService } from '../../services';

const Tools = () => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const fetchedTools = await toolService.getAllTools();
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

  const showMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 w-[96%] m-auto">
      <div className='font-bold text-5xl text-HomeText w-[120px] m-auto my-5'>Tools</div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tools.slice(0, visibleCount).map((tool) => (
          <div
            key={tool._id}
            className="rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer"
            onClick={() => handleNavigate(tool._id)}
          >
            <div className="relative">
              <img 
                src={tool.image ? `http://localhost:3000/uploads/tools/${tool.image}` : 'https://via.placeholder.com/300x200'} 
                alt={tool.name} 
                className="w-full h-40 sm:h-48 object-cover" 
              />
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-30 text-white p-1 text-sm">
                PKR {tool.price}/day
              </div>
            </div>
            <div className="p-2">
              <h3 className="font-bold text-lg text-HomeText">{tool.name}</h3>
              <p className="text-gray-500 text-sm">{tool.owner?.location || 'Location not specified'}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm font-medium text-HomeText">
                  {tool.owner?.firstName} {tool.owner?.lastName}
                </span>
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
