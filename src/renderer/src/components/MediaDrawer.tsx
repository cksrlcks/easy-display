import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@renderer/components/ui/drawer";
import { useMediaActions, useMediaFiles } from "@renderer/hooks/useMediaFiles";
import { InternalFile } from "@shared/types";
import { ChangeEvent, PropsWithChildren, useState } from "react";

import { FileThumbnail } from "./File";
import { Button } from "./ui/button";

type MediaDrawerProps = PropsWithChildren<{
  onSelect: (files: InternalFile[]) => void;
}>;

export default function MediaDrawer({ onSelect, children }: MediaDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useMediaFiles();
  const { onOpenFile } = useMediaActions();
  const [selectedFiles, setSelectedFiles] = useState<InternalFile[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileBase = e.target.getAttribute("data-file-base");
    if (!fileBase) return;

    const file = data?.find((item) => item.base === fileBase);
    if (!file) return;

    if (e.target.checked) {
      setSelectedFiles((prev) => [...prev, file]);
    } else {
      setSelectedFiles((prev) => prev.filter((item) => item.base !== fileBase));
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

  return (
    <Drawer direction="left" open={isOpen} onOpenChange={handleClose}>
      <DrawerTrigger asChild onClick={(e) => e.currentTarget.blur()}>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>미디어 추가</DrawerTitle>
          <DrawerDescription>추가하실 미디어를 선택해주세요.</DrawerDescription>
        </DrawerHeader>
        <div className="grid grid-cols-2 gap-4 p-8">
          {data?.map((item) => (
            <label key={item.path} className="relative cursor-pointer">
              <input
                type="checkbox"
                className="peer absolute left-2 top-2"
                onChange={handleChange}
                data-file-base={item.base}
              />
              <div
                className="border peer-checked:border-amber-200"
                onDoubleClick={() => onOpenFile(item.base)}
              >
                <FileThumbnail media={item} />
              </div>
            </label>
          ))}
        </div>
        <DrawerFooter>
          <Button variant="outline" onClick={handleSubmit}>
            선택 추가
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
