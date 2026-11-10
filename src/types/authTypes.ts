/** Tipos de autenticación alineados con LumenBackend.Shared/Dtos/AuthenticationModel.cs */

export interface ProfileDetails {
  id: string;
  fullName: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

/** POST /api/auth/signin -> 200 { accessToken, expires, profile } */
export interface SignInResponse {
  accessToken: string;
  /** Fecha de expiración del token en formato ISO 8601 */
  expires: string;
  profile: ProfileDetails | null;
}

/**
 * POST /api/auth/signup -> 201 sin cuerpo.
 * El backend no inicia sesión automáticamente al registrarse.
 */
export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  surname: string;
  document: string;
  address?: string | null;
  postalCode: string;
  numberPhone: string;
}

export type SignUpResponse = void;

/** Payload del JWT emitido por HmacJwtTokenService (claims sub/unique_name/jti/role/aud) */
export interface JwtPayload {
  sub: string;
  unique_name: string;
  jti: string;
  role: string | string[];
  nbf: number;
  exp: number;
  iss: string;
  aud: string | string[];
}
