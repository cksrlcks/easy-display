import { ExplorerItem } from "@shared/types";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export const useExplorer = (folderPath: string = "/", baseFolderName = "Media") => {
  const [files, setFiles] = useState<ExplorerItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const currentFolderName = folderPath.split("/").filter(Boolean).pop() || baseFolderName;

  useEffect(() => {
    getFiles(folderPath);
  }, [folderPath]);

  const getFiles = async (folderPath: string) => {
    startTransition(async () => {
      const response = await window.api.explorerList(folderPath);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      setFiles(response.data || []);
    });
  };

  const openFile = async (filePath: string) => {
    startTransition(async () => {
      const response = await window.api.explorerOpen(filePath);

      if (!response.success) {
        toast.error(response.message);
      }
    });
  };

  const deleteFile = async (filePath: string) => {
    startTransition(async () => {
      const response = await window.api.explorerDelete(filePath);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      getFiles(folderPath);
    });
  };

  const selectFiles = async () => {
    startTransition(async () => {
      const response = await window.api.explorerSelect();

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      const filePaths = response.data;
      if (!filePaths || filePaths.length === 0) return;

      const copiedFiles = await window.api.explorerCopy(filePaths);

      if (!copiedFiles.success) {
        toast.error(copiedFiles.message);
        return;
      }

      getFiles(folderPath);
    });
  };

  return {
    isPending,
    data: files,
    currentFolderName,
    getFiles,
    openFile,
    deleteFile,
    selectFiles,
  };
};
