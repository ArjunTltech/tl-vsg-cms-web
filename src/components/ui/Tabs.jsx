import React, { useState } from "react";

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0); // Default to the first tab

  return (
    <div className="tabs">
      {React.Children.map(children, child =>
        React.cloneElement(child, {
          activeTab,
          setActiveTab,
        })
      )}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b-2 border-gray-200">
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
          index,
          isActive: index === activeTab,
          onTabClick: () => setActiveTab(index),
        });
      })}
    </div>
  );
};

const TabsTrigger = ({ children, onTabClick, isActive }) => {
  return (
    <button
      className={`py-2 px-4 text-sm font-semibold transition-colors duration-200 ease-in-out ${
        isActive
          ? "border-b-2 border-blue-500 text-blue-600"
          : "text-gray-600 hover:text-blue-500"
      }`}
      onClick={onTabClick}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, index, activeTab }) => {
  return (
    <div
      className={`${
        index === activeTab ? "block" : "hidden"
      } p-4 bg-white border border-gray-200 rounded-lg mt-4`}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };