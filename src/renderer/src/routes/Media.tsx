import "react-photo-view/dist/react-photo-view.css";

import { FileInfo, FileThumbnail } from "@renderer/components/File";
import FileContextMenu from "@renderer/components/FileContextMenu";
import { Button } from "@renderer/components/ui/button";
import { useMediaActions, useMediaFiles } from "@renderer/hooks/useMediaFiles";
import { cn } from "@renderer/lib/utils";
import { FolderOpen, FolderSync, HardDriveUpload } from "lucide-react";
export default function Media() {
  const { data: medias, isPending: isFetchingMedias, refetch } = useMediaFiles();
  const { isPending, onOpenMediaFolder, onImportFiles, onDeleteFile, onOpenFile } =
    useMediaActions();
  const isDisabled = isFetchingMedias || isPending;

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
          <ul className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {medias?.map((media) => (
              <li key={media.path} className="hover:opacity-80 transition-opacity cursor-pointer">
                <FileContextMenu
                  media={media}
                  onDelete={() => onDeleteFile(media.base)}
                  onOpen={() => onOpenFile(media.base)}
                >
                  <div onDoubleClick={() => onOpenFile(media.base)} className="mb-2">
                    <FileThumbnail media={media} />
                  </div>
                </FileContextMenu>
                <FileInfo media={media} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
