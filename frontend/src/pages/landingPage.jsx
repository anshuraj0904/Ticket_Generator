import React from "react";
import { useNavigate } from "react-router-dom";
import landingImage from "../assest/ticket-system-image.png"

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-blue-600 text-white">
        <h1 className="text-2xl font-bold">Welcome to our Ticket System</h1>
        <div className="space-x-4">
          <button
            className="bg-white text-blue-600 px-4 py-2 rounded cursor-pointer hover:bg-gray-100"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="bg-white text-blue-600 px-4 py-2 rounded cursor-pointer hover:bg-gray-100"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Manage your tickets efficiently
        </h2>
        <img
          src={landingImage} // <-- Replace with your generated image path
          alt="Ticket System Illustration"
          className="max-w-full max-h-[430px] object-contain rounded shadow-lg"
        />
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center p-4">
        © {new Date().getFullYear()} All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
