
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Recommended path for assessment
  const getNavigationStatus = (path: string) => {
    // The order of the recommended assessment path
    const recommendedOrder = [
      "/user-profile",
      "/checklist",
      "/handwriting-analysis",
      "/cognitive-tests",
      "/results",
      "/report"
    ];
    
    const currentIndex = recommendedOrder.indexOf(location.pathname);
    const pathIndex = recommendedOrder.indexOf(path);
    
    if (currentIndex === -1 || pathIndex === -1) return "normal";
    
    if (pathIndex < currentIndex) return "completed";
    if (pathIndex === currentIndex) return "current";
    if (pathIndex === currentIndex + 1) return "next";
    return "future";
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
                  : getNavigationStatus("/user-profile") === "completed" 
                  ? "bg-green-700" 
                  : "hover:bg-blue-700"
              }`}
            >
              User Profile
            </Link>
            <Link
              to="/checklist"
              className={`px-3 py-2 rounded-md ${
                isActive("/checklist") 
                ? "bg-blue-800" 
                : getNavigationStatus("/checklist") === "completed"
                ? "bg-green-700"
                : getNavigationStatus("/checklist") === "next"
                ? "bg-amber-600"
                : "hover:bg-blue-700"
              }`}
            >
              Checklist
            </Link>
            <Link
              to="/handwriting-analysis"
              className={`px-3 py-2 rounded-md ${
                isActive("/handwriting-analysis")
                  ? "bg-blue-800"
                  : getNavigationStatus("/handwriting-analysis") === "completed"
                  ? "bg-green-700"
                  : getNavigationStatus("/handwriting-analysis") === "next"
                  ? "bg-amber-600"
                  : "hover:bg-blue-700"
              }`}
            >
              Handwriting Analysis
            </Link>
            <Link
              to="/cognitive-tests"
              className={`px-3 py-2 rounded-md ${
                isActive("/cognitive-tests")
                  ? "bg-blue-800"
                  : getNavigationStatus("/cognitive-tests") === "completed"
                  ? "bg-green-700"
                  : getNavigationStatus("/cognitive-tests") === "next"
                  ? "bg-amber-600"
                  : "hover:bg-blue-700"
              }`}
            >
              Cognitive Tests
            </Link>
            <Link
              to="/results"
              className={`px-3 py-2 rounded-md ${
                isActive("/results") 
                ? "bg-blue-800" 
                : getNavigationStatus("/results") === "next"
                ? "bg-amber-600"
                : "hover:bg-blue-700"
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
