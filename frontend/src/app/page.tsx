import {
  BotIcon,
  DatabaseIcon,
  GithubIcon,
  MonitorIcon,
  ScalingIcon,
  SirenIcon,
} from "@/components/Icons";
import GithubSignInButton from "./_components/SingInButton";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className=" py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold capitalize">
                  Sync data from anywhere to your database
                </h1>
                <p className="text-lg md:text-xl">
                  Mini-ETL is a scalable system that automatically syncs data
                  from third-party solutions to your Postgres database and S3
                  storage.
                </p>
                <GithubSignInButton />
              </div>
              <div className="hidden md:block">
                <img
                  src="https://picsum.photos/200"
                  width="600"
                  height="400"
                  alt="Hero"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-primary">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Sync your data with confidence
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Mini-ETL automatically syncs your data from GitHub to your
                  Postgres database and S3 storage, ensuring your data is always
                  up-to-date and secure.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <img
                src="/placeholder.svg"
                width="550"
                height="310"
                alt="Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Sync GitHub Data</h3>
                      <p className="text-muted-foreground">
                        Automatically sync your public repositories, issues, and
                        pull requests to your destination.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Secure Storage</h3>
                      <p className="text-muted-foreground">
                        Store your data securely in Postgres and S3 for easy
                        access and backup.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        GitHub Authentication
                      </h3>
                      <p className="text-muted-foreground">
                        Sign in with your GitHub account and configure your sync
                        destinations.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="integrations" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Supported Integrations
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Mini-ETL seamlessly integrates with GitHub, Postgres, and S3 to
                ensure your data is always in sync.
              </p>
            </div>
          </div>
          <div className="container px-4 md:px-6 mt-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                <GithubIcon className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">Sync GitHub Data</h3>
                <p className="text-muted-foreground">
                  Automatically sync your public repositories, issues, and pull
                  requests to your database.
                </p>
              </div>
              <div className="space-y-2">
                <DatabaseIcon className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">Postgres Support</h3>
                <p className="text-muted-foreground">
                  Seamlessly integrate your data with your Postgres database.
                </p>
              </div>
              <div className="space-y-2">
                <SirenIcon className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">S3 Integration</h3>
                <p className="text-muted-foreground">
                  Store your data securely in Amazon S3 for long-term archiving.
                </p>
              </div>
              <div className="space-y-2">
                <ScalingIcon className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">Scalable Architecture</h3>
                <p className="text-muted-foreground">
                  Easily scale your data syncing as your business grows.
                </p>
              </div>
              <div className="space-y-2">
                <BotIcon className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">Automated Syncing</h3>
                <p className="text-muted-foreground">
                  Set it and forget it - Mini-ETL will keep your data
                  up-to-date.
                </p>
              </div>
              <div className="space-y-2">
                <MonitorIcon className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">Real-time Monitoring</h3>
                <p className="text-muted-foreground">
                  Track the status of your data syncs and get alerts on issues.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="sources" className="bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Supported Data Sources
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl">
                Mini-ETL can sync data from a variety of popular third-party
                solutions.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-8">
              <div className="flex items-center justify-center p-4 border rounded-lg">
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg"
                  width="140"
                  height="70"
                  alt="Postgres"
                  className="aspect-[2/1] object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="destinations" className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Supported Data Destinations
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl">
                Mini-ETL can sync your data to a variety of destinations.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-8">
              <div className="flex items-center justify-center p-4 bg-background rounded-lg">
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg"
                  width="140"
                  height="70"
                  alt="Postgres"
                  className="aspect-[2/1] object-contain"
                />
              </div>
              <div className="flex items-center justify-center p-4 bg-background rounded-lg">
                <img
                  src="https://icon.icepanel.io/AWS/svg/Storage/S3-on-Outposts.svg"
                  width="140"
                  height="70"
                  alt="Amazon S3"
                  className="aspect-[2/1] object-contain"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
