import { GithubIcon } from "@/components/Icons";
import { buttonVariants } from "@/components/ui/button";
import getUserJWT from "@/lib/user_jwt";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function GithubSignInButton() {
  const user = await getUserJWT();
  const isAuthenticated = !!user;

  if (isAuthenticated) {
    return (
      <Link
        href="/console"
        className={cn(buttonVariants({ variant: "secondary" }), "gap-2")}
      >
        <img src={user.avatar} alt="" className="h-6 w-6 rounded-full mr-2" />
        Console
      </Link>
    );
  }

  return (
    <Link
      href="http://localhost:3000/api/auth/callback/github"
      className={cn(buttonVariants(), "gap-2")}
    >
      <GithubIcon className="h-5 w-5" />
      Sign in with GitHub
    </Link>
  );
}
