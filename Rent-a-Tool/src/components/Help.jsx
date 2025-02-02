import React, { useState, useRef } from "react";
import register from '../assets/Help/register.png'; // Ensure the path is correct
import SignUp from '../assets/Help/signUpPage.png'; // Ensure the path is correct
import submit from '../assets/Help/submit.png'; // Ensure the path is correct
import addicon from '../assets/Help/addicon.png'; // Ensure the path is correct
import deleteok from '../assets/Help/deleteok.png'; // Ensure the path is correct
import deletePic from '../assets/Help/delete.png'; // Ensure the path is correct
import search from '../assets/Help/search.png'; // Ensure the path is correct

const UserGuide = () => {
  const sections = [
    {
      title: "Register User",
      content: [
        { text: "Click on SignUp", imageUrl: register },
        { text: "Provide following information:" },
        { text: "Email (valid email format required)" },
        { text: "Username (must be unique)" },
        { text: "Password (must meet complexity requirements)" },
        { text: "Phone Number (valid format required)" },
        { text: "Address (mandatory based on role)", imageUrl: SignUp },
        { text: "Click on Register and a message displays on screen 'Register successful'", imageUrl: submit },
      ],
      videoUrl: "https://www.youtube.com/embed/example1",
    },
    {
      title: "Add Tool",
      content: [
        { text: 'Click on add Tool icon', imageUrl: addicon },
        { text: "Add a new tool to the system by providing", imageUrl: SignUp },
        { text: "Tool name", imageUrl: SignUp },
        { text: "Tool description", imageUrl: SignUp },
        { text: "Tool category", imageUrl: SignUp },
        { text: "Rental price", imageUrl: SignUp },
        { text: "Availability status", imageUrl: SignUp },
        { text: "Relevant specifications (e.g., brand, model, condition)", imageUrl: SignUp },
        { text: "Click on add button and display a message on screen 'Tool added successfully'", imageUrl: SignUp },
      ],
      videoUrl: "https://www.youtube.com/embed/example2",
    },
    {
      title: "Edit Tool",
      content: [
        { text: "Navigate to the 'My Tools' section.", imageUrl: SignUp },
        { text: "Select the tool you want to edit.", imageUrl: SignUp },
        { text: "Update the desired fields and click 'Save' to apply changes.", imageUrl: SignUp },
      ],
      videoUrl: "https://www.youtube.com/embed/example2",
    },
    {
      title: "Delete Tool",
      content: [
        { text: "Navigate to the 'My Tools' section." },
        { text: "Select the tool you want to delete.", imageUrl: deletePic },
        { text: "Click on the 'Delete' button and confirm the action.", imageUrl: deleteok },
      ],
      videoUrl: "https://www.youtube.com/embed/example3",
    },
    {
      title: "Search Tool",
      content: [
        { text: "Go to the 'Search Tool' section." },
        { text: "Enter keywords or filters to find the desired tool." },
        { text: "Click on the search button to view results.", imageUrl: search },
      ],
      videoUrl: "https://www.youtube.com/embed/example4",
    },
    {
      title: "Order Tool",
      content: [
        { text: "Click on the 'Delete' button and confirm the action.", imageUrl: SignUp },
        { text: "Select the tool you wish to rent.", imageUrl: SignUp },
        { text: "Click on 'Order Now' and follow the checkout process.", imageUrl: SignUp },
      ],
      videoUrl: "https://www.youtube.com/embed/example5",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const sectionRefs = sections.reduce((acc, section) => {
    acc[section.title] = useRef(null);
    return acc;
  }, {});

  const handleSearch = () => {
    const matchingSection = sections.find((section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchingSection) {
      const ref = sectionRefs[matchingSection.title].current;
      if (ref) {
        window.scrollTo({
          top: ref.offsetTop,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">User Guide</h1>
          <p className="text-gray-600 text-lg">
            Step-by-step instructions to help you get started
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center items-center mb-8">
          <div className="w-full max-w-lg relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sections..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm"
            />
            <svg
              className="w-22 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-md p-6 sticky top-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Sections</h2>
            <ul className="space-y-2">
              {sections.map((section) => (
                <li
                  key={section.title}
                  onClick={() =>
                    window.scrollTo({
                      top: sectionRefs[section.title].current.offsetTop,
                      behavior: "smooth",
                    })
                  }
                  className="p-3 cursor-pointer rounded-md hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 text-gray-700 font-medium"
                >
                  {section.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {sections.map((section) => (
              <div
                key={section.title}
                ref={sectionRefs[section.title]}
                className="bg-white rounded-lg shadow-md p-6"
              >
                {/* Section Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {section.title}
                </h2>

                {/* Section Content */}
                <ul className="space-y-4">
                  {section.content.map((item, index) => (
                    <li key={index} className="text-gray-700">
                      <div className="flex items-start space-x-3">
                        <span className="text-blue-500 text-[20px] text-center">{'=>'}</span>
                        <span>{item.text}</span>
                      </div>
                      {/* Display Image after each step */}
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={`Step ${index + 1}`}
                          className="w-full md:w-2/3 lg:w-1/2 mb-4 rounded-lg shadow-md mt-3 mx-auto"
                        />
                      )}
                    </li>
                  ))}
                </ul>
    
                <div className="m-10 flex justify-center text-[20px] font-medium">
                  Video
                </div>
                {/* Video Section */}
                <div className="m-10 flex justify-center text-[20px] font-medium">
                  
                  <iframe
                    src={section.videoUrl}
                    title={section.title}
                    className="w-[50%] h-48 md:h-64 lg:h-80 rounded-lg shadow-md m-4"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;