import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Error503 = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "linear-gradient(rgba(13, 37, 63, 0.85), rgba(13, 37, 63, 0.95)), url(/images/errors/error_503.jpg)"
      }}
    >
      <div className="text-center text-white">
        <div className="mb-5 md:mb-8 flex justify-center items-center stroke-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            fill="currentColor"
            className="bi bi-cloud-slash-fill animate-float"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M3.112 5.112a3.125 3.125 0 0 0-.17.613C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13H11L3.112 5.112zm11.372 7.372L4.937 2.937A5.512 5.512 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773a3.2 3.2 0 0 1-1.516 2.711z"
            />
            <path d="M13.646 14.354l-12-12 .708-.708 12 12z" />
          </svg>
        </div>

        <h1 className=" text-5xl md:text-6xl font-extrabold mb-4 md:mb-10 tracking-wider">
          503 <span className="hidden sm:inline">-</span> Service Unavailable
        </h1>

        <p className="text-xl font-light mb-4 md:mb-8">
          Our systems are currently undergoing maintenance. We're working hard to restore service as quickly as possible.
        </p>

        <div className="mb-8 md:mb-16 mx-auto max-w-3xl">
          <p className="text-light mb-3">Possible reasons:</p>
          <div className="flex justify-center flex-wrap gap-3">
            <span className="bg-white text-gray-800 px-3 md:px-5 py-1 rounded-md">Server Maintenance</span>
            <span className="bg-white text-gray-800 px-3 md:px-5 py-1 rounded-md">Temporary Overload</span>
            <span className="bg-white text-gray-800 px-3 md:px-5 py-1 rounded-md">System Upgrade</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={() => navigate("/")}
            className="inline-block bg-gradient-to-r from-white to-[#f8f9fa] text-slate-800 text-lg font-bold py-3 px-5 md:px-8 rounded-full shadow-lg mb-3 transition-all duration-300 ease-in-out"
          >
            Return to Homepage
          </button>

          <div className="mt-3 text-white-50 text-sm">
            Need immediate assistance? Contact our {' '}
            <Link to="http://connect.tltechnologies.net" target='_blank' className="text-white text-decoration-underline">
              technical team
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
        100% { transform: translateY(0px); }
      }
    `}</style>
    </div>
  );
};

export default Error503;
