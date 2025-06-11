import React from 'react';

const Footer = () => {
  return (
    <footer className="py-6 px-6 bg-gray-900 bg-opacity-70 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Background Removal Tool. Powered by BiRefNet.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="#features" 
              className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
            >
              Features
            </a>
            <a 
              href="#about" 
              className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
            >
              About
            </a>
            <a 
              href="#contact" 
              className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
