import { DatabaseIcon } from "@/components/Icons";
import { CodeIcon, LockIcon, ServerIcon } from "lucide-react";

export default function Page() {
  return (
    <>
      <section className="w-full my-10">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Tech Stack
          </h2>
          <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            I use the latest technologies to build Mini-ETL. Here&apos;s a
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                <CodeIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Frontend</h3>
                <p className="text-muted-foreground">Next.js</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                <ServerIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Backend</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>NestJS (Node.js)</li>
                  <li>REST API</li>
                  <li>Microservices</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                <DatabaseIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Database</h3>
                <p className="text-muted-foreground">PostgreSQL</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                <LockIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Authentication</h3>
                <ul className="text-muted-foreground space-y-1">
                  <li>GitHub OAuth</li>
                  <li>JWT</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                <DatabaseIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Queue</h3>
                <p className="text-muted-foreground">RabbitMQ</p>
              </div>
            </div>
          </div>
        </div>

        <section>
          <div className="space-y-2 text-center mt-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Stack Overview
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Here&apos;s an overview of the Mini-ETL stack.
            </p>
          </div>

          <div className="flex justify-center mt-8">
            <img
              src="https://github.com/monzim/public-assets/blob/main/mini-etl/stack-overview.png?raw=true"
              alt="Stack Overview"
              className="max-w-5xl w-full bg-black rounded-md shadow-xl"
            />
          </div>
        </section>

        <section>
          <div className="space-y-2 text-center mt-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              App Workflow
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Here&apos;s how Mini-ETL works.
            </p>
          </div>
          <div className="flex justify-center mt-8">
            <img
              className="max-w-5xl w-full bg-black rounded-md shadow-xl"
              src="https://github.com/monzim/public-assets/blob/main/mini-etl/app-workflow.png?raw=true"
            />
          </div>
        </section>
      </section>
    </>
  );
}
