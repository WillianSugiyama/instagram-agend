import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';

interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export const useCheckAuth = () => {
  const { setAuth, logout, token } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await api.get<UserResponse>('/auth/me');
      return response.data;
    },
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (data && token) {
      setAuth(data, token);
    }
  }, [data, token, setAuth]);

  return { isLoading };
};