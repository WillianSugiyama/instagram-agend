import React, { useState } from 'react';
import { Loader2, Camera, Smartphone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ContentGeneratorProps {
  onGenerate: (prompt: string, contentType: 'post' | 'story') => void;
  isLoading: boolean;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState<'post' | 'story'>('post');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please describe the content you want to create.",
        variant: "destructive"
      });
      return;
    }
    onGenerate(prompt, contentType);
  };

  const characterCount = prompt.length;
  const maxChars = 500;

  return (
    <div className="bg-card rounded-lg shadow-medium p-8 border border-border">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 rounded-full gradient-primary mb-4">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Create Amazing Content
        </h2>
        <p className="text-text-secondary">
          Describe your idea and let AI create unique options for you to choose
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Content Type Toggle */}
        <div className="flex justify-center">
          <div className="toggle-group">
            <button
              type="button"
              onClick={() => setContentType('post')}
              className={`toggle-item ${contentType === 'post' ? 'active' : ''}`}
            >
              <Camera className="h-4 w-4 mr-2" />
              Post
            </button>
            <button
              type="button"
              onClick={() => setContentType('story')}
              className={`toggle-item ${contentType === 'story' ? 'active' : ''}`}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Story
            </button>
          </div>
        </div>

        {/* Prompt Textarea */}
        <div className="space-y-2">
          <label htmlFor="prompt" className="block text-sm font-semibold text-text-primary">
            Describe your content
          </label>
          <div className="relative">
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: A healthy breakfast photo with oats, berries, and honey, with a cozy and natural vibe..."
              className="min-h-[120px] resize-none border-border focus:border-input-focus transition-colors"
              maxLength={maxChars}
            />
            <div className="absolute bottom-3 right-3 text-xs text-text-muted">
              {characterCount}/{maxChars}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full btn-primary h-12 text-base font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Generating content...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Content
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContentGenerator;