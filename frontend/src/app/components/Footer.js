import React from "react";
import { FiBarChart2 } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">
            Customer Analytics Dashboard &copy; {new Date().getFullYear()}
          </p>
          <div className="flex justify-center items-center space-x-4 text-gray-400 text-sm">
            <div className="flex items-center space-x-1">
              <FiBarChart2 className="text-sm" />
              <span>Real-time Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
