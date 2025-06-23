import "react-photo-view/dist/react-photo-view.css";

import { FileInfo, FileThumbnail } from "@renderer/components/File";
import FileContextMenu from "@renderer/components/FileContextMenu";
import PhotoView from "@renderer/components/PhotoView";
import { Button } from "@renderer/components/ui/button";
import { useMediaActions, useMediaFiles } from "@renderer/hooks/useMediaFiles";
import { cn } from "@renderer/lib/utils";
import { FolderOpen, FolderSync, HardDriveUpload } from "lucide-react";
import { PhotoProvider } from "react-photo-view";

export default function Media() {
  const { data: medias, isPending: isFetchingMedias, refetch } = useMediaFiles();
  const { isPending, onOpenMediaFolder, onImportFiles, onDeleteFile } = useMediaActions();
  const isDisabled = isFetchingMedias || isPending;

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
            onClick={onOpenMediaFolder}
            disabled={isDisabled}
          >
            <FolderOpen />
            폴더열기
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={onImportFiles}
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
            onClick={() => refetch()}
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
              {medias?.map((media) => (
                <li key={media.path} className="hover:opacity-80 transition-opacity cursor-pointer">
                  <FileContextMenu media={media} onDelete={onDeleteFile}>
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
