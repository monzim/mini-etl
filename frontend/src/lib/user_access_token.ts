import { cookies } from "next/headers";

export default function getAccesstoken() {
  const cookieStore = cookies();
  return cookieStore.get("AccessToken")?.value || null;
}
