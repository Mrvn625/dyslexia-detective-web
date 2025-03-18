
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="text-2xl font-bold mb-4 md:mb-0">
            Dyslexia Detective
          </Link>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/what-is-dyslexia"
              className={`px-3 py-2 rounded-md ${
                isActive("/what-is-dyslexia")
                  ? "bg-blue-800"
                  : "hover:bg-blue-700"
              }`}
            >
              What is Dyslexia
            </Link>
            <Link
              to="/how-tests-work"
              className={`px-3 py-2 rounded-md ${
                isActive("/how-tests-work")
                  ? "bg-blue-800"
                  : "hover:bg-blue-700"
              }`}
            >
              How Tests Work
            </Link>
            <Link
              to="/user-profile"
              className={`px-3 py-2 rounded-md ${
                isActive("/user-profile")
                  ? "bg-blue-800"
                  : "hover:bg-blue-700"
              }`}
            >
              User Profile
            </Link>
            <Link
              to="/handwriting-analysis"
              className={`px-3 py-2 rounded-md ${
                isActive("/handwriting-analysis")
                  ? "bg-blue-800"
                  : "hover:bg-blue-700"
              }`}
            >
              Handwriting Analysis
            </Link>
            <Link
              to="/checklist"
              className={`px-3 py-2 rounded-md ${
                isActive("/checklist") ? "bg-blue-800" : "hover:bg-blue-700"
              }`}
            >
              Checklist
            </Link>
            <Link
              to="/cognitive-tests"
              className={`px-3 py-2 rounded-md ${
                isActive("/cognitive-tests")
                  ? "bg-blue-800"
                  : "hover:bg-blue-700"
              }`}
            >
              Cognitive Tests
            </Link>
            <Link
              to="/results"
              className={`px-3 py-2 rounded-md ${
                isActive("/results") ? "bg-blue-800" : "hover:bg-blue-700"
              }`}
            >
              Results
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
