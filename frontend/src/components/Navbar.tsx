import GithubSignInButton from "@/app/_components/SingInButton";
import getUserJWT from "@/lib/user_jwt";
import { cn } from "@/lib/utils";
import { DatabaseIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { ModeToggle } from "./Theme-Toggle";
import { siteConfig } from "@/lib/site-config";

export default async function Navbar() {
  const user = await getUserJWT();
  const isAuthenticated = !!user;

  return (
    <>
      <header className=" py-4 px-6 flex items-center justify-between border-b shadow">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg"
          prefetch={false}
        >
          <DatabaseIcon className="h-6 w-6" />
          {siteConfig.name}
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="https://github.com/monzim/mini-etl"
            className={cn(
              buttonVariants({
                variant: "link",
                size: "sm",
              })
            )}
          >
            Source Code
          </a>
          <Link
            href="/stack"
            className={cn(buttonVariants({ variant: "link" }))}
            prefetch={false}
          >
            Stack
          </Link>

          {!isAuthenticated && <GithubSignInButton />}

          {isAuthenticated && (
            <>
              <Link
                href="/console/destinations"
                className={cn(buttonVariants({ variant: "link" }))}
                prefetch={false}
              >
                Destinations
              </Link>

              <Link href={"/console"} className={cn(buttonVariants({}))}>
                <img
                  src={user.avatar}
                  alt=""
                  className="h-6 w-6 rounded-full mr-2 border border-secondary"
                />
                Console
              </Link>
            </>
          )}

          <ModeToggle />
        </nav>
      </header>
    </>
  );
}
