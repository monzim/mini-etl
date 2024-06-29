import GithubSignInButton from "@/app/_components/SingInButton";
import getUserJWT from "@/lib/user_jwt";
import { cn } from "@/lib/utils";
import { DatabaseIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

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
          Mini-ETL
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "link" }))}
            prefetch={false}
          >
            Features
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
        </nav>
      </header>
    </>
  );
}
