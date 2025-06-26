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
import { ExplorerItem } from "src/shared/types";

type SlideContextMenu = PropsWithChildren<{
  onDelete: () => void;
  onOpen?: () => void;
  file?: ExplorerItem;
}>;

export default function SlideContextMenu({ children, file, onDelete, onOpen }: SlideContextMenu) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="w-32">
          {file && (
            <div className="p-2">
              <div className="text-xs">
                <span className="break-all">{file.name}</span>
                <span className="whitespace-nowrap">.{file.ext}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          )}
          <ContextMenuItem onClick={onOpen} disabled={!onOpen}>
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
            <AlertDialogDescription>슬라이드를 삭제합니다.</AlertDialogDescription>
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
