"use client";

import { Button } from "@/components/ui/button";
import { ApiConfig } from "@/lib/api.config";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  accessToken: string | null;
}
export default function SyncNowButton(props: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      await axios({
        method: "GET",
        url: `${ApiConfig.BASE}/sources/sync`,
        headers: {
          Authorization: `Bearer ${props.accessToken}`,
        },
      });

      return toast.success(
        "We received your request and will sync your data shortly."
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        return toast.error(message ?? error.message);
      }

      return toast.error(
        "An error occurred while syncing data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button disabled={loading} size={"lg"} onClick={handleClick}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Sync Now
    </Button>
  );
}
