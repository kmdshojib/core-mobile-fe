import Constants from 'expo-constants';
import { Platform } from 'react-native';

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface TopicSummary {
  title: string;
  slug: string;
  subtopics: number;
  practiceQuestions: number;
  previousYearQuestions: number;
}

export interface TopicQuestion {
  id: number;
  questionSetId?: string;
  questionId?: string;
  topic: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  source?: string;
}

export interface TopicReading {
  title: string;
  body: string;
  keyPoints: string[];
}

const configuredBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5001/api/v1';

const getNativeHost = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    '';

  return hostUri.split(':')[0];
};

export const API_BASE_URL = (() => {
  if (Platform.OS === 'web') {
    return configuredBaseUrl;
  }

  const nativeHost = getNativeHost();

  if (nativeHost && /localhost|127\.0\.0\.1/.test(configuredBaseUrl)) {
    return configuredBaseUrl.replace(/localhost|127\.0\.0\.1/, nativeHost);
  }

  return configuredBaseUrl;
})();

const request = async <T>(path: string): Promise<ApiResponse<T>> => {
  const response = await fetch(`${API_BASE_URL}${path}`);
  let payload: ApiResponse<T> | null = null;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload) {
    throw new Error(payload?.message || `Request failed: ${response.status}`);
  }

  return payload;
};

export const topicService = {
  getTopics: () => request<TopicSummary[]>('/topics'),
  getReading: (topic: string) =>
    request<TopicReading>(`/topics/${encodeURIComponent(topic)}/reading`),
  getQuestions: (params: {
    topics: string[];
    type?: 'practice' | 'previous' | 'all';
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams({
      topics: params.topics.join('||'),
      type: params.type ?? 'all',
      limit: String(params.limit ?? 25),
    });

    return request<TopicQuestion[]>(`/topics/questions?${searchParams.toString()}`);
  },
};
