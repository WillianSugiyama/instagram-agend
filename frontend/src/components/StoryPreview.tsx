import React from 'react';
import { MoreVertical } from 'lucide-react';

interface StoryPreviewProps {
  caption: string;
  hashtags: string[];
  username?: string;
}

const StoryPreview: React.FC<StoryPreviewProps> = ({ 
  caption, 
  hashtags, 
  username = 'your_profile' 
}) => {
  return (
    <div className="story-preview-container">
      <div className="story-preview">
        {/* Story Header */}
        <div className="story-header">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full gradient-primary"></div>
            <span className="text-white text-sm font-medium">{username}</span>
          </div>
          <MoreVertical className="h-5 w-5 text-white" />
        </div>

        {/* Story Content Area */}
        <div className="story-content">
          <div className="story-text-overlay">
            <p className="story-caption">{caption}</p>
            {hashtags.length > 0 && (
              <div className="story-hashtags">
                {hashtags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="story-hashtag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Story Footer */}
        <div className="story-footer">
          <div className="story-input-area">
            <input 
              type="text" 
              placeholder="Reply to story..." 
              className="story-input"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPreview;