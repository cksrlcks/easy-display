import FileContextMenu from "@renderer/components/FileContextMenu";
import FileItem from "@renderer/components/FileItem";
import ScrollableListArea from "@renderer/components/ScrollableListArea";
import { Button } from "@renderer/components/ui/button";
import { useExplorer } from "@renderer/hooks/useExplorer";
import useHistory from "@renderer/hooks/useHistory";
import { isImageFile, isVideoFile } from "@renderer/lib/utils";
import { ExplorerItem } from "@shared/types";
import {
  ArrowLeft,
  ArrowRight,
  Folder,
  FolderOpen,
  FolderSync,
  HardDriveUpload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import "react-photo-view/dist/react-photo-view.css";
import { toast } from "sonner";

export default function Media() {
  const { history, goBack, goForward, openFolder, currentFolderPath } = useHistory();
  const {
    data: files,
    currentFolderName,
    isPending,
    getFiles,
    openFile,
    deleteFile,
    selectFiles,
  } = useExplorer(currentFolderPath);

  const handleOpenFile = (file: ExplorerItem) => {
    const canOpen = file.ext && (isImageFile(file.ext) || isVideoFile(file.ext));

    if (!canOpen) {
      toast.error("열수 없는 파일입니다.");
      return;
    }

    openFile(file.path);
  };

  const handleDoubleClickFile = (file: ExplorerItem) => {
    if (file.isDirectory) {
      openFolder(file.path);
    } else {
      handleOpenFile(file);
    }
  };

  return (
    <>
      <div className="space-y-4 flex flex-col h-full">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={
                  isPending ||
                  history.back.length === 0 ||
                  currentFolderPath === history.back[history.back.length - 1]
                }
                onClick={goBack}
              >
                <ArrowLeft />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={
                  isPending ||
                  history.forward.length === 0 ||
                  currentFolderPath === history.forward[history.forward.length - 1]
                }
                onClick={goForward}
              >
                <ArrowRight />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Folder size={14} />
              {currentFolderName}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => openFile(currentFolderPath)}
              disabled={isPending}
            >
              <FolderOpen />
              폴더열기
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={selectFiles}
              disabled={isPending}
            >
              <HardDriveUpload />
              미디어 업로드
            </Button>

            <Button
              size="sm"
              variant="outline"
              title="폴더 새로고침"
              className="text-xs"
              onClick={() => getFiles(currentFolderPath)}
              disabled={isPending}
            >
              <FolderSync />
              새로고침
            </Button>
          </div>
        </header>
        <ScrollableListArea>
          {files.length === 0 && (
            <div className="text-md opacity-35 text-center w-full h-full flex items-center justify-center">
              파일이 없습니다.
            </div>
          )}
          <AnimatePresence>
            <ul className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
              {files?.map((file) => (
                <motion.li
                  layout
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{ opacity: 0 }}
                  key={file.name}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <FileContextMenu
                    file={file}
                    onDelete={() => deleteFile(file.path)}
                    onOpen={() => handleOpenFile(file)}
                  >
                    <FileItem
                      file={file}
                      showInfo={true}
                      onDoubleClick={() => handleDoubleClickFile(file)}
                    />
                  </FileContextMenu>
                </motion.li>
              ))}
            </ul>
          </AnimatePresence>
        </ScrollableListArea>
      </div>
    </>
  );
}
