import { ArrowBigRight, ArrowRight } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error500 = () => {
  const navigate = useNavigate(); 

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <div className="mb-8">
        <img
          src="/images/errors/error_500.jpg"
          alt="500 Error Illustration"
          className="max-w-[400px] w-full"
        />
      </div>

      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800  mb-3">500 - Internal Server Error</h1>
        <p className="text-xl text-gray-400 mb-4">
          Oops! Something went wrong on our end. Don't worry, our team is already on it.
        </p>
      </div>

        <button 
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-white text-red-500 font-medium shadow-sm flex outline-red-400 
                         rounded-full  transition-all duration-300">
          Go to Homepage&nbsp;
          <ArrowRight size={20} className='my-auto'/>
        </button>
    </div>
  );
};

export default Error500;
