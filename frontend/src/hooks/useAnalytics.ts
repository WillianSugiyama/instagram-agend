import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface SelectionPreference {
  optionA: number;
  optionB: number;
}

interface AIModelUsage {
  model: string;
  count: number;
  avgResponseTime: number;
}

interface AverageMetrics {
  promptLength: number;
  captionLength: number;
  hashtagCount: number;
  responseTime: number;
}

interface ContentTypePreference {
  type: string;
  count: number;
}

interface HourlyPost {
  hour: number;
  count: number;
}

interface UserInsights {
  totalPosts: number;
  selectionPreference: SelectionPreference;
  aiModelUsage: AIModelUsage[];
  averageMetrics: AverageMetrics;
  contentTypePreference: ContentTypePreference[];
  postsByHour: HourlyPost[];
}

interface PopularHashtag {
  tag: string;
  count: number;
}

interface AIModelPerformance {
  model: string;
  usageCount: number;
  avgResponseTime: number;
}

interface GlobalInsights {
  totalUsers: number;
  totalPosts: number;
  totalSelections: number;
  popularHashtags: PopularHashtag[];
  aiModelPerformance: AIModelPerformance[];
}

interface AISuggestions {
  suggestions: {
    idealCaptionLength: number;
    idealHashtagCount: number;
    tip: string;
  };
}

export const useUserInsights = () => {
  return useQuery<UserInsights>({
    queryKey: ["analytics", "insights"],
    queryFn: async () => {
      const response = await api.get("/analytics/insights");
      return response.data;
    },
  });
};

export const useGlobalInsights = () => {
  return useQuery<GlobalInsights>({
    queryKey: ["analytics", "global"],
    queryFn: async () => {
      const response = await api.get("/analytics/global");
      return response.data;
    },
  });
};

export const useAISuggestions = () => {
  return useQuery<AISuggestions>({
    queryKey: ["analytics", "suggestions"],
    queryFn: async () => {
      const response = await api.get("/analytics/suggestions");
      return response.data;
    },
  });
};