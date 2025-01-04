import React, { useState, useRef } from "react";
import ImageforHelp from '../../assets/Help/ImageforHelp.png'; // Ensure the path is correct

const UserGuide = () => {
  const sections = [
    {
      title: "Register User",
      content: [
        { text: "Click on SignUp", imageUrl: ImageforHelp },
        { text: "Provide following information:" },
        { text: "Email (valid email format required)", imageUrl: ImageforHelp },
        { text: "Username (must be unique)", imageUrl: ImageforHelp },
        { text: "Password (must meet complexity requirements)", imageUrl: ImageforHelp },
        { text: "Phone Number (valid format required)", imageUrl: ImageforHelp },
        { text: "Address (mandatory based on role)", imageUrl: ImageforHelp },
        { text: "Click on Register and a message displays on screen 'Register successful'", imageUrl: ImageforHelp },
      ],
      videoUrl: "https://www.youtube.com/embed/example1",
    },
    {
      title: "Add Tool",
      content: [
        { text: "Add a new tool to the system by providing", imageUrl: ImageforHelp },
        { text: "Tool name", imageUrl: ImageforHelp },
        { text: "Tool description", imageUrl: ImageforHelp },
        { text: "Tool category", imageUrl: ImageforHelp },
        { text: "Rental price", imageUrl: ImageforHelp },
        { text: "Availability status", imageUrl: ImageforHelp },
        { text: "Relevant specifications (e.g., brand, model, condition)", imageUrl: ImageforHelp },
        { text: "Click on add button and display a message on screen 'Tool added successfully'", imageUrl: ImageforHelp },
      ],
      videoUrl: "https://www.youtube.com/embed/example2",
    },
    {
      title: "Edit Tool",
      content: [
        { text: "Navigate to the 'My Tools' section.", imageUrl: ImageforHelp },
        { text: "Select the tool you want to edit.", imageUrl: ImageforHelp },
        { text: "Update the desired fields and click 'Save' to apply changes.", imageUrl: ImageforHelp },
      ],
      videoUrl: "https://www.youtube.com/embed/example2",
      imageUrl: ImageforHelp,
    },
    {
      title: "Delete Tool",
      content: [
        { text: "Navigate to the 'My Tools' section.", imageUrl: ImageforHelp },
        { text: "Select the tool you want to delete.", imageUrl: ImageforHelp },
        { text: "Click on the 'Delete' button and confirm the action.", imageUrl: ImageforHelp },
      ],
      videoUrl: "https://www.youtube.com/embed/example3",
      imageUrl: ImageforHelp,
    },
    {
      title: "Search Tool",
      content: [
        { text: "Go to the 'Search Tool' section.", imageUrl: ImageforHelp },
        { text: "Enter keywords or filters to find the desired tool.", imageUrl: ImageforHelp },
        { text: "Click on the search button to view results.", imageUrl: ImageforHelp },
      ],
      videoUrl: "https://www.youtube.com/embed/example4",
      imageUrl: ImageforHelp,
    },
    {
      title: "Order Tool",
      content: [
        { text: "Click on the 'Delete' button and confirm the action.", imageUrl: ImageforHelp },
        { text: "Select the tool you wish to rent.", imageUrl: ImageforHelp },
        { text: "Click on 'Order Now' and follow the checkout process.", imageUrl: ImageforHelp },
      ],
      videoUrl: "https://www.youtube.com/embed/example5",
      imageUrl: ImageforHelp,
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
