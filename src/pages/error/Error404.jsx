import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Error404 = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  return (
    <div 
    className="flex flex-col justify-center items-start min-h-screen relative overflow-hidden"
    style={{
      backgroundImage: 'url(/images/errors/error_404.jpg)',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    {/* Overlay */}
    <div 
      className="absolute top-0 left-0 w-full h-full bg-black/50"
    ></div>

    {/* Content Container */}
    <div className="relative w-full max-w-[1440px] mx-auto px-4 md:px-8">
      <div className="ml-8 md:ml-16">
        <div className="max-w-2xl">
          <h1 className="text-7xl font-bold text-white mb-0 md:mb-5">404</h1>
          <h2 className="text-4xl font-semibold text-white mb-3 md:mb-6">
            Oops! We couldn't find that page.
          </h2>
          <p className="text-xl text-white mb-4">
            It looks like the page you're searching for has been moved, renamed, or is temporarily unavailable.
          </p>

          <p className="text-white font-medium mb-3">Don't worry, here's what you can do:</p>
          <ul className="text-white mb-4 list-none p-0">
            <li>✔ Double-check the URL you entered.</li>
            <li>✔ Navigate back to our homepage to start fresh.</li>
            <li>✔ Use the search bar to find what you're looking for.</li>
          </ul>

          <p className="text-white font-medium mb-6 md:mb-8">
            If you still need help, feel free to{" "}
            <a 
              href="https://connect.tltechnologies.net/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline text-cyan-300 cursor-pointer hover:text-cyan-200"
            >
              contact us
            </a>
            .
          </p>

   
            <button
            onClick={() => navigate("/")}
              className="px-6 py-3 bg-white rounded-full text-slate-500  font-semibold
                       shadow-sm text-lg hover:shadow-md transition-all duration-300"
            >
              Go to Homepage
            </button>

        </div>
      </div>
    </div>
  </div>
  );
};

export default Error404;
