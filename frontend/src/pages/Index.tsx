import React, { useState } from 'react';
import Header from '@/components/Header';
import ContentGenerator from '@/components/ContentGenerator';
import ABTestResults from '@/components/ABTestResults';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import HistorySection from '@/components/HistorySection';
import { useToast } from '@/hooks/use-toast';

interface ContentOption {
  id: string;
  caption: string;
  hashtags: string[];
}

interface HistoryItem {
  id: string;
  prompt: string;
  contentType: 'post' | 'story';
  selectedOption: 'A' | 'B';
  selectedContent: {
    caption: string;
    hashtags: string[];
  };
  createdAt: Date;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentContentType, setCurrentContentType] = useState<'post' | 'story'>('post');
  const [optionA, setOptionA] = useState<ContentOption | null>(null);
  const [optionB, setOptionB] = useState<ContentOption | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { toast } = useToast();

  // Mock AI generation function - replace with real API call
  const generateContent = async (prompt: string, contentType: 'post' | 'story') => {
    setIsLoading(true);
    setSelectedOption(null);
    setCurrentPrompt(prompt);
    setCurrentContentType(contentType);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock content generation based on content type
      const mockOptionA: ContentOption = {
        id: 'A',
        caption: contentType === 'post' 
          ? `🌟 ${prompt.slice(0, 80)}... Essa energia incrível que só ${contentType === 'post' ? 'um post' : 'um story'} especial pode transmitir! ✨`
          : `✨ ${prompt.slice(0, 50)}... Momentos únicos que merecem ser compartilhados! 🌟`,
        hashtags: contentType === 'post'
          ? ['#inspiracao', '#lifestyle', '#moments', '#photooftheday', '#amazing', '#blessed']
          : ['#stories', '#moments', '#daily', '#vibe', '#mood']
      };

      const mockOptionB: ContentOption = {
        id: 'B',
        caption: contentType === 'post'
          ? `💫 Que momento especial! ${prompt.slice(0, 70)}... Cada detalhe conta uma história única e especial. 🎯`
          : `🔥 ${prompt.slice(0, 60)}... A vida é feita de momentos assim! 💯`,
        hashtags: contentType === 'post'
          ? ['#authentic', '#creative', '#inspiration', '#goodvibes', '#perfect', '#grateful']
          : ['#energy', '#goodvibes', '#authentic', '#real', '#life']
      };

      setOptionA(mockOptionA);
      setOptionB(mockOptionB);

      toast({
        title: "Conteúdo gerado!",
        description: "Duas opções incríveis foram criadas para você escolher."
      });

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o conteúdo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
    
    // Save to history
    const selectedContent = optionId === 'A' ? optionA! : optionB!;
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      prompt: currentPrompt,
      contentType: currentContentType,
      selectedOption: optionId as 'A' | 'B',
      selectedContent: {
        caption: selectedContent.caption,
        hashtags: selectedContent.hashtags
      },
      createdAt: new Date()
    };

    setHistory(prev => [newHistoryItem, ...prev]);

    toast({
      title: "Opção selecionada!",
      description: `Opção ${optionId} foi salva no seu histórico.`
    });
  };

  const showResults = optionA && optionB && !isLoading;

  return (
    <div className="min-h-screen bg-background-light">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section / Content Generator */}
        <section className="max-w-2xl mx-auto">
          <ContentGenerator 
            onGenerate={generateContent}
            isLoading={isLoading}
          />
        </section>

        {/* A/B Test Results */}
        {(isLoading || showResults) && (
          <section className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                {isLoading ? 'Gerando suas opções...' : 'Escolha sua opção favorita'}
              </h2>
              <p className="text-text-secondary">
                {isLoading 
                  ? 'Nossa IA está criando duas versões únicas para você comparar'
                  : 'Compare as duas opções e selecione a que mais combina com você'
                }
              </p>
            </div>

            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <ABTestResults
                optionA={optionA!}
                optionB={optionB!}
                selectedOption={selectedOption}
                onSelectOption={handleSelectOption}
                contentType={currentContentType}
              />
            )}
          </section>
        )}

        {/* History Section */}
        <section className="max-w-6xl mx-auto">
          <HistorySection history={history} />
        </section>
      </main>
    </div>
  );
};

export default Index;
