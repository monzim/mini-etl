import * as jose from "jose";

const secret = `ZOR8RihyPX1sKMbfz76PRzJnwmGGZqGEJwdOyMe1Az68fpR8YdpPc6wpdMtPTMXXxIy38omDLRjMnt3A1g`;

export interface DecodedJWT extends jose.JWTPayload {
  username: string;
  avatar: string;
  email: string;
  display_name: string;
  session_id: string;
}

// export async function decodeJWT(accessToken: string | undefined) {}

export async function decodeJWT(
  accessToken: string | undefined
): Promise<DecodedJWT | null> {
  if (!accessToken) return null;

  try {
    const secretBuffer = new TextEncoder().encode(secret);
    const { payload } = await jose.jwtVerify(accessToken, secretBuffer);
    return payload as DecodedJWT;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export async function getDecodedJWT(
  accessToken: string | null | undefined
): Promise<DecodedJWT | null> {
  if (!accessToken) return null;

  try {
    const decodedPayload = await decodeJWT(accessToken);
    return decodedPayload as DecodedJWT;
  } catch (error) {
    console.error(error);
    return null;
  }
}
