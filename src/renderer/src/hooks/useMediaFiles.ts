import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

export function useMediaFiles() {
  return useQuery({
    queryKey: ["mediaFiles"],
    queryFn: async () => {
      const response = await window.api.getFilesInMediaFolder();

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    },
  });
}

export function useMediaActions() {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const onOpenMediaFolder = async () => {
    const response = await window.api.openMediaFolder();

    if (!response.success) {
      toast.error(response.message);
    }
  };

  const onImportFiles = () => {
    startTransition(async () => {
      const response = await window.api.selectFiles();

      if (response.success) {
        const filePaths = response.data;
        if (!filePaths || filePaths.length === 0) return;

        await window.api.copyToMediaFolder(filePaths);
        queryClient.invalidateQueries({ queryKey: ["mediaFiles"] });
      } else {
        toast.error(response.message);
      }
    });
  };

  const onDeleteFile = async (filePath: string) => {
    startTransition(async () => {
      const response = await window.api.deleteFile(filePath);

      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["mediaFiles"] });
      } else {
        toast.error(response.message);
      }
    });
  };

  const onOpenFile = async (filePath: string) => {
    const response = await window.api.openFile(filePath);

    if (!response.success) {
      toast.error(response.message);
    }
  };

  return {
    isPending,
    onOpenMediaFolder,
    onImportFiles,
    onDeleteFile,
    onOpenFile,
  };
}
