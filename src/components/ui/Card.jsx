// src/components/ui/Card.jsx
import React from "react";

const Card = ({ title, children }) => {
  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-lg my-4">
      {title && <div className="text-xl font-semibold mb-4">{title}</div>}
      <div>{children}</div>
    </div>
  );
};

export { Card };
