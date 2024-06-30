import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className=" text-muted-foreground">We are loading the data...</p>
      </div>
    </div>
  );
}
