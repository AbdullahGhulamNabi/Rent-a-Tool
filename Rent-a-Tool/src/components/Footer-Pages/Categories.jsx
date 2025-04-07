import React from "react";
import { Link } from "react-router-dom";

function Categories() {
  // Sample categories data
  const categories = [
    {
      id: 1,
      name: "Power Tools",
      description: "Electric and battery-powered tools for construction and DIY projects",
      image: "https://images.unsplash.com/photo-1581147036326-afcff9aae3c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      count: 24
    },
    {
      id: 2,
      name: "Hand Tools",
      description: "Traditional manual tools for various tasks",
      image: "https://images.unsplash.com/photo-1581147036326-afcff9aae3c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      count: 18
    },
    {
      id: 3,
      name: "Garden Tools",
      description: "Tools for gardening and landscaping",
      image: "https://images.unsplash.com/photo-1581147036326-afcff9aae3c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      count: 15
    },
    {
      id: 4,
      name: "Cleaning Equipment",
      description: "Tools and machines for cleaning and maintenance",
      image: "https://images.unsplash.com/photo-1581147036326-afcff9aae3c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      count: 12
    },
    {
      id: 5,
      name: "Painting Tools",
      description: "Equipment for painting and decorating",
      image: "https://images.unsplash.com/photo-1581147036326-afcff9aae3c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      count: 10
    },
    {
      id: 6,
      name: "Safety Equipment",
      description: "Protective gear and safety tools",
      image: "https://images.unsplash.com/photo-1581147036326-afcff9aae3c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      count: 8
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Tool Categories
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Browse our wide range of tool categories for your next project
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 w-full overflow-hidden">
                <img
                  className="h-full w-full object-cover"
                  src={category.image}
                  alt={category.name}
                />
              </div>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">{category.count} tools available</span>
                  <Link
                    to={`/Tools?category=${category.name}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Browse Tools
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories; 