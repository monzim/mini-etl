"use client";

import { GithubIcon } from "@/components/Icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ApiConfig } from "@/lib/api.config";
import { cn } from "@/lib/utils";
import { DataSource } from "@/models/data-source";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, Unplug } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  accessToken: string | null;
  provider_id: string | undefined;
  dataSources: DataSource[];
}

const formSchema = z.object({
  data_source_id: z.string(),
  provider_id: z.string(),
  scopes: z.array(z.string()).min(1).max(3),
});

export default function NewConnectionForm(props: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider_id: props.provider_id,
      scopes: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const res = await axios({
        method: "post",
        url: `${ApiConfig.BASE}/sources/connect`,
        headers: {
          Authorization: `Bearer ${props.accessToken}`,
        },
        data: {
          data_source_id: values.data_source_id,
          provider_id: props.provider_id,
          scopes: values.scopes,
        },
      });

      if (res.status === 201) {
        toast.success(
          "Connection request sent successfully. You can view the status of the connection in the data source page. Redirecting ..."
        );

        return router.push("/console");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          return toast.error(error.response.data.message);
        }
      }
      toast.error("Failed to connect the data source. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function CSwitch({ type }: { type: string }) {
    const values = form.watch("scopes") ?? [];
    const checked = values.includes(type);

    return (
      <Switch
        id={type}
        checked={checked}
        onCheckedChange={(checked) => {
          if (checked) {
            form.setValue("scopes", [...values, type]);
          } else {
            form.setValue(
              "scopes",
              values.filter((scope) => scope !== type)
            );
          }
        }}
      />
    );
  }

  return (
    <>
      <section className="flex justify-center items-center mt-10 mb-10 space-x-4">
        <div className="rounded-full bg-secondary text-secondary-foreground w-full min-h-24 flex justify-center items-center relative">
          <div className="flex-col items-center flex p-2">
            <GithubIcon className="w-8 h-8 my-2" />
            <div className="text-center">
              {form.watch("scopes")?.map((scope) => (
                <Badge key={scope} variant={"default"} className="mr-1 mb-1">
                  {scope}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="h-1 bg-primary w-64"></div>
            <div className="absolute top-0 right-0 -mt-1 -mr-4">
              <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-l-primary border-t-transparent border-b-transparent"></div>
            </div>
          </div>
        </div>

        <div className="bg-secondary text-secondary-foreground w-full h-20 rounded-lg flex justify-center items-center relative">
          <div className="absolute">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Mini ETL
            </h4>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="h-1 bg-primary w-64"></div>
            <div className="absolute top-0 right-0 -mt-1 -mr-4">
              <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-l-primary border-t-transparent border-b-transparent"></div>
            </div>
          </div>
        </div>

        <div className="rounded-md bg-secondary p-10 flex justify-center items-center relative w-full">
          <div className="absolute text-center">
            {(form.watch("data_source_id") &&
              props.dataSources.find(
                (source) => source.id === form.watch("data_source_id")
              )?.type === "S3" && (
                <img
                  src="https://icon.icepanel.io/AWS/svg/Storage/S3-on-Outposts.svg"
                  width="140"
                  height="70"
                  alt="Amazon S3"
                  className="aspect-[2/1] object-contain"
                />
              )) || (
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg"
                width="140"
                height="70"
                alt="Postgres"
                className="aspect-[2/1] object-contain"
              />
            )}
          </div>
        </div>
      </section>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mt-10"
        >
          <div className="flex justify-center">
            <Button
              disabled={loading}
              size={"lg"}
              type="submit"
              className="w-full max-w-3xl"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Connect <Unplug className="w-6 h-6 ml-2" />
            </Button>
          </div>

          <div className="flex gap-5 flex-col lg:flex-row">
            <Card>
              <div className="p-10">
                <h3 className="text-xl font-semibold">
                  Step 1: Choose a provider
                </h3>

                <p className="text-muted-foreground mt-2">
                  Choose a provider from the list of providers to connect with.
                  (we support only Github for now)
                </p>

                <Select value="github">
                  <SelectTrigger className="w-[180px] mt-4">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="github">GitHub</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            <Card>
              <div className="p-10">
                <h3 className="text-xl font-semibold">
                  Step 2: Select your data destination
                </h3>

                <p className="text-muted-foreground mt-2">
                  Pick a data destination to sync your data with. (we support
                  only S3 and Postgres for now). You can add new data
                  destinations from the{" "}
                  <Link
                    href={"/console/destinations"}
                    className="underline text-primary"
                  >
                    data source page
                  </Link>
                  . Here you can only choose verified data destinations that you
                  previously added.
                </p>

                <FormField
                  control={form.control}
                  name="data_source_id"
                  render={({ field }) => (
                    <FormItem className="mt-4 max-w-[300px]">
                      <FormLabel>
                        Data Destination
                        <span className="text-sm text-muted-foreground">
                          (required)
                        </span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a destination" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {props.dataSources.map((source) => (
                            <SelectItem
                              key={source.id}
                              value={source.id}
                              disabled={!source.connected}
                              className={cn(
                                !source.connected && "text-muted-foreground"
                              )}
                            >
                              {source.name} - {source.type} -{" "}
                              {source.id.slice(-4)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">
                Step 3: Choose the scopes
              </h3>

              <p className="text-muted-foreground mt-2">
                Choose the scopes you want to sync with the data destination.
                You can choose multiple scopes.
              </p>
            </CardHeader>

            <CardContent>
              <FormField
                control={form.control}
                name="scopes"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>
                      Scopes
                      <span className="text-sm text-muted-foreground">
                        (required)
                      </span>
                    </FormLabel>

                    <div className="space-y-2 flex space-x-2 items-end">
                      <div className="flex items-center space-x-2">
                        <CSwitch type="PUBLIC_REPO" />
                        <Label htmlFor="PUBLIC_REPO">Public Repositories</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <CSwitch type="ISSUES" />
                        <Label htmlFor="ISSUES">Issues</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <CSwitch type="PULL_REQUESTS" />
                        <Label htmlFor="PULL_REQUESTS">Pull Requests</Label>
                      </div>
                    </div>

                    {/* <div className="pt-4 space-x-2">
                      {form.watch("scopes")?.map((scope) => (
                        <Badge variant={"outline"}>{scope}</Badge>
                      ))}
                    </div> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  );
}
