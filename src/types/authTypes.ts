export interface ProfileDetails{
    id: string;
    fullName: string;
}
export interface SignInRequest {
    email: string;
    password: string;
}
export interface SignInResponse {
    accessToken: string;
    expires: Date;
    user: ProfileDetails;
}
export interface SignUpRequest {
    email: string;
    password: string;
    fullName: string;
}
export interface SignUpResponse {
    accessToken: string;
    expires: Date;
    user: ProfileDetails;
}
export interface JwtPayload {
  "sub": string;
  "unique_name": string;
  "jti": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  "nbf": number;
  "exp": number;
  "iss": string;
  "aud": string;
}

