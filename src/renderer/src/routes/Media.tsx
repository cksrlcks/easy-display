import "react-photo-view/dist/react-photo-view.css";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@renderer/components/ui/alert-dialog";
import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@renderer/components/ui/context-menu";
import { cn, isImageFile } from "@renderer/lib/utils";
import { File, FolderOpen, HardDriveUpload } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { toast } from "sonner";
import { InternalFile } from "src/types";

export default function Media() {
  const [isPending, startTransition] = useTransition();
  const [medias, setMedias] = useState<InternalFile[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    startTransition(async () => {
      const response = await window.api.getFilesInMediaFolder();
      console.log(response.success);
      if (response.success) {
        setMedias(response.data);
      } else {
        toast.error("Failed to fetch media files");
      }
    });
  };

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
    const response = await window.api.deleteFile(filePath);

    if (response.success) {
      fetchMediaFiles();
    } else {
      toast.error("Failed to delete file");
    }
  };

  return (
    <>
      <PhotoProvider>
        <div className="space-y-4 flex flex-col h-full">
          <div className="flex gap-1">
            <Button size="sm" variant="outline" className="text-xs" onClick={handleOpenMediaFolder}>
              <FolderOpen />
              폴더열기
            </Button>
            <Button size="sm" variant="outline" className="text-xs" onClick={handleImportFiles}>
              <HardDriveUpload />
              미디어 업로드
            </Button>
          </div>
          <div
            className={cn(
              "bg-black/10 p-10 rounded-lg relative h-full overflow-y-auto",
              isPending && "opacity-50",
            )}
          >
            <ul className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {medias.map((media) => (
                <li key={media.path} className="hover:opacity-80 transition-opacity cursor-pointer">
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <figure className="aspect-square bg-black/20 rounded-sm overflow-hidden relative mb-2 flex items-center justify-center">
                        <PhotoView
                          {...(isImageFile(media.ext)
                            ? { src: `media://${encodeURI(`${media.name}.${media.ext}`)}` }
                            : {
                                render: () => (
                                  <div className="relative w-0 h-0">
                                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                                      이미지 형식만 미리볼수 있습니다.
                                    </span>
                                  </div>
                                ),
                              })}
                        >
                          {isImageFile(media.ext) ? (
                            <img
                              src={`media://${encodeURI(`${media.name}.${media.ext}`)}`}
                              alt={media.name}
                              className="object-contain w-full h-full"
                            />
                          ) : (
                            <File />
                          )}
                        </PhotoView>
                        <Badge className="absolute bottom-2 left-2 uppercase text-xs">
                          {media.ext}
                        </Badge>
                      </figure>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-32">
                      <div className="p-2">
                        <div className="text-xs">
                          <span className="break-all">{media.name}</span>
                          <span className="whitespace-nowrap">.{media.ext}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {(media.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        onClick={() => setDeleteTarget(`${media.name}.${media.ext}`)}
                      >
                        삭제
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>

                  <div className="text-xs flex items-center justify-between gap-2 whitespace-nowrap">
                    <span className="text-ellipsis overflow-hidden">{media.name}</span>
                    <span className="opacity-30">{(media.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PhotoProvider>

      <AlertDialog open={deleteTarget !== null} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              미디어 폴더에서 파일을 삭제합니다. 삭제된 파일은 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) {
                  handleDeleteFile(deleteTarget);
                }
              }}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
