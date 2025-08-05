import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6 animate-pulse">
      {[1, 2].map((index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-16 bg-background-subtle rounded"></div>
              <div className="h-6 w-12 bg-background-subtle rounded-full"></div>
            </div>
          </div>

          {/* Instagram-style preview */}
          <div className="bg-background-light rounded-lg p-4 mb-4">
            {/* Profile */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-background-subtle rounded-full"></div>
              <div className="space-y-1">
                <div className="h-3 w-20 bg-background-subtle rounded"></div>
                <div className="h-2 w-12 bg-background-subtle rounded"></div>
              </div>
            </div>
            
            {/* Image placeholder */}
            <div className="w-full h-48 bg-background-subtle rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <div className="h-5 w-5 bg-background-subtle rounded"></div>
                <div className="h-5 w-5 bg-background-subtle rounded"></div>
                <div className="h-5 w-5 bg-background-subtle rounded"></div>
              </div>
              <div className="h-5 w-5 bg-background-subtle rounded"></div>
            </div>

            {/* Content lines */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-background-subtle rounded"></div>
              <div className="h-3 w-4/5 bg-background-subtle rounded"></div>
              <div className="h-3 w-3/5 bg-background-subtle rounded"></div>
              
              {/* Hashtags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-16 bg-background-subtle rounded-full"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <div className="h-9 flex-1 bg-background-subtle rounded"></div>
            <div className="h-9 flex-1 bg-background-subtle rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;