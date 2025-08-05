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
        title: "Prompt necessário",
        description: "Por favor, descreva o conteúdo que deseja criar.",
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
          Crie Conteúdo Incrível
        </h2>
        <p className="text-text-secondary">
          Descreva sua ideia e deixe a IA criar opções únicas para você escolher
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
            Descreva seu conteúdo
          </label>
          <div className="relative">
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Uma foto de café da manhã saudável com aveia, frutas vermelhas e mel, com uma vibe aconchegante e natural..."
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
              Gerando conteúdo...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Gerar Conteúdo
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContentGenerator;