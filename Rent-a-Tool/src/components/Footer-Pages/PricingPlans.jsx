import React from "react";
import { Link } from "react-router-dom";

function PricingPlans() {
  // Single free plan
  const plans = [
    {
      id: 1,
      name: "Current Plan",
      price: "Free",
      description: "Access all features of Rent-a-Tool",
      features: [
        "Browse all tools",
        "Rent any available tool",
        "Chat with tool owners",
        "View tool details and images",
        
      ],
      buttonText: "Get Started",
      buttonLink: "/"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Currently Free!
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Enjoy all features of Rent-a-Tool at no cost
          </p>
        </div>

        <div className="flex justify-center">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white overflow-hidden shadow-lg rounded-lg w-full max-w-md transform hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-teal-500 text-white text-center py-2 text-lg font-medium">
                Currently Available
              </div>
              <div className="px-6 py-8">
                <h3 className="text-2xl font-semibold text-gray-900 text-center">{plan.name}</h3>
                <div className="mt-4 flex justify-center items-baseline">
                  <span className="text-6xl font-extrabold text-teal-600">{plan.price}</span>
                </div>
                <p className="mt-5 text-lg text-gray-500 text-center">{plan.description}</p>
              </div>
              <div className="px-6 pt-6 pb-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-teal-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    to={plan.buttonLink}
                    className="block w-full py-4 px-6 text-center rounded-md shadow bg-teal-600 text-white hover:bg-teal-700 font-semibold text-lg transition-colors duration-200"
                  >
                    {plan.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-gray-500">
          <p>* All features are currently available for free during our launch period</p>
        </div>
      </div>
    </div>
  );
}

export default PricingPlans; 