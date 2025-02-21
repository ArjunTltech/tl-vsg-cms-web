import React from "react";
import { useNavigate } from "react-router-dom"; 
import { AlertCircle } from "react-feather";

const Error400 = () => {
  const navigate = useNavigate();
  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/errors/error_400.jpg')" }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm" />

      <div className="relative text-center text-white px-4">
        <div className="flex flex-row items-center justify-center mb-2 md:mb-7 gap-x-4">
          <div className="md:w-auto text-right">
            <AlertCircle size={70} className="text-gray-100" />
          </div>
          <div className="md:w-auto text-left">
            <h1 className="text-7xl font-extrabold drop-shadow-lg">400</h1>
          </div>
        </div>

        <h2 className="text-4xl font-bold mb-4 md:mb-8 ">Bad Request</h2>
        <p className="text-lg mb-4">
          We couldn't process your request due to invalid syntax or missing parameters. Possible reasons include:
        </p>

        <div className="max-w-md mx-auto mb-5 md:mb-14">
          <ul className="text-left text-lg opacity-75 space-y-3">
            <li>• The request was malformed or contains invalid data</li>
            <li>• Required parameters are missing from the request</li>
            <li>• The request includes invalid characters or formatting</li>
          </ul>
        </div>

        <div className="flex justify-center gap-4 flex-wrap mb-5 md:mb-8">
          <button
            className="bg-white text-black px-6 py-3 text-lg font-semibold uppercase rounded-md shadow-md transition hover:shadow-lg"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="border border-white text-white px-6 py-3 text-lg font-semibold uppercase rounded-md shadow-md transition hover:bg-white hover:text-black"
          >
            Return Home
          </button>
        </div>

        <p className="text-sm">
          If you believe this is a mistake, please contact our{' '}
          <a href="mailto:info@tltechnologies.net" className="underline">support team</a>
        </p>
      </div>
    </div>
  );
}
export default Error400;