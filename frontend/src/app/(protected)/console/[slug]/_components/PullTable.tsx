import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PullRequest } from "@/models/pull-request";
import Link from "next/link";

interface Props {
  data: PullRequest[];
}

export default function PullRequestTable(props: Props) {
  return (
    <div className="p-4">
      <div className="my-2">
        <h1 className="text-2xl font-bold ">Pull Requests</h1>
        <p className="text-muted-foreground">
          {props.data.length === 0
            ? "No pull requests found"
            : `Found ${props.data.length} pull requests`}
        </p>
      </div>
      <Table className="border">
        <TableCaption>
          {props.data.length === 0
            ? "No pull requests found"
            : `Found ${props.data.length} pull requests`}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left"></TableHead>
            <TableHead className="text-left">Title</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Author Association</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.data.map((pullRequest) => (
            <TableRow key={pullRequest.id}>
              <TableCell>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={pullRequest.url}
                  className="text-primary hover:underline"
                >
                  {pullRequest.title}
                </Link>
              </TableCell>
              <TableCell>{pullRequest.state}</TableCell>
              <TableCell>
                {new Date(pullRequest.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(pullRequest.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>{pullRequest.author_association}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
