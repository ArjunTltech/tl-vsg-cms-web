import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error403 = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{
        backgroundImage: "linear-gradient(rgba(15, 23, 43, 0.9), rgba(15, 23, 43, 0.9)), url(/images/errors/error_403.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="text-center text-white">
        <div className="mb-8 md:mb-14">
          <div className="flex justify-center items-center mb-8 stroke-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              fill="currentColor"
              className="bi bi-shield-lock-fill "
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm0 5a1.5 1.5 0 0 1 .5 2.915v.385a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-.385A1.5 1.5 0 0 1 8 5zm3 2.5a1.5 1.5 0 0 1-3 0v-.385a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v.385z"
              />
            </svg>
          </div>

          <h1 className="text-6xl font-bold mb-6 tracking-wider">
            <span className='pl-10 md:pl-0'>403</span> <span className='invisible md:visible'>-</span> Access Forbidden
          </h1>

          <p className="text-xl mb-8 font-light">
            Authorization Required. You don't have permission to view this page using the credentials you provided.
          </p>

          <div className="mb-8 mx-auto max-w-[500px]">
            <p className="text-white mb-4 font-semibold uppercase tracking-widest">
              Possible Reasons :
            </p>
            <ul className="flex flex-wrap justify-center gap-4">
              <li>• Incorrect permissions</li>
              <li>• Expired session</li>
              <li>• Restricted IP address</li>
            </ul>
          </div>
        </div>

        <div>
          <button
            onClick={() => navigate("/")}
            className="bg-white text-slate-700 px-8 py-4 font-bold rounded-full shadow-lg 
                     hover:shadow-xl transition-all duration-300 inline-block"
            style={{
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(255, 255, 255, 0.2)"
            }}
          >
            Return to Homepage
          </button>

          <div className="mt-6">
            <p className="text-sm">
              Need help? Reach out to our support team at
              <a
                href="mailto:info@tltechnologies.net"
                className="text-white ml-1 hover:underline"
              >
                info@tltechnologies.net
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error403;