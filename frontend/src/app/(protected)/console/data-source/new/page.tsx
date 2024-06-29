"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const formSchema = z
  .object({
    type: z.enum(["s3", "postgres"]),
    name: z.string().min(1),
    pgUri: z.string().url().optional(),
    s3Bucket: z.string().optional(),
    s3Region: z.string().optional(),
    s3Key: z.string().optional(),
    s3Secret: z.string().optional(),
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
export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="p-10 max-w-4xl mx-auto flex justify-center min-w-3xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold">
              <Link href="/console/data-source">Data sources</Link> / New
            </h2>
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

          <Button size={"lg"} type="submit" className="w-full">
            Create data source
          </Button>
        </form>
      </Form>
    </div>
  );
}
