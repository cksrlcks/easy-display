import "react-photo-view/dist/react-photo-view.css";

import { FileInfo, FileThumbnail } from "@renderer/components/File";
import FileContextMenu from "@renderer/components/FileContextMenu";
import PhotoView from "@renderer/components/PhotoView";
import { Button } from "@renderer/components/ui/button";
import useFetchMediaFiles from "@renderer/hooks/useFetchMediaFiles";
import { cn } from "@renderer/lib/utils";
import { FolderOpen, FolderSync, HardDriveUpload } from "lucide-react";
import { useTransition } from "react";
import { PhotoProvider } from "react-photo-view";
import { toast } from "sonner";

export default function Media() {
  const { isPending: isFetchingMedias, medias, fetchMediaFiles } = useFetchMediaFiles();
  const [isPending, startTransition] = useTransition();

  const isDisabled = isFetchingMedias || isPending;

  const handleOpenMediaFolder = async () => {
    const response = await window.api.openMediaFolder();

    if (!response.success) {
      toast.error("Failed to open media folder");
    }
  };

  const handleImportFiles = () => {
    startTransition(async () => {
      const response = await window.api.selectFiles();

      if (response.success) {
        const filePaths = response.data;
        if (!filePaths || filePaths.length === 0) return;

        await window.api.copyToMediaFolder(filePaths);

        fetchMediaFiles();
      } else {
        toast.error("Failed to select files");
      }
    });
  };

  const handleDeleteFile = async (filePath: string) => {
    startTransition(async () => {
      const response = await window.api.deleteFile(filePath);

      if (response.success) {
        toast.success("파일이 삭제되었습니다.");
        fetchMediaFiles();
      } else {
        toast.error("파일 삭제에 실패했습니다.");
      }
    });
  };

  const handlePhotoViewIndexChange = () => {
    document.querySelectorAll("video").forEach((video) => {
      if (video instanceof HTMLVideoElement) {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  return (
    <>
      <div className="space-y-4 flex flex-col h-full">
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={handleOpenMediaFolder}
            disabled={isDisabled}
          >
            <FolderOpen />
            폴더열기
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={handleImportFiles}
            disabled={isDisabled}
          >
            <HardDriveUpload />
            미디어 업로드
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="ml-auto"
            title="폴더 새로고침"
            onClick={fetchMediaFiles}
            disabled={isDisabled}
          >
            <FolderSync />
          </Button>
        </div>
        <div
          className={cn(
            "bg-black/10 p-10 rounded-lg relative h-full overflow-y-auto",
            isDisabled && "opacity-50 pointer-events-none",
          )}
        >
          <PhotoProvider onIndexChange={handlePhotoViewIndexChange}>
            <ul className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {medias.map((media) => (
                <li key={media.path} className="hover:opacity-80 transition-opacity cursor-pointer">
                  <FileContextMenu media={media} onDelete={handleDeleteFile}>
                    <PhotoView media={media}>
                      <FileThumbnail media={media} />
                    </PhotoView>
                  </FileContextMenu>
                  <FileInfo media={media} />
                </li>
              ))}
            </ul>
          </PhotoProvider>
        </div>
      </div>
    </>
  );
}
