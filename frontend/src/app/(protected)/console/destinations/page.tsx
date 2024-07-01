import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServerApiConfig } from "@/lib/api.config.server";
import getAccesstoken from "@/lib/user_access_token";
import { cn } from "@/lib/utils";
import { DataSource } from "@/models/data-source";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";

async function getDataSources(): Promise<DataSource[]> {
  try {
    let accessToken = getAccesstoken();

    const res = await axios({
      method: "GET",
      url: `${ServerApiConfig.BASE}/sources`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = res.data as DataSource[];
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Page() {
  const dataSources = await getDataSources();
  return (
    <div className="m-10">
      <section>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Destination</h1>
          <div className="flex space-x-4">
            <Link
              href="/console/destinations/new"
              className={buttonVariants({
                variant: "secondary",
              })}
            >
              New Destination
            </Link>
          </div>
        </div>
        <p className="text-muted-foreground mt-5">
          Here is all the data sources where you want to save your sync data.
          (Destination Data Source)
        </p>
      </section>
      <section className="mt-10">
        <Table className="border rounded">
          <TableCaption>
            Connected Data Sources ({dataSources.length}) for Sync
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="w-[150px]">Type</TableHead>
              <TableHead>Last Connection Check</TableHead>
              <TableHead>Connected</TableHead>
              <TableHead className="text-start">Setup Error</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dataSources.map((conn) => (
              <TableRow key={conn.id}>
                <TableCell className="font-medium uppercase">
                  {conn.name}
                </TableCell>
                <TableCell className="uppercase font-semibold">
                  {conn.type}
                </TableCell>
                <TableCell>
                  {conn.lastConnectionCheck
                    ? format(
                        new Date(conn.lastConnectionCheck),
                        "yyyy-MM-dd HH:mm"
                      )
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {conn.connected ? (
                    <Badge variant={"destructive"}>Connected</Badge>
                  ) : (
                    <Badge variant={"outline"}>Not Connected Yet</Badge>
                  )}
                </TableCell>
                <TableCell
                  className={cn(
                    conn.setupError && "text-destructive",
                    "text-start"
                  )}
                >
                  {conn.setupError ?? "All Good"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
