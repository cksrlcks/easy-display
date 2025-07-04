import { useExplorer } from "@renderer/hooks/useExplorer";
import useHistory from "@renderer/hooks/useHistory";
import { isImageFile, isVideoFile } from "@renderer/lib/utils";
import { ExplorerItem } from "@shared/types";
import { ArrowLeft, ArrowRight, FileCheck2, Folder } from "lucide-react";
import { ChangeEvent, PropsWithChildren, useState } from "react";

import FileItem from "./FileItem";
import ScrollableListArea from "./ScrollableListArea";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

type MediaDrawerProps = PropsWithChildren<{
  onSelect: (files: ExplorerItem[]) => void;
}>;

export default function MediaDrawer({ onSelect, children }: MediaDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { history, goBack, goForward, openFolder, currentFolderPath } = useHistory();
  const { data, openFile, isPending, currentFolderName } = useExplorer(currentFolderPath);
  const [selectedFiles, setSelectedFiles] = useState<ExplorerItem[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const filePath = e.target.getAttribute("data-file-path");
    if (!filePath) return;

    const file = data?.find((item) => item.path === filePath);
    if (!file) return;

    if (e.target.checked) {
      setSelectedFiles((prev) => [...prev, file]);
    } else {
      setSelectedFiles((prev) => prev.filter((item) => item.path !== filePath));
    }
  };

  const handleSubmit = () => {
    if (selectedFiles.length) {
      onSelect(selectedFiles);
    }
    setIsOpen(false);
  };

  const handleClose = (open: boolean) => {
    setSelectedFiles([]);
    setIsOpen(open);
  };

  const canSelect = (ext: string | undefined) => {
    return ext ? isImageFile(ext) || isVideoFile(ext) : false;
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetTrigger asChild onClick={(e) => e.currentTarget.blur()}>
        {children}
      </SheetTrigger>
      <SheetContent className="bg-[#222] gap-0" style={{ maxWidth: "600px" }}>
        <SheetHeader>
          <SheetTitle>미디어 추가</SheetTitle>
          <SheetDescription>추가하실 미디어를 선택해주세요.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-hidden p-4 space-y-4 flex flex-col">
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
            <div>
              <Button variant="outline" size="sm" onClick={handleSubmit}>
                <FileCheck2 />
                선택 추가
              </Button>
            </div>
          </header>
          <ScrollableListArea className="flex-1 p-6">
            <div className="grid grid-cols-2 gap-4">
              {data?.map((item) => {
                if (item.isDirectory) {
                  return (
                    <div
                      key={item.path}
                      className="border p-4 cursor-pointer"
                      onDoubleClick={() => {
                        openFolder(item.path);
                        setSelectedFiles([]);
                      }}
                    >
                      <FileItem file={item} showInfo />
                    </div>
                  );
                }

                if (!canSelect(item.ext)) {
                  return (
                    <div
                      key={item.path}
                      className="border p-4 cursor-not-allowed opacity-50 rounded-md"
                    >
                      <FileItem file={item} showInfo />
                    </div>
                  );
                }

                return (
                  <label key={item.path} className="relative cursor-pointer">
                    <input
                      type="checkbox"
                      className="peer absolute left-2 top-2"
                      onChange={handleChange}
                      data-file-path={item.path}
                    />
                    <div
                      className="border peer-checked:border-amber-200 p-4 rounded-md"
                      onDoubleClick={() => openFile(item.path)}
                    >
                      <FileItem file={item} showInfo />
                    </div>
                  </label>
                );
              })}
            </div>
          </ScrollableListArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
