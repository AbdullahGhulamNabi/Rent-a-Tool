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
        { text: "Email (valid email format required)"},
        { text: "Username (must be unique)"},
        { text: "Password (must meet complexity requirements)" },
        { text: "Phone Number (valid format required)"},
        { text: "Address (mandatory based on role)" , imageUrl: SignUp},
        { text: "Click on Register and a message displays on screen 'Register successful'",imageUrl: submit },
      ],
      videoUrl: "https://www.youtube.com/embed/example1",
    },
    {
      title: "Add Tool",
      content: [
        {text:'Click on add Tool icon',imageUrl:addicon},
        { text: "Add a new tool to the system by providing",imageUrl: SignUp},
        { text: "Tool name" ,imageUrl: SignUp},
        { text: "Tool description" ,imageUrl: SignUp},
        { text: "Tool category" ,imageUrl: SignUp},
        { text: "Rental price",imageUrl: SignUp },
        { text: "Availability status" ,imageUrl: SignUp},
        { text: "Relevant specifications (e.g., brand, model, condition)" ,imageUrl: SignUp},
        { text: "Click on add button and display a message on screen 'Tool added successfully'" ,imageUrl: SignUp},
      ],
      videoUrl: "https://www.youtube.com/embed/example2",
    },
    {
      title: "Edit Tool",
      content: [
        { text: "Navigate to the 'My Tools' section.",imageUrl: SignUp },
        { text: "Select the tool you want to edit." ,imageUrl: SignUp},
        { text: "Update the desired fields and click 'Save' to apply changes." ,imageUrl: SignUp},
      ],
      videoUrl: "https://www.youtube.com/embed/example2",
    
    },
    {
      title: "Delete Tool",
      content: [
        { text: "Navigate to the 'My Tools' section." },
        { text: "Select the tool you want to delete." ,imageUrl: deletePic},
        { text: "Click on the 'Delete' button and confirm the action." ,imageUrl: deleteok},
      ],
      videoUrl: "https://www.youtube.com/embed/example3",
    
    },
    {
      title: "Search Tool",
      content: [
        { text: "Go to the 'Search Tool' section." },
        { text: "Enter keywords or filters to find the desired tool."},
        { text: "Click on the search button to view results.",imageUrl: search },
      ],
      videoUrl: "https://www.youtube.com/embed/example4",
    
    },
    {
      title: "Order Tool",
      content: [
        { text: "Click on the 'Delete' button and confirm the action." ,imageUrl: SignUp,imageUrl: SignUp},
        { text: "Select the tool you wish to rent.",imageUrl: SignUp },
        { text: "Click on 'Order Now' and follow the checkout process." ,imageUrl: SignUp,imageUrl: SignUp},
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 m-4 min-h-screen">
      {/* Sidebar Navigation */}
      <div className="md:col-span-1 bg-gray-200 p-4 border-2 border-gray-300 sticky top-0 h-auto md:h-screen overflow-y-auto mb-6 md:mb-0">
        <h2 className="text-xl font-bold text-center">User Guide</h2>
        <ul>
          {sections.map((section) => (
            <li
              key={section.title}
              onClick={() =>
                window.scrollTo({
                  top: sectionRefs[section.title].current.offsetTop,
                  behavior: "smooth",
                })
              }
              className="p-3 cursor-pointer rounded-md hover:bg-gray-100"
            >
              {section.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="md:col-span-3 p-6 overflow-x-hidden">
        {/* Search Section */}
        <div className="flex justify-center items-center h-32 space-x-4 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sections..."
            className="w-full max-w-md p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Search
          </button>
        </div>

        {/* Sections */}
        <div>
          {sections.map((section) => (
            <div
              key={section.title}
              ref={sectionRefs[section.title]}
              className="mb-8 bg-gray-50 rounded-lg shadow-lg p-4"
            >
              {/* Section Content */}
              <div className="w-full p-4">
                <h2 className="text-2xl font-bold mb-4 bg-[#8af5] rounded-full h-12 flex justify-center items-center">
                  {section.title}
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  {section.content.map((item, index) => (
                    <li key={index} className="text-gray-700">
                      {item.text}
                      {/* Display Image after each step */}
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={`Step ${index + 1}`}
                          className="w-full md:w-2/3 lg:w-1/2 mb-4 rounded-lg shadow-md mx-auto"
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Video Section for each step */}
              <div className="w-full mt-6">
                <iframe
                  src={section.videoUrl}
                  title={section.title}
                  className="w-full h-48 md:h-64 lg:h-80 rounded-lg shadow-md"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
