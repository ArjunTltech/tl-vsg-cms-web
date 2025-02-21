import React from 'react';
import { Link, useNavigate } from "react-router-dom";

const Error401 = () => {
  const navigate = useNavigate();

  return (
    <div
      className="h-screen flex items-center justify-start bg-cover bg-center relative px-6"
      style={{ backgroundImage: "url('/images/errors/error_401.jpg')" }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />

      <div className="relative max-w-2xl text-white ml-0 md:ml-[5rem] p-6 rounded-lg shadow-lg bg-white bg-opacity-0 backdrop-blur-md">
        <h1 className="text-5xl font-bold mb-3 md:mb-7 tracking-wide"><span><strong>401</strong></span> - Unauthorized Access</h1>
        <p className="text-lg mb-4 leading-7">
          You don't have the necessary permissions to access this page.
          <br />
          This may be due to:
        </p>
        <ul className="list-disc list-inside text-lg opacity-75 space-y-2">
          <li>An expired or invalid session.</li>
          <li>Insufficient access rights.</li>
          <li>Attempting to view a restricted resource.</li>
        </ul>
        <p className="text-lg mt-4">
          Please log in with the correct credentials or contact support if you believe this is a mistake.
        </p>

        <div className="flex space-x-4 mt-6 md:mt-8">
          <button
            className="bg-white text-black px-6 py-3 text-lg font-semibold uppercase rounded-full shadow-md transition hover:bg-gray-300"
            onClick={() => navigate("/login")}
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error401;
