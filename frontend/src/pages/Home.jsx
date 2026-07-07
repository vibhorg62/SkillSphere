import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-bold text-blue-600 mb-4">Welcome to SkillSphere</h1>
      <p className="text-xl text-gray-700 mb-8 text-center max-w-2xl">
        Your ultimate learning management system. Explore courses and boost your skills.
      </p>
      <Link 
        to="/courses" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Explore Courses
      </Link>
    </div>
  );
};

export default Home;
