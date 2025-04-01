import React from "react";

const TermsAndPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Terms & Privacy Policy
      </h1>

      {/* Terms of Service */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
          Terms of Service
        </h2>
        <p className="text-gray-600 mb-2">
        By using our 'Rent a Tool' service, the following terms apply:
          </p>
        <ul className="list-disc pl-6 text-gray-600">
          <li>You must provide accurate personal information when renting a tool.</li>
          <li>Tools must be returned in the same condition as received.</li>
          <li>Late returns may result in additional charges.</li>
          <li>Users are responsible for any damages to rented tools.</li>
        </ul>
      </section>

      {/* Privacy Policy */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-3">
          Privacy Policy
        </h2>
        <p className="text-gray-600 mb-2">
          Your privacy is important to us. We collect and use personal data as follows:
        </p>
        <ul className="list-disc pl-6 text-gray-600">
          <li>Personal data is collected for rental processing and security purposes.</li>
          <li>We do not share your information with third parties without consent.</li>
          <li>All payments are securely processed.</li>
          <li>Users can request to delete their data at any time.</li>
        </ul>
      </section>

     
    </div>
  );
};

export default TermsAndPolicy;
