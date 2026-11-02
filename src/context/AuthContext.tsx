import { AUTH_STORAGE_KEY, PROFILE_STORAGE_KEY } from '@/constants/storage';
import { authService } from '@/services/authService';
import { JwtPayload, ProfileDetails, SignInRequest, SignInResponse } from '@/types/authTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
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
  // Estado para manejar el token JWT
  const [token, setTokenRaw] = useState<string | null>(null);
  // Estado para manejar si la app está cargando (por ejemplo, verificando el token)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Estado para manejar si el usuario está autenticado o no
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // Almacena el perfil del usuario en el estado
  const [profile, setRawProfile] = useState<ProfileDetails | null>(null);
  // Referencia para manejar el timeout de expiración del token
  const timeoutRef = React.useRef<any>(null);
  const setToken = (newToken: string | null) => {
    if (newToken) {
      AsyncStorage.setItem(AUTH_STORAGE_KEY, newToken);
      setIsAuthenticated(true);
    } else {
      AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setIsAuthenticated(false);
    }
    setTokenRaw(newToken);
  };
  const setProfile = (newProfile: ProfileDetails | null) => {
    if (newProfile) {
      AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    } else {
      AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
    }
    setRawProfile(newProfile);
  };
  // Al abrir la app, verificamos si hay un token guardado localmente
  useEffect(() => {
    const bootstrapAsync = async () => {
      setIsLoading(true);
      // Cargamos el perfil del usuario desde AsyncStorage
      const storedProfile = await AsyncStorage
      .getItem(PROFILE_STORAGE_KEY)
      .then((data) => setProfile(JSON.parse(data || '{}') as ProfileDetails))
      .catch((e) => {
        console.error("Error al leer el perfil", e);
      });
      AsyncStorage.getItem(AUTH_STORAGE_KEY).then((storedToken) => {
        if (storedToken) {
          setToken(storedToken);
          setIsAuthenticated(true);
          router.replace('/home');
        }
      }).catch((e) => {
        // Manejar error de lectura
      })
      setIsLoading(false);
    };
    bootstrapAsync();
  }, []);
  const signoutTimer = (exp: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const delay = (exp * 1000) - Date.now();
    if(delay <= 0) {
      signOut();
      return;
    }else{
      timeoutRef.current = setTimeout(() => {
        signOut();
      }, delay);
    }
  };
  // Decodifica el token JWT para obtener la información del usuario
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
        router.replace('/home');
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
    router.replace('/auth/login');
    setIsAuthenticated(false);
    setProfile(null);
    setToken(null);
  }
  useEffect(() => {
    if (jwtPayload && jwtPayload.exp) {
      signoutTimer(jwtPayload.exp);
    }
    
    // Limpieza al desmontar el provider o cambiar el token
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [jwtPayload]);
  // Combina los datos del payload JWT y el perfil del usuario
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

export const useAuthContext = () => React.useContext(AuthContext);