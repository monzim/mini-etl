export interface JWTPayload {
  sub: string;
  username: string;
  avatar: string;
  email: string;
  display_name: string;
  session_id: string;
}
