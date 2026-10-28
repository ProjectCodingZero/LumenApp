import { authService } from '@/services/authService';
import { JwtPayload, ProfileDetails, SignInRequest, SignInResponse } from '@/types/authTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import React, { createContext, useEffect, useMemo, useState } from 'react';
// Podrías usar AsyncStorage para guardar el token permanentemente:
// import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  jwtPayload: JwtPayload | null;
  signIn: (data: SignInRequest) => Promise<SignInResponse>;
  signOut: () => void;
  profile: ProfileDetails | null; // Puedes definir un tipo más específico si lo deseas
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenRaw] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  const setToken = (newToken: string | null) => {
    if (newToken) {
      AsyncStorage.setItem("token", newToken);
      setIsAuthenticated(true);
    } else {
      AsyncStorage.removeItem("token");
      setIsAuthenticated(false);
    }
    setTokenRaw(newToken);
  };
  // Al abrir la app, verificamos si hay un token guardado localmente
  useEffect(() => {
    const bootstrapAsync = async () => {
      setIsLoading(true);
      const storedProfile = await AsyncStorage
      .getItem('profile')
      .then((data) => setProfile(JSON.parse(data || '{}') as ProfileDetails))
      .catch((e) => {
        console.error("Error al leer el perfil", e);
      });
      AsyncStorage.getItem('token').then((storedToken) => {
        if (storedToken) {
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      }).catch((e) => {
        // Manejar error de lectura
      })
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);
  const jwtPayload = useMemo<JwtPayload | null>(() => {
    if (!token) return null;
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      // Validar si expiró el token
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        return null; // Solo retorna null si expiró
      }
      return decoded;
    } catch (error) {
      console.error("Token inválido", error);
      return null;
      }
    }, [token]);
    useEffect(() => {
      if (token && !jwtPayload) {
        signOut();
      }
  }, [jwtPayload, token]);
  //Hooks a consumir
  const signIn = async (
    credentials: SignInRequest,
  ): Promise<SignInResponse> => {
    setIsLoading(true);
    try {
      const data: SignInResponse = await authService.signIn(credentials);
      
      if (data?.accessToken) {
        setProfile(data.user);
        setToken(data.accessToken);
      }
      return data;
    } catch (error) {
      // Dejamos isLoading en false y re-lanzamos el error para la vista
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = (): void =>{
    setIsAuthenticated(false);
    setProfile(null);
    setToken(null);
  }
  const userData = useMemo(() => {
    if (!jwtPayload || !profile) return null;
    return {
      ...jwtPayload,
      ...profile
    };
  }, [jwtPayload, profile]);
  // Si el token es inválido o expiró, cerramos sesión automáticamente
  useEffect(() => {
  if (token && !jwtPayload) {
    signOut();
  }
  }, [jwtPayload, token]);
  const authContext: AuthContextType = {
    jwtPayload: jwtPayload,
    signIn: signIn,
    signOut: signOut,
    isAuthenticated: isAuthenticated,
    isLoading: isLoading,
    profile: profile,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);