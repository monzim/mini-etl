"use server";

import { cookies } from "next/headers";
import { getDecodedJWT } from "./jwt";

export default async function getUserJWT() {
  const cookieStore = cookies();
  let accessToken = cookieStore.get("AccessToken");
  let jwt = await getDecodedJWT(accessToken?.value);
  return jwt;
}
