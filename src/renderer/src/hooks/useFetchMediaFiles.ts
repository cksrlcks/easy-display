import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { InternalFile } from "src/types";

export default function useFetchMediaFiles() {
  const [isPending, startTransition] = useTransition();
  const [medias, setMedias] = useState<InternalFile[]>([]);

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    startTransition(async () => {
      const response = await window.api.getFilesInMediaFolder();

      if (response.success) {
        setMedias(response.data);
      } else {
        toast.error("Failed to fetch media files");
      }
    });
  };

  return {
    isPending,
    medias,
    fetchMediaFiles,
  };
}
