import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import ReactLoading from 'react-loading';

const UploadTab = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showUpload, setShowUpload] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [customColor, setCustomColor] = useState('#ffffff');

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/remove-background/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult({
        original: preview,
        processed: `http://localhost:8000${response.data.image_url}`,
        fileName: response.data.filename
      });
      setShowUpload(false); // Hide the upload section after successful processing
    } catch (err) {
      console.error('Error removing background:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setShowUpload(true);
  };

  const handleDownload = async () => {
    if (!result) return;
    
    try {
      // Create an image element to load the processed image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      // Set up the onload handler
      img.onload = function() {
        // Create a canvas with the same dimensions as the image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Get the context and set background color
        const ctx = canvas.getContext('2d');
        
        // Apply the selected background color
        if (backgroundColor !== 'transparent') {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Draw the image on top
        ctx.drawImage(img, 0, 0);
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          const url = window.URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = result.fileName || 'image-processed.png';
          document.body.appendChild(link);
          link.click();
          
          // Clean up
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            URL.revokeObjectURL(blobUrl);
          }, 100);
        }, 'image/png');
      };
      
      // Fetch the image and create a blob URL
      const response = await fetch(result.processed);
      if (!response.ok) throw new Error('Failed to fetch image');
      
      const blobUrl = URL.createObjectURL(await response.blob());
      img.src = blobUrl; // This will trigger the onload handler
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const applyBackgroundColor = (color) => {
    setBackgroundColor(color);
  };

  const handleCustomColorChange = (e) => {
    setCustomColor(e.target.value);
  };

  const applyCustomColor = () => {
    setBackgroundColor(customColor);
  };

  return (
    <div className="space-y-8">
      {/* Upload New Image button when an image has been processed */}
      {result && (
        <button
          onClick={resetUpload}
          className="py-3 px-6 rounded-md font-medium gradient-bg hover:opacity-90 transition-opacity"
        >
          Upload New Image
        </button>
      )}

      {/* Upload section */}
      {showUpload && (
        <>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-10 cursor-pointer transition-colors duration-300 ${
              isDragActive ? 'border-purple-400 bg-purple-900 bg-opacity-20' : 'border-gray-600 hover:border-purple-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-6 py-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 text-xl text-center">
                {isDragActive ? 'Drop the image here' : 'Drag & drop an image here, or click to select'}
              </p>
              <p className="text-gray-500 text-base text-center">
                Supports JPG, PNG, GIF, WebP
              </p>
            </div>
          </div>

          {preview && (
            <div className="space-y-6">
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-4 px-6 text-lg rounded-md font-medium ${
                  loading 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'gradient-bg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <ReactLoading type="spin" color="#ffffff" height={24} width={24} />
                    <span className="ml-3">Processing...</span>
                  </div>
                ) : 'Remove Background'}
              </button>
            </div>
          )}
        </>
      )}

      {error && (
        <div className="bg-red-900 bg-opacity-50 text-red-200 px-6 py-4 rounded-md">
          {error}
        </div>
      )}

      {/* Results section */}
      {result && (
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold gradient-text">Result</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-base font-medium text-gray-400">Original</p>
              <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900 bg-opacity-50">
                <img 
                  src={result.original} 
                  alt="Original" 
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-base font-medium text-gray-400">Background Removed</p>
              <div className="border border-gray-700 rounded-lg overflow-hidden" style={{ backgroundColor: backgroundColor !== 'transparent' ? backgroundColor : undefined }}>
                {/* Checkered background for transparency */}
                <div className="relative w-full h-80 md:h-96">
                  {backgroundColor === 'transparent' && (
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div 
                          key={i}
                          className={`${(Math.floor(i / 8) % 2 === 0 && i % 2 === 0) || (Math.floor(i / 8) % 2 === 1 && i % 2 === 1) ? 'bg-gray-700' : 'bg-gray-800'}`}
                        />
                      ))}
                    </div>
                  )}
                  <img 
                    src={result.processed} 
                    alt="Processed" 
                    className="absolute inset-0 w-full h-full object-contain"
                    onClick={(e) => e.preventDefault()}
                    style={{ pointerEvents: 'none' }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Background color options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-300">Background Color</h3>
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => applyBackgroundColor('transparent')} 
                className={`w-10 h-10 rounded-md border ${backgroundColor === 'transparent' ? 'border-purple-400 border-2' : 'border-gray-600'} grid grid-cols-2 grid-rows-2`}
                title="Transparent"
              >
                <div className="bg-gray-300"></div>
                <div className="bg-gray-600"></div>
                <div className="bg-gray-600"></div>
                <div className="bg-gray-300"></div>
              </button>
              <button 
                onClick={() => applyBackgroundColor('white')} 
                className={`w-10 h-10 rounded-md bg-white border ${backgroundColor === 'white' ? 'border-purple-400 border-2' : 'border-gray-600'}`}
                title="White"
              />
              <button 
                onClick={() => applyBackgroundColor('black')} 
                className={`w-10 h-10 rounded-md bg-black border ${backgroundColor === 'black' ? 'border-purple-400 border-2' : 'border-gray-600'}`}
                title="Black"
              />
              <button 
                onClick={() => applyBackgroundColor('#ff0000')} 
                className={`w-10 h-10 rounded-md bg-red-600 border ${backgroundColor === '#ff0000' ? 'border-purple-400 border-2' : 'border-gray-600'}`}
                title="Red"
              />
              <button 
                onClick={() => applyBackgroundColor('#00ff00')} 
                className={`w-10 h-10 rounded-md bg-green-500 border ${backgroundColor === '#00ff00' ? 'border-purple-400 border-2' : 'border-gray-600'}`}
                title="Green"
              />
              <button 
                onClick={() => applyBackgroundColor('#0000ff')} 
                className={`w-10 h-10 rounded-md bg-blue-600 border ${backgroundColor === '#0000ff' ? 'border-purple-400 border-2' : 'border-gray-600'}`}
                title="Blue"
              />
              <div className="flex items-center space-x-2">
                <input 
                  type="color" 
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="w-10 h-10 rounded-md cursor-pointer"
                />
                <button 
                  onClick={applyCustomColor}
                  className="px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
          
          {/* Download button */}
          <div className="flex justify-center">
            <button
              onClick={handleDownload}
              className="py-4 px-8 rounded-md text-lg font-medium gradient-bg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Image
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadTab;
