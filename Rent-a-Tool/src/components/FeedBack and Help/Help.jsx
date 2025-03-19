import React, { useState, useRef } from "react";
import register from '../../assets/Help/register.png'; 
import SignUp from '../../assets/Help/signUpPage.png'; 
import edit from '../../assets/Help/editicon.png';
import addicon from '../../assets/Help/addicon.png'; 
import deleteok from '../../assets/Help/deleteok.png'; 
import updateform from '../../assets/Help/updateform.png'; 
import requesttoolicon from '../../assets/Help/requesttoolicon.png';
import ordertool from '../../assets/Help/ordertool.png';
import deleteicon from '../../assets/Help/deleteicon.png'; 
import search from '../../assets/Help/search.png'; 
import addtool from '../../assets/Help/addtool.png';
const UserGuide = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sections = [
    {
      "title": "Register User",
      "content": [
        { "text": "Click on Sign Up", imageUrl: register },
        { "text": "Provide the following information:", imageUrl: SignUp },
        { "text": "Enter your first name and last name." },
        { "text": "Email (must be in a valid format)." },
        { "text": "Phone number (must be in a valid format)." },
        { "text": "Password (must be at least 8 characters long)." },
        { "text": "Enter your address." },
        { "text": "Enter your postal code." },
        { "text": "Click on the Sign Up button. The user is successfully registered." }
      ]
    },
    
    {
      "title": "Add Tool",
      "content": [
        { "text": "Before adding a tool, the user must be logged in. Otherwise, they will be unable to add a tool." },
        { "text": "A form opens.", imageUrl: addicon },
        { "text": "Provide the following information about the tool:",imageUrl: addtool  },
        { "text": "Add an image of the tool." },
        { "text": "Enter the tool name." },
        { "text": "Enter a description of the tool." },
        { "text": "Select 'Free Borrow' or 'For Rent'." },
        { "text": "If 'Free Borrow' is selected, no price is required. If 'For Rent' is selected, enter the price." },
        { "text": "Click on the 'Add' button, and the tool will be added successfully." }
      ]
    },
    
    {
      "title": "Edit Tool",
      "content": [
        { "text": "Before edit a tool detail, the user must be logged in. Otherwise, they will be unable to edit a tool detail.", imageUrl: edit },
        { "text": "Select the edit icon.", imageUrl: updateform },
        { "text": "Provide the following information to edit the tool: image, name, and description." },
        { "text": "Click the update button, and the tool's information will be updated successfully." }
      ]
    },
    
    {
      "title": "Delete Tool",
      "content": [
        { "text": "Before deleting a tool, the user must be logged in. Otherwise, they will be unable to delete a tool.",imageUrl: deleteicon },
        { "text": "Select the tool you want to delete, then click on the delete icon." },
        { "text": "Click on the 'Delete' button, confirm the action, and the tool will be successfully deleted.", imageUrl: deleteok }
      ]
    },

    {
      "title": "Search Tool",
      "content": [
        { "text": "Go to the 'Search Tool' section." },
        { "text": "Enter the tool name or apply filters to find the desired tool." },
        { "text": "Click the 'Enter' button to view the desired tools.", imageUrl: search }
      ]
    },    
    {
      title: "Order Tool",
      content: [
        { text: "Select a tool that you want to rent.",imagimageUrl: requesttoolicon},
        { text: "Click on 'Request Tool'. A form will open where you need to provide the following information." ,imageUrl: ordertool },
        { text: "Enter or select the rental duration and choose a payment method." },
        { text: "Click on 'Confirm Order' to successfully place your order." }
      ]
    }
    
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
                    // <div className="mt-8">
                    //   <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    //     Video Demonstration
                    //   </h3>
                      {/* <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                        <iframe
                          src={section.videoUrl}
                          title={`${section.title} Demo`}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div> */}
                    // </div>
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
