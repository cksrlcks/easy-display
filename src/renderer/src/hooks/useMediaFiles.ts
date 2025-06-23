import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";

export function useMediaFiles() {
  return useQuery({
    queryKey: ["mediaFiles"],
    queryFn: async () => {
      const response = await window.api.getFilesInMediaFolder();

      if (!response.success) {
        throw new Error(response.error);
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
      toast.error("Failed to open media folder");
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
        toast.error("Failed to select files");
      }
    });
  };

  const onDeleteFile = async (filePath: string) => {
    startTransition(async () => {
      const response = await window.api.deleteFile(filePath);

      if (response.success) {
        toast.success("파일이 삭제되었습니다.");
        queryClient.invalidateQueries({ queryKey: ["mediaFiles"] });
      } else {
        toast.error("파일 삭제에 실패했습니다.");
      }
    });
  };

  return {
    isPending,
    onOpenMediaFolder,
    onImportFiles,
    onDeleteFile,
  };
}
