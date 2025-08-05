import React, { useState } from 'react';
import Header from '@/components/Header';
import ContentGenerator from '@/components/ContentGenerator';
import ABTestResults from '@/components/ABTestResults';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import HistorySection from '@/components/HistorySection';
import { useToast } from '@/hooks/use-toast';
import { useCreatePost, useUpdatePostSelection, useUserPosts } from '@/hooks/usePosts';

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
  const [currentPost, setCurrentPost] = useState<string | null>(null);
  const { toast } = useToast();
  
  const createPostMutation = useCreatePost();
  const updateSelectionMutation = useUpdatePostSelection();
  const { data: posts, isLoading: isLoadingPosts } = useUserPosts();

  const generateContent = async (prompt: string, contentType: 'post' | 'story') => {
    const result = await createPostMutation.mutateAsync({
      prompt,
      type: contentType === 'post' ? 'POST' : 'STORY',
    });
    
    if (result) {
      setCurrentPost(result.id);
    }
  };

  const handleSelectOption = async (optionId: string) => {
    if (!currentPost) return;
    
    await updateSelectionMutation.mutateAsync({
      postId: currentPost,
      data: { selectedOption: optionId as 'A' | 'B' },
    });
  };

  const currentPostData = posts?.find(p => p.id === currentPost);
  const showResults = currentPostData && !createPostMutation.isPending;
  
  // Transform posts to history format
  const history = posts?.filter(p => p.selectedOption)?.map(post => ({
    id: post.id,
    prompt: post.prompt,
    contentType: post.type.toLowerCase() as 'post' | 'story',
    selectedOption: post.selectedOption as 'A' | 'B',
    selectedContent: post.selectedOption === 'A' ? post.optionA : post.optionB,
    createdAt: new Date(post.createdAt),
  })) || [];

  return (
    <div className="min-h-screen bg-background-light">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section / Content Generator */}
        <section className="max-w-2xl mx-auto">
          <ContentGenerator 
            onGenerate={generateContent}
            isLoading={createPostMutation.isPending}
          />
        </section>

        {/* A/B Test Results */}
        {(createPostMutation.isPending || showResults) && (
          <section className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                {createPostMutation.isPending ? 'Gerando suas opções...' : 'Escolha sua opção favorita'}
              </h2>
              <p className="text-text-secondary">
                {createPostMutation.isPending 
                  ? 'Nossa IA está criando duas versões únicas para você comparar'
                  : 'Compare as duas opções e selecione a que mais combina com você'
                }
              </p>
            </div>

            {createPostMutation.isPending ? (
              <LoadingSkeleton />
            ) : currentPostData && (
              <ABTestResults
                optionA={{ id: 'A', ...currentPostData.optionA }}
                optionB={{ id: 'B', ...currentPostData.optionB }}
                selectedOption={currentPostData.selectedOption}
                onSelectOption={handleSelectOption}
                contentType={currentPostData.type.toLowerCase() as 'post' | 'story'}
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
