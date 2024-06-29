import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const cookieStore = cookies();
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  console.log(token);

  const oneDay = 24 * 60 * 60 * 1000;
  cookieStore.set("AccessToken", String(token), {
    expires: Date.now() - oneDay,
    maxAge: oneDay,
    path: "/",
  });

  redirect("/");
}
