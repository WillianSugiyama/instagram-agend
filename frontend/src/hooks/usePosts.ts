import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export interface ContentOption {
  caption: string;
  hashtags: string[];
}

export interface Post {
  id: string;
  prompt: string;
  type: 'POST' | 'STORY';
  optionA: ContentOption;
  optionB: ContentOption;
  selectedOption: 'A' | 'B' | null;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface CreatePostData {
  prompt: string;
  type: 'POST' | 'STORY';
}

interface UpdatePostData {
  selectedOption: 'A' | 'B';
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostData) => {
      const response = await api.post<Post>('/posts', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Content generated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to generate content';
      toast.error(message);
    },
  });
};

export const useUpdatePostSelection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, data }: { postId: string; data: UpdatePostData }) => {
      const response = await api.patch<Post>(`/posts/${postId}/select`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Selection saved!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to save selection';
      toast.error(message);
    },
  });
};

export const useUserPosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await api.get<Post[]>('/posts');
      return response.data;
    },
  });
};

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: ['posts', postId],
    queryFn: async () => {
      const response = await api.get<Post>(`/posts/${postId}`);
      return response.data;
    },
    enabled: !!postId,
  });
};