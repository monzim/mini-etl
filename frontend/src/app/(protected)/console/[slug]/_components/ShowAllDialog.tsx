import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  type: string;
  data: any;
}

export default function ShowAllDialog(props: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Show All</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>All {props.type} Data</DialogTitle>
          <DialogDescription>
            This is all the data for {props.type}.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] w-[350px] rounded-md border p-4">
          <code className="font-mono text-xs">
            <pre>{JSON.stringify(props.data, null, 2)}</pre>
          </code>
        </ScrollArea>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
