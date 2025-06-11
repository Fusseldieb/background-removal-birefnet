import React, { useState } from 'react';
import { Tab } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import UploadTab from './components/UploadTab';
import UrlTab from './components/UrlTab';

function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-8 text-center gradient-text">
              Background Removal App
            </h1>
            
            <div className="flex mb-6 border-b border-gray-700">
              <button 
                className={`flex-1 py-4 text-lg font-medium ${activeTab === 0 ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-200'}`}
                onClick={() => setActiveTab(0)}
              >
                Upload Image
              </button>
              <button 
                className={`flex-1 py-4 text-lg font-medium ${activeTab === 1 ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-200'}`}
                onClick={() => setActiveTab(1)}
              >
                Image URL
              </button>
            </div>
            
            <div className="mt-8">
              {activeTab === 0 && <UploadTab />}
              {activeTab === 1 && <UrlTab />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
