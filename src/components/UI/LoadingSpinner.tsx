import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-crisp-black">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-muted-graphite rounded-full animate-spin border-t-cyber-teal"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-pulse border-t-neon-magenta"></div>
      </div>
    </div>
  );
};