import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import getAccesstoken from "@/lib/user_access_token";
import { Issues } from "@/models/issues";
import { PullRequest } from "@/models/pull-request";
import { Repository } from "@/models/repository";
import axios from "axios";
import Link from "next/link";

import { ServerApiConfig } from "@/lib/api.config.server";
import { cn } from "@/lib/utils";
import { Slash } from "lucide-react";
import IssueTable from "./_components/IssueTable";
import PullTable from "./_components/PullTable";
import RepoTable from "./_components/RepoTable";
import SyncNowButton from "./_components/SyncNowButton";

interface DD {
  data: {
    type: string;
    payload: {
      connection_id: string;
      query: string;
    } | null;
    connection: {
      lastSyncAt: Date | null;
      scopes: string[];
      syncError: string | null;
    } | null;
    data: any[] | null;
  } | null;
  errorMessages: string | null;
}

async function getSyncData(
  id: string,
  scope: string = "PUBLIC_REPO"
): Promise<DD> {
  let accessToken = getAccesstoken();

  try {
    const res = await axios({
      method: "GET",
      url: `${ServerApiConfig.BASE}/sources/` + id + `?scope=${scope}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = res.data;
    return { data, errorMessages: null };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      return { data: null, errorMessages: message ?? error.message };
    }

    return { data: null, errorMessages: String(error) };
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: {
    scope?: string;
  };
}) {
  const allowedScopes = ["PUBLIC_REPO", "ISSUES", "PULL_REQUESTS"];
  const scope = searchParams?.scope ?? "PUBLIC_REPO";

  if (!allowedScopes.includes(scope)) {
    return (
      <>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center text-destructive">
            <h1 className="text-4xl font-bold">Invalid Scope</h1>
            <p className="text-lg mt-4">
              The scope you are trying to access is invalid. Please only use
              these scopes: <code>PUBLIC_REPO</code>, <code>ISSUES</code>,{" "}
              <code>PULL_REQUESTS</code>
            </p>
          </div>
        </div>
      </>
    );
  }

  const data = await getSyncData(params.slug, scope);

  if (data.errorMessages) {
    return (
      <>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center text-destructive">
            <h1 className="text-4xl font-bold">Error</h1>
            <p className="text-lg mt-4">{data.errorMessages}</p>
          </div>
        </div>
      </>
    );
  }

  const repos = data.data?.data;

  const accessToken = getAccesstoken();

  return (
    <main className="m-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-4">Sync Data</h1>
            <SyncNowButton accessToken={accessToken} />
          </div>
          <Breadcrumb className="mt-2 mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/console">Console</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {data.data?.connection?.syncError
                    ? "Sync Error"
                    : "Sync Data" + " - " + data.data?.type}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </CardHeader>
        <CardContent className="space-y-1">
          <strong>Connection ID:</strong> {data.data?.payload?.connection_id}
          <div>
            <strong>Last Sync: </strong>
            {data.data?.connection?.lastSyncAt
              ? new Date(data.data?.connection.lastSyncAt).toLocaleString()
              : "Never"}
          </div>
          <div>
            <strong>Current Scope: </strong>{" "}
            <Badge variant={"outline"}>{data.data?.payload?.query}</Badge>
          </div>
          <div>
            <strong>Availale Scopes: </strong>
            {data.data?.connection?.scopes.map((scope) => (
              <Link
                href={`/console/${params.slug}?scope=${scope}`}
                key={scope}
                className={cn(buttonVariants({ variant: "outline" }), "mr-2")}
              >
                {scope}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {scope === "PUBLIC_REPO" && (
        <RepoTable data={repos ?? ([] as Repository[])} />
      )}
      {scope === "ISSUES" && <IssueTable data={repos ?? ([] as Issues[])} />}
      {scope === "PULL_REQUESTS" && (
        <PullTable data={repos ?? ([] as PullRequest[])} />
      )}
    </main>
  );
}
