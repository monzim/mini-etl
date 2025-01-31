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
import { Connetion } from "@/models/data-source";
import axios from "axios";
import { format } from "date-fns";
import { Frown } from "lucide-react";
import Link from "next/link";
import ToggleSyncButton from "./_components/toggle-sync-button";

async function getConnectedDataSources(): Promise<Connetion[]> {
  try {
    let accessToken = getAccesstoken();

    const res = await axios.get(`${ServerApiConfig.BASE}/sources/connect`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    const data = res.data as Connetion[];
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data);
      return [];
    }

    console.error(error);
    return [];
  }
}

export default async function Page() {
  const accessToken = getAccesstoken();
  const connections = await getConnectedDataSources();
  return (
    <div className="m-10">
      <section>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Console</h1>
          <div className="flex space-x-4">
            <Link className={buttonVariants()} href="/console/connect/new">
              Connect
            </Link>
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
          Here all the data sources where you want to save your sync data. You
          can click on the data source to see all the data and sync it. (Sync
          happens every 30 minutes)
        </p>
      </section>

      {connections.length === 0 ? (
        <div className="mt-10 flex text-center w-full justify-center items-center  min-h-[50vh]">
          <div className="p-10 border rounded-md">
            <Frown size={64} className="text-muted-foreground mx-auto block" />
            <p className="text-muted-foreground max-w-md mt-5">
              You don&apos;t have any connected data sources yet. Click on the
              connect button to connect a new data source.
            </p>

            <Link
              href="/console/connect/new"
              className={cn(
                buttonVariants({
                  variant: "default",
                }),
                "mt-5"
              )}
            >
              Connect Data Source
            </Link>
          </div>
        </div>
      ) : (
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
                <TableHead>Action</TableHead>

                <TableHead className="text-right">Scropes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connections.map((conn) => (
                <TableRow key={conn.id}>
                  <TableCell className="font-medium uppercase">
                    <a
                      href={`/console/${conn.id}`}
                      className={cn(
                        buttonVariants({
                          variant: "link",
                        }),
                        "underline"
                      )}
                    >
                      {conn.id}
                    </a>
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
                  <TableCell>
                    <ToggleSyncButton
                      accessToken={accessToken}
                      connectionId={conn.id}
                      status={conn.syncOn}
                    />
                  </TableCell>
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
      )}
    </div>
  );
}
