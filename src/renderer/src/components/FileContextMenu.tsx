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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@renderer/components/ui/context-menu";
import { PropsWithChildren, useState } from "react";
import { InternalFile } from "src/shared/types";

type FileContextMenuProps = PropsWithChildren<{
  media: InternalFile;
  onDelete: (fileName: string) => void;
  onOpen: (filePath: string) => void;
}>;

export default function FileContextMenu({
  children,
  media,
  onDelete,
  onOpen,
}: FileContextMenuProps) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
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
          <ContextMenuItem onClick={() => onOpen(media.base)}>
            <span className="text-xs">열기</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => setDeleteTarget(media.base)}>삭제</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

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
                  onDelete(deleteTarget);
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
