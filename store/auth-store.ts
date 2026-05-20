import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  AuthUser,
  LoginPayload,
  RegisterPayload,
  RegisterResult,
  VerifyOtpPayload,
  authService,
} from '@/lib/auth-service';
import { persistentStorage } from '@/lib/persistent-storage';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  pendingPhone: string | null;
  registrationResult: RegisterResult | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  register: (payload: RegisterPayload) => Promise<RegisterResult>;
  verifyOtp: (payload: VerifyOtpPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message?: unknown }).message || 'Request failed');
  }

  return 'Request failed';
};

const isBackendUser = (user: unknown): user is AuthUser => {
  if (typeof user !== 'object' || user === null) return false;

  const candidate = user as Partial<AuthUser>;

  return (
    typeof candidate._id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.phone === 'string' &&
    typeof candidate.role === 'string' &&
    typeof candidate.isActive === 'boolean' &&
    typeof candidate.isVerified === 'boolean'
  );
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      pendingPhone: null,
      registrationResult: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      register: async (payload) => {
        set({ loading: true, error: null });

        try {
          const response = await authService.register(payload);
          set({
            pendingPhone: response.data.phone,
            registrationResult: response.data,
            loading: false,
          });

          return response.data;
        } catch (error) {
          set({ error: getErrorMessage(error), loading: false });
          throw error;
        }
      },

      verifyOtp: async (payload) => {
        set({ loading: true, error: null });

        try {
          const response = await authService.verifyOtp(payload);
          set({
            user: response.data.user,
            token: response.data.token,
            refreshToken: response.data.refreshToken,
            pendingPhone: null,
            registrationResult: null,
            loading: false,
            isAuthenticated: true,
          });
        } catch (error) {
          set({ error: getErrorMessage(error), loading: false });
          throw error;
        }
      },

      login: async (payload) => {
        set({ loading: true, error: null });

        try {
          const response = await authService.login(payload);
          set({
            user: response.data.user,
            token: response.data.token,
            refreshToken: response.data.refreshToken,
            pendingPhone: null,
            registrationResult: null,
            loading: false,
            isAuthenticated: true,
          });
        } catch (error) {
          set({ error: getErrorMessage(error), loading: false });
          throw error;
        }
      },

      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          pendingPhone: null,
          registrationResult: null,
          error: null,
          isAuthenticated: false,
        }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'core-english-auth',
      storage: createJSONStorage(() => persistentStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        pendingPhone: state.pendingPhone,
        registrationResult: state.registrationResult,
        isAuthenticated: state.isAuthenticated,
      }),
      merge: (persistedState, currentState) => {
        const state =
          typeof persistedState === 'object' && persistedState !== null
            ? (persistedState as Partial<AuthState>)
            : {};
        const hasValidSession =
          isBackendUser(state.user) &&
          typeof state.token === 'string' &&
          state.token.length > 0 &&
          typeof state.refreshToken === 'string' &&
          state.refreshToken.length > 0;

        return {
          ...currentState,
          ...state,
          user: hasValidSession ? (state.user as AuthUser) : null,
          token: hasValidSession ? (state.token as string) : null,
          refreshToken: hasValidSession ? (state.refreshToken as string) : null,
          isAuthenticated: hasValidSession,
        };
      },
    },
  ),
);
