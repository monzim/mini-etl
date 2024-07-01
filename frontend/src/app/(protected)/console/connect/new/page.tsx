import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";

import { ApiConfig } from "@/lib/api.config";
import getAccesstoken from "@/lib/user_access_token";
import getUserJWT from "@/lib/user_jwt";
import { DataSource } from "@/models/data-source";
import axios from "axios";
import NewConnectionForm from "./_components/NewConnectionForm";

async function getDataSources(): Promise<DataSource[]> {
  try {
    let accessToken = getAccesstoken();

    const res = await axios({
      method: "GET",
      url: `${ApiConfig.BASE}/sources`,
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
  const accessToken = getAccesstoken();
  const jwt = await getUserJWT();
  const dataSources = await getDataSources();

  return (
    <div className="m-10">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold first:mt-0">
        Connect You provider with A Destination to Sync Data
      </h2>
      <Breadcrumb className="mt-2 mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/console">Console</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <NewConnectionForm
        accessToken={accessToken}
        provider_id={jwt?.sub}
        dataSources={dataSources}
      />
    </div>
  );
}
