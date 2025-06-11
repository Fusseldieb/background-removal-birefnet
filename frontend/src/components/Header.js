import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-900 bg-opacity-90 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">BG Remover</h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="https://github.com/ZhengPeng7/BiRefNet" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-gray-300 hover:text-white transition-colors duration-300">
              BiRefNet Model
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
