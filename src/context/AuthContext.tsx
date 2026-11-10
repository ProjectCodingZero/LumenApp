import { AUTH_STORAGE_KEY, PROFILE_STORAGE_KEY } from '@/constants/storage';
import { setUnauthorizedHandler } from '@/services/apiClient';
import { authService } from '@/services/authService';
import { JwtPayload, ProfileDetails, SignInRequest, SignInResponse } from '@/types/authTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  jwtPayload: JwtPayload | null;
  profile: ProfileDetails | null;
  signIn: (credentials: SignInRequest) => Promise<SignInResponse>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const signOut = useCallback(() => {
    AsyncStorage.multiRemove([AUTH_STORAGE_KEY, PROFILE_STORAGE_KEY]).catch(() => {});
    setToken(null);
    setProfile(null);
  }, []);

  const signIn = useCallback(async (credentials: SignInRequest): Promise<SignInResponse> => {
    setIsLoading(true);
    try {
      const data = await authService.signIn(credentials);
      if (data?.accessToken) {
        // Se valida que el token emitido sea decodificable y no esté expirado.
        if (!decodeValidPayload(data.accessToken)) {
          throw new Error('El servidor devolvió un token de sesión inválido.');
        }
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, data.accessToken);
        if (data.profile) {
          await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data.profile));
        } else {
          await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
        }
        setToken(data.accessToken);
        setProfile(data.profile ?? null);
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cierre de sesión automático cuando la API responde 401 (token expirado).
  useEffect(() => {
    setUnauthorizedHandler(() => signOut());
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  // Al abrir la app, restaurar la sesión guardada localmente.
  useEffect(() => {
    let cancelled = false;
    const bootstrapAsync = async () => {
      try {
        const [storedToken, storedProfile] = await AsyncStorage.multiGet([
          AUTH_STORAGE_KEY,
          PROFILE_STORAGE_KEY,
        ]);
        if (cancelled) return;
        const parsedProfile = storedProfile[1] ? safeParseProfile(storedProfile[1]) : null;
        setProfile(parsedProfile);
        const hasToken = storedToken[0] !== null && Boolean(storedToken[1]);
        if (hasToken && storedToken[1] && decodeValidPayload(storedToken[1])) {
          setToken(storedToken[1]);
        } else if (hasToken) {
          // Token expirado o corrupto: limpiar restos de sesión.
          signOut();
        }
      } catch {
        if (!cancelled) signOut();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    bootstrapAsync();
    return () => {
      cancelled = true;
    };
  }, [signOut]);

  // Payload decodificado del JWT. Null si falta el token, es inválido o ya expiró.
  const jwtPayload = useMemo<JwtPayload | null>(() => {
    if (!token) return null;
    return decodeValidPayload(token);
  }, [token]);

  // La sesión es válida solo si hay token y su payload es decodificable y vigente.
  const isAuthenticated = token !== null && jwtPayload !== null;

  // Timer que sincroniza el logout con la expiración real del token (15 min en el backend).
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (jwtPayload?.exp) {
      const delay = jwtPayload.exp * 1000 - Date.now();
      if (delay > 0) {
        timeoutRef.current = setTimeout(() => signOut(), delay);
      }
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [jwtPayload, signOut]);

  const value = useMemo<AuthContextType>(
    () => ({
      isLoading,
      isAuthenticated,
      jwtPayload,
      profile,
      signIn,
      signOut,
    }),
    [isLoading, isAuthenticated, jwtPayload, profile, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/** Decodifica el JWT y verifica la expiración; null si es inválido o vencido. */
function decodeValidPayload(token: string): JwtPayload | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (typeof decoded.exp === 'number' && decoded.exp * 1000 <= Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

function safeParseProfile(raw: string): ProfileDetails | null {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && typeof parsed.id === 'string') {
      return parsed as ProfileDetails;
    }
    return null;
  } catch {
    return null;
  }
}

export const useAuthContext = () => React.useContext(AuthContext);
