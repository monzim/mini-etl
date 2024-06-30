import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Repository } from "@/models/repository";
import Link from "next/link";

interface Props {
  data: Repository[];
}

export default function RepoTable(props: Props) {
  return (
    <div className="p-4">
      <div className="my-2">
        <h1 className="text-2xl font-bold ">Repositories</h1>
        <p className="text-muted-foreground">
          {props.data.length === 0
            ? "No repositories found"
            : `Found ${props.data.length} repositories`}
        </p>
      </div>
      <Table className="border">
        <TableCaption>
          {props.data.length === 0
            ? "No repositories found"
            : `Found ${props.data.length} repositories`}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Stars</TableHead>
            <TableHead>Forks</TableHead>
            <TableHead>Visibility</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.data.map((repo) => (
            <TableRow key={repo.id}>
              <TableCell>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={repo.url}
                  className="text-primary hover:underline font-semibold"
                >
                  {repo.name}
                </Link>
              </TableCell>
              <TableCell>{repo.description}</TableCell>
              <TableCell>
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                  {repo.language ?? "Unknown"}
                </code>
              </TableCell>
              <TableCell>{repo.stargazers_count}</TableCell>
              <TableCell>{repo.forks_count}</TableCell>
              <TableCell>{repo.private ? "Private" : "Public"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
