import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-6 px-4 md:px-6">
      <div className="container flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm">&copy; 2024 monzim.com. All rights reserved.</p>
        <nav className="flex items-center gap-4 mt-4 sm:mt-0">
          <a
            href="https://monzim.com/contact"
            className={cn(
              buttonVariants({
                variant: "link",
                size: "sm",
              })
            )}
          >
            Contact Me
          </a>
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
        </nav>
      </div>
    </footer>
  );
}
