import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Issues } from "@/models/issues";
import Link from "next/link";

interface Props {
  data: Issues[];
}

export default function IssueTable(props: Props) {
  return (
    <div className="p-4">
      <div className="my-2">
        <h1 className="text-2xl font-bold ">Issues</h1>
        <p className="text-muted-foreground">
          {props.data.length === 0
            ? "No issues found"
            : `Found ${props.data.length} issues`}
        </p>
      </div>
      <Table className="border">
        <TableCaption>
          {props.data.length === 0
            ? "No issues found"
            : `Found ${props.data.length} issues`}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left"></TableHead>
            <TableHead className="text-left">Title</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Author Association</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.data.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={issue.url}
                  className="text-primary hover:underline"
                >
                  {issue.title}
                </Link>
              </TableCell>
              <TableCell>{issue.state}</TableCell>
              <TableCell>{issue.comments}</TableCell>
              <TableCell>
                {new Date(issue.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(issue.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>{issue.author_association}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
