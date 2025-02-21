// src/components/ui/Button.jsx
import React from "react";

const Button = ({ children, onClick, variant = "primary" }) => {
  const baseStyles =
    "px-4 py-2 rounded-lg font-semibold transition duration-200 ease-in-out focus:outline-none";
  const variantStyles =
    variant === "primary"
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-gray-500 text-white hover:bg-gray-600";

  return (
    <button className={`${baseStyles} ${variantStyles}`} onClick={onClick}>
      {children}
    </button>
  );
};

export { Button };
