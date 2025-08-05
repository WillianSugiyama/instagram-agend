import React from 'react';
import { Check, Copy, Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import StoryPreview from './StoryPreview';

interface ContentOption {
  id: string;
  caption: string;
  hashtags: string[];
}

interface ABTestResultsProps {
  optionA: ContentOption;
  optionB: ContentOption;
  selectedOption: string | null;
  onSelectOption: (optionId: string) => void;
  contentType: 'post' | 'story';
}

const ABTestResults: React.FC<ABTestResultsProps> = ({
  optionA,
  optionB,
  selectedOption,
  onSelectOption,
  contentType
}) => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard."
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not copy content.",
        variant: "destructive"
      });
    }
  };

  const formatContent = (option: ContentOption) => {
    return `${option.caption}\n\n${option.hashtags.join(' ')}`;
  };

  const ContentCard = ({ option, label }: { option: ContentOption; label: string }) => {
    const isSelected = selectedOption === option.id;
    
    return (
      <div 
        className={`content-card cursor-pointer ${isSelected ? 'selected' : ''}`}
        onClick={() => onSelectOption(option.id)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-text-primary">{label}</span>
            <span className="text-xs bg-background-subtle text-text-secondary px-2 py-1 rounded-full">
              {contentType === 'post' ? '📷 Post' : '📱 Story'}
            </span>
          </div>
          {isSelected && (
            <div className="p-1 rounded-full bg-success text-white">
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* Instagram-style preview */}
        {contentType === 'story' ? (
          <div className="mb-4">
            <StoryPreview 
              caption={option.caption}
              hashtags={option.hashtags}
              username="your_profile"
            />
          </div>
        ) : (
          <div className="bg-background-light rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-full gradient-primary"></div>
              <div>
                <p className="text-sm font-semibold text-text-primary">your_profile</p>
                <p className="text-xs text-text-muted">now</p>
              </div>
            </div>
            
            {/* Mock image placeholder */}
            <div className="w-full h-48 bg-background-subtle rounded-lg flex items-center justify-center mb-3">
              <div className="text-text-muted text-sm">📸 Your image here</div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <Heart className="h-5 w-5 text-text-secondary" />
                <MessageCircle className="h-5 w-5 text-text-secondary" />
                <Send className="h-5 w-5 text-text-secondary" />
              </div>
              <Bookmark className="h-5 w-5 text-text-secondary" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <p className="text-sm text-text-primary leading-relaxed">
                <span className="font-semibold">your_profile</span> {option.caption}
              </p>
              
              {/* Hashtags */}
              <div className="flex flex-wrap gap-1">
                {option.hashtags.map((tag, index) => (
                  <span key={index} className="hashtag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(formatContent(option));
            }}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onSelectOption(option.id);
            }}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className="flex-1"
          >
            {isSelected ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Selected
              </>
            ) : (
              'Select'
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
      <ContentCard option={optionA} label="Option A" />
      <ContentCard option={optionB} label="Option B" />
    </div>
  );
};

export default ABTestResults;