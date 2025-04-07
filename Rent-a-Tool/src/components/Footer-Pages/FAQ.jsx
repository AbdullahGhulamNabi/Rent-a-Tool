import React, { useState } from "react";

function FAQ() {
  // Sample FAQ data
  const faqs = [
    {
      id: 1,
      question: "How does Rent-a-Tool work?",
      answer: "Rent-a-Tool is a platform that connects tool owners with people who need to rent tools. Browse our catalog, select the tools you need choose your rental period."
    },
    {
      id: 2,
      question: "What happens if a tool is damaged during my rental?",
      answer: "If a tool is damaged during your rental period, you are responsible for the repair or replacement costs. We recommend inspecting tools before use and reporting any pre-existing damage. For accidental damage, you may want to consider purchasing additional insurance coverage from a third-party provider."
    },
   
    {
      id: 3,
      question: "How is the rental price calculated?",
      answer: "Rental prices are calculated based on the tool's value and rental duration."
    },
    ,
    {
      id: 4,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards and debit cards "
    },
    {
      id: 5,
      question: "How do I become a tool owner on the platform?",
      answer: "To become a tool owner, you need to create an account, verify your identity, and list your tools on our platform."
    }
  ];

  // State to track which FAQ is expanded
  const [expandedId, setExpandedId] = useState(null);

  // Toggle expanded state
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Find answers to common questions about our service
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <button
                className="w-full px-6 py-4 text-left focus:outline-none"
                onClick={() => toggleExpand(faq.id)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </h3>
                  <svg
                    className={`h-6 w-6 text-gray-500 transform transition-transform ${
                      expandedId === faq.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {expandedId === faq.id && (
                <div className="px-6 pb-4">
                  <p className="text-gray-500">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Still have questions?{" "}
            <h5 className="text-black-800">
            Email:rentatool777@gmail.com
            </h5>
          </p>
        </div>
      </div>
    </div>
  );
}

export default FAQ; 