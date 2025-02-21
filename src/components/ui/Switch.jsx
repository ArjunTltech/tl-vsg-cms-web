// src/components/ui/Switch.jsx
import React from "react";

const Switch = ({ isChecked, onChange }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <span className="mr-2 text-sm">{isChecked ? "On" : "Off"}</span>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={onChange}
        />
        <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
        <div
          className={`${
            isChecked ? "translate-x-6 bg-blue-500" : "translate-x-0 bg-gray-500"
          } absolute left-1 top-1 transition-transform duration-200 ease-in-out w-6 h-6 bg-white rounded-full`}
        ></div>
      </div>
    </label>
  );
};

export { Switch };
