import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    createdAt: string;
  };
  accessToken: string;
}

export const useSignup = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await api.post<AuthResponse>('/auth/signup', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success('Account created successfully!');
      navigate('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create account';
      toast.error(message);
    },
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post<AuthResponse>('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success('Logged in successfully!');
      navigate('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Invalid credentials';
      toast.error(message);
    },
  });
};