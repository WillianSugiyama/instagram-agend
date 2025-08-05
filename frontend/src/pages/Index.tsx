import React, { useState } from 'react';
import Header from '@/components/Header';
import ContentGenerator from '@/components/ContentGenerator';
import ABTestResults from '@/components/ABTestResults';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useToast } from '@/hooks/use-toast';
import { useCreatePost, useUpdatePostSelection, useUserPosts } from '@/hooks/usePosts';

interface ContentOption {
  id: string;
  caption: string;
  hashtags: string[];
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
                {createPostMutation.isPending ? 'Generating your options...' : 'Choose your favorite option'}
              </h2>
              <p className="text-text-secondary">
                {createPostMutation.isPending 
                  ? 'Our AI is creating two unique versions for you to compare'
                  : 'Compare both options and select the one that best suits you'
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
      </main>
    </div>
  );
};

export default Index;
