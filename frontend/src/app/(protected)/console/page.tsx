import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiConfig } from "@/lib/api.config";
import { Connetion } from "@/models/data-source";
import axios from "axios";
import { cookies } from "next/headers";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

async function getConnectedDataSources(): Promise<Connetion[]> {
  const cookieStore = cookies();
  let accessToken = cookieStore.get("AccessToken");

  const res = await axios({
    method: "GET",
    url: `${ApiConfig.BASE}/sources/connect`,
    headers: {
      Authorization: `Bearer ${accessToken?.value}`,
    },
  });

  const data = res.data as Connetion[];
  return data;
}

export default async function Page() {
  const connections = await getConnectedDataSources();
  return (
    <div className="m-10">
      <section>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Console</h1>
          <div className="flex space-x-4">
            <Link className={buttonVariants()} href="/console/data-source/new">
              Connect
            </Link>
            <Link
              href="/console/data-source/new"
              className={buttonVariants({
                variant: "secondary",
              })}
            >
              Add Data Source
            </Link>
          </div>
        </div>
        <p className="text-muted-foreground mt-5">
          Here all the data sources that are connected to the system are listed.
          You can see the last sync time and the scopes of the data sources.
          Click on the data source to see more details.
        </p>
      </section>

      <section className="py-10">
        <Table className="border rounded">
          <TableCaption>
            Connected Data Sources ({connections.length}) for Sync
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]"></TableHead>
              <TableHead className="w-[100px]">Provider</TableHead>
              <TableHead>Last Sync</TableHead>
              <TableHead>DataSource</TableHead>
              <TableHead className="text-right">Scropes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections.map((conn) => (
              <TableRow key={conn.id}>
                <TableCell className="font-medium uppercase">
                  <Link
                    href={`/console/data-source/${conn.id}`}
                    className={cn(
                      buttonVariants({
                        variant: "link",
                      })
                    )}
                  >
                    {conn.id}
                  </Link>
                </TableCell>
                <TableCell className="uppercase font-semibold">
                  {conn.provider.type}
                </TableCell>
                <TableCell>
                  {conn.lastSyncAt
                    ? format(new Date(conn.lastSyncAt), "yyyy-MM-dd HH:mm")
                    : "N/A"}
                </TableCell>
                <TableCell>{conn.dataSource.type}</TableCell>
                <TableCell className="text-right">
                  {conn.scopes.map((scope) => (
                    <Badge key={scope} className="mr-2">
                      {scope}
                    </Badge>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
