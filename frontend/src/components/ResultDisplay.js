import React from 'react';

const ResultDisplay = ({ result }) => {
  const handleDownload = () => {
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = result.processed;
    link.download = result.fileName || 'background-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-xl font-semibold gradient-text">Result</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-400">Original</p>
          <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900 bg-opacity-50">
            <img 
              src={result.original} 
              alt="Original" 
              className="w-full h-auto max-h-80 object-contain"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-400">Background Removed</p>
          <div className="border border-gray-700 rounded-lg overflow-hidden bg-opacity-50 bg-gradient-to-br from-gray-800 to-gray-900">
            {/* Checkered background for transparency */}
            <div className="relative w-full h-60 md:h-80 bg-gray-800">
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div 
                    key={i}
                    className={`${
                      (Math.floor(i / 8) % 2 === 0 && i % 2 === 0) || 
                      (Math.floor(i / 8) % 2 === 1 && i % 2 === 1) 
                        ? 'bg-gray-700' 
                        : 'bg-gray-800'
                    }`}
                  />
                ))}
              </div>
              <img 
                src={result.processed} 
                alt="Processed" 
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          className="py-3 px-6 rounded-md font-medium gradient-bg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Transparent PNG
          </div>
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;
