import React from "react";
import DownloaderCard from "../components/DownloaderCard";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-purple-800">
          Sethu <span className="text-purple-600">4K Tube</span>
        </h1>
        <h2 className="text-lg md:text-xl text-center mb-8 text-gray-600">
          YouTube Video Downloader
        </h2>
        
        <DownloaderCard />
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>© 2025 Sethu Ravichandran</p>
          <p className="mt-1">Download YouTube videos in upto 4K resolution</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
