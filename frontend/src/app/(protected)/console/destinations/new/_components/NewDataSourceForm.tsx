"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiConfig } from "@/lib/api.config";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, Slash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    type: z.enum(["s3", "postgres"]),
    name: z.string().min(3).max(50),
    pgUri: z.string().url().optional(),
    s3Bucket: z.string().optional(),
    s3Region: z.string().optional(),
    s3Key: z.string().optional(),
    s3Secret: z.string().optional(),
    s3Endpoint: z.string().url().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "postgres") {
      if (data.pgUri === undefined || data.pgUri === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Postgres URI is required",
          path: ["pgUri"],
        });
      }
    }

    if (data.type === "s3") {
      if (data.s3Bucket === undefined || data.s3Bucket === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "S3 Bucket is required",
          path: ["s3Bucket"],
        });
      }

      if (data.s3Region === undefined || data.s3Region === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "S3 Region is required",
          path: ["s3Region"],
        });
      }

      if (data.s3Key === undefined || data.s3Key === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "S3 Key is required",
          path: ["s3Key"],
        });
      }

      if (data.s3Secret === undefined || data.s3Secret === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "S3 Secret is required",
          path: ["s3Secret"],
        });
      }
    }
  });

interface Props {
  accessToken: string | null;
}

export default function NewDataSourceForm(props: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const res = await axios({
        method: "post",
        url: `${ApiConfig.BASE}/sources`,
        headers: {
          Authorization: `Bearer ${props.accessToken}`,
        },
        data: {
          type: values.type,
          name: values.name ?? "",
          pgUri: values.pgUri ?? "",
          s3Bucket: values.s3Bucket ?? "",
          s3Region: values.s3Region ?? "",
          s3Key: values.s3Key ?? "",
          s3Secret: values.s3Secret ?? "",
          s3Endpoint: values.s3Endpoint ?? "",
        },
      });

      if (res.status === 201) {
        toast.success(
          "Data destination created successfully. Backend will validate connection then you can use it. Redirecting to data source page..."
        );

        return router.push("/console/destinations");
      }
    } catch (error) {
      toast.error("Failed to create data source. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-10 max-w-4xl mx-auto flex justify-center min-w-3xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold">New Destination</h2>
            <Breadcrumb className="mt-2 mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/console">Console</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/console/destinations">
                    Destinations
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>New</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <p>
              Create a new data source. You can use this data source to create
              new datasets. You data source can be S3 or Postgres.
            </p>
          </section>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter data source name" {...field} />
                </FormControl>
                <FormDescription>
                  You set the name of the data source. Just for your reference.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Data source type{" "}
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
                      <SelectValue placeholder="Select data source type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="s3">S3</SelectItem>
                    <SelectItem value="postgres">Postgres</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  You set the type of the data source. This can't be changed
                  later.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("type") === "postgres" && (
            <FormField
              control={form.control}
              name="pgUri"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postgres URI</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter postgres URI" {...field} />
                  </FormControl>
                  <FormDescription>
                    You set the postgres URI of the data source.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {form.watch("type") === "s3" && (
            <>
              <FormField
                control={form.control}
                name="s3Endpoint"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>S3 Endpoint</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter s3 endpoint" {...field} />
                    </FormControl>
                    <FormDescription>
                      You set the s3 endpoint of the data source.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="gap-4 flex items-start">
                <FormField
                  control={form.control}
                  name="s3Bucket"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>S3 Bucket</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter s3 bucket" {...field} />
                      </FormControl>
                      <FormDescription>
                        You set the s3 bucket of the data source.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="s3Region"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>S3 Region</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter s3 region" {...field} />
                      </FormControl>
                      <FormDescription>
                        You set the s3 region of the data source.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="gap-4 flex items-start">
                <FormField
                  control={form.control}
                  name="s3Key"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>S3 Key</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter s3 key" {...field} />
                      </FormControl>
                      <FormDescription>
                        You set the s3 key of the data source.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="s3Secret"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>S3 Secret</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter s3 secret" {...field} />
                      </FormControl>
                      <FormDescription>
                        You set the s3 secret of the data source.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}

          <Button
            disabled={loading}
            size={"lg"}
            type="submit"
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create data source
          </Button>
        </form>
      </Form>
    </div>
  );
}
