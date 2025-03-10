import React, { useState, useRef } from "react";
// import ImageforHelp from '../../assets/Help/ImageforHelp.png'; // Ensure the path is correct
import register from '../../assets/Help/register.png'; // Ensure the path is correct
import SignUp from '../../assets/Help/signUpPage.png'; // Ensure the path is correct
import submit from '../../assets/Help/submit.png'; // Ensure the path is correct
import addicon from '../../assets/Help/addicon.png'; // Ensure the path is correct
import deleteok from '../../assets/Help/deleteok.png'; // Ensure the path is correct
import deletePic from '../../assets/Help/delete.png'; // Ensure the path is correct
import search from '../../assets/Help/search.png'; // Ensure the path is correct

const UserGuide = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
  const mainContentRef = useRef(null);

  const handleSearch = () => {
    const matchingSection = sections.find((section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchingSection && mainContentRef.current) {
      const container = mainContentRef.current;
      const sectionElement = sectionRefs[matchingSection.title].current;
      
      if (sectionElement) {
        const yOffset = 100; // Adjust based on your header height
        const scrollPosition = sectionElement.offsetTop - container.offsetTop - yOffset;
        
        container.scrollTo({
          top: scrollPosition,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-130px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-8 pb-4 sticky top-0 bg-gray-50 z-10">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">User Guide</h1>
            <p className="mt-2 text-gray-600">Step-by-step instructions to help you get started</p>
          </div>
        </div>
        
        {/* Sidebar Toggle Button for Mobile */}
        <button 
          className="lg:hidden bg-imageBG text-white px-4 py-2 rounded-md mb-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? "Hide Sections" : "Show Sections"}
        </button>
        
        <div className="flex flex-col lg:flex-row gap-8 pb-8">
          {/* Sidebar Navigation */}
          <div className={`lg:w-64 lg:sticky lg:top-[160px] lg:h-[calc(100vh-200px)] lg:overflow-y-auto bg-white rounded-lg p-4 shadow-sm ${isSidebarOpen ? "block" : "hidden lg:block"}`}>
            <nav>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Sections</h2>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li
                    key={section.title}
                    onClick={() => {
                      const sectionElement = sectionRefs[section.title].current;
                      if (sectionElement && mainContentRef.current) {
                        sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                      setIsSidebarOpen(false); // Close sidebar on mobile after clicking
                    }}
                    className="px-3 py-2 rounded-md hover:bg-blue-50 cursor-pointer text-gray-700 hover:text-blue-700 transition-colors"
                  >
                    {section.title}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto" ref={mainContentRef}>
            <div className="space-y-8">
              {sections.map((section) => (
                <section
                  key={section.title}
                  ref={sectionRefs[section.title]}
                  className="bg-white rounded-xl shadow-sm p-6 scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
                  <div className="space-y-6">
                    {section.content.map((item, index) => (
                      <div key={index} className="text-gray-700">
                        <p className="flex-1 mb-3">{item.text}</p>
                        {item.imageUrl && <img src={item.imageUrl} alt={item.text} className="rounded-lg border shadow-sm max-w-full h-auto" />}
                      </div>
                    ))}
                  </div>
                  {section.videoUrl && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Video Demonstration
                      </h3>
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                        <iframe
                          src={section.videoUrl}
                          title={`${section.title} Demo`}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
