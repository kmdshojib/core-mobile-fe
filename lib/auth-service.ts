import { API_BASE_URL } from '@/lib/topic-service';

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface AuthUser {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  role: 'admission' | 'job' | 'admin';
  isActive: boolean;
  isVerified: boolean;
  isPremium?: boolean;
  premiumTillDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResult {
  phone: string;
  message: string;
  otp?: string;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

export interface LoginPayload {
  emailOrPhone: string;
  password: string;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

const post = async <T>(path: string, body: unknown): Promise<ApiResponse<T>> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let payload: ApiResponse<T> | null = null;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload) {
    throw {
      status: response.status,
      message: payload?.message || 'Request failed',
      data: payload,
    };
  }

  return payload;
};

export const authService = {
  register: (payload: RegisterPayload) => post<RegisterResult>('/users/register', payload),
  verifyOtp: (payload: VerifyOtpPayload) => post<AuthResult>('/users/verify-otp', payload),
  login: (payload: LoginPayload) => post<AuthResult>('/users/login', payload),
};
