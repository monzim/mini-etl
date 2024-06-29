import getAccesstoken from "@/lib/user_access_token";
import NewDataSourceForm from "./_components/NewDataSourceForm";

export default function Page() {
  let accessToken = getAccesstoken();
  return (
    <>
      <NewDataSourceForm accessToken={accessToken} />
    </>
  );
}
