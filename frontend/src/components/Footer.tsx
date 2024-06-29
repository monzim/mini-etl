import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground py-6 px-4 md:px-6">
      <div className="container flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm">&copy; 2024 Mini-ETL. All rights reserved.</p>
        <nav className="flex items-center gap-4 mt-4 sm:mt-0">
          <Link href="#" className="hover:underline" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="hover:underline" prefetch={false}>
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
