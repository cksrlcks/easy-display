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
import { ExplorerItem } from "@shared/types";
import { PropsWithChildren, useState } from "react";

type FileContextMenuProps = PropsWithChildren<{
  file: ExplorerItem;
  onDelete: () => void;
  onOpen: () => void;
}>;

export default function FileContextMenu({
  children,
  file,
  onDelete,
  onOpen,
}: FileContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-32">
          <div className="p-2">
            <div className="text-xs">
              <span className="break-all">{file.name}</span>
              <span className="whitespace-nowrap">.{file.ext}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
          <ContextMenuItem onClick={onOpen}>
            <span className="text-xs">열기</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => setIsOpen(true)}>삭제</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              미디어 폴더에서 파일을 삭제합니다. 삭제된 파일은 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
