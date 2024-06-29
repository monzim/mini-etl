import { Github } from "lucide-react";
import { Button } from "./ui/button";

export default function SignInButton() {
  return (
    <>
      <Button className="gap-2">
        <Github />
        SignIn
      </Button>
    </>
  );
}
