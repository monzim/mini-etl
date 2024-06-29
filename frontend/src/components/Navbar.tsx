import { DatabaseIcon } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import getUserJWT from "@/lib/user_jwt";
import { cn } from "@/lib/utils";
import GithubSignInButton from "@/app/_components/SingInButton";

export default async function Navbar() {
  const user = await getUserJWT();
  const isAuthenticated = !!user;

  return (
    <>
      <header className=" py-4 px-6 flex items-center justify-between border-b">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg"
          prefetch={false}
        >
          <DatabaseIcon className="h-6 w-6" />
          Mini-ETL
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:underline" prefetch={false}>
            Features
          </Link>

          {!isAuthenticated && <GithubSignInButton />}

          {isAuthenticated && (
            <Link href={"/console"} className={cn(buttonVariants({}))}>
              <img
                src={user.avatar}
                alt=""
                className="h-6 w-6 rounded-full mr-2"
              />
              Console
            </Link>
          )}
        </nav>
      </header>
    </>
  );
}
