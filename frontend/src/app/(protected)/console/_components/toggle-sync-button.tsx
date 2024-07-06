"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ApiConfig } from "@/lib/api.config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  accessToken: string | null;
  connectionId: string;
  status: boolean;
}

export default function ToggleSyncButton({
  connectionId,
  status,
  accessToken,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleSync() {
    try {
      setLoading(true);
      const res = await axios({
        method: "post",
        url: `${ApiConfig.BASE}/sources/${connectionId}/toggle`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.status === 200) {
        router.refresh();
        return toast.success(
          status
            ? "Sync has been turned off successfully."
            : "Sync has been turned on successfully."
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          return toast.error(error.response.data.message);
        }
      }
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex items-center space-x-2">
      <Switch
        disabled={loading}
        id="toggle"
        checked={status}
        onCheckedChange={toggleSync}
      />
      <Label htmlFor="toggle">{status ? "Sync On" : "Sync Off"}</Label>
    </div>
  );
}
