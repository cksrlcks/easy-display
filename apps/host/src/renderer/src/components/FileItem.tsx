import FileIcon from "@renderer/assets/img/icon-file.svg";
import FolderIcon from "@renderer/assets/img/icon-folder.svg";
import VideoIcon from "@renderer/assets/img/icon-video.svg";
import { cn, isImageFile, isVideoFile } from "@renderer/lib/utils";
import { Unplug } from "lucide-react";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { ExplorerItem } from "src/shared/types";

import ScreenFrame from "./ScreenFrame";

const EXT_BADGE_COLORS: Record<string, string> = {
  jpg: "bg-rose-500",
  jpeg: "bg-rose-500",
  png: "bg-emerald-500",
  gif: "bg-yellow-500",
  webp: "bg-blue-500",
  mp4: "bg-purple-500",
  mkv: "bg-purple-600",
  avi: "bg-purple-700",
  mov: "bg-purple-800",
  webm: "bg-purple-900",
};

type FileItemProps = HTMLAttributes<HTMLDivElement> & {
  file: ExplorerItem | null;
  showInfo?: boolean;
  rotate?: number;
  mode?: "screen" | "file";
};

export default function FileItem({
  file,
  showInfo = false,
  mode = "file",
  rotate = 0,
  ...props
}: FileItemProps) {
  const ext = file && file.ext ? file.ext.toLowerCase() : "unknown";

  const render = () => {
    if (!file) {
      return <Unplug className="opacity-25" />;
    }

    if (file.isDirectory) {
      return <img src={FolderIcon} alt="folder" className="w-12 h-auto" />;
    }

    if (isImageFile(ext)) {
      return (
        <ResponsiveImageContainer
          src={`media://${encodeURI(`${file.path}`)}`}
          alt={file.name}
          rotate={rotate}
        />
      );
    }

    if (isVideoFile(ext)) {
      return <img src={VideoIcon} alt="video" className="w-12 h-auto" />;
    }

    return <img src={FileIcon} alt="file" className="w-12 h-auto" />;
  };

  return (
    <div className="space-y-3" {...props}>
      <ScreenFrame
        className={cn(
          "w-full bg-black/30 relative",
          mode === "screen" ? "aspect-video" : "aspect-square",
        )}
      >
        {render()}
      </ScreenFrame>
      {showInfo && (
        <div className="text-xs flex items-center gap-2 whitespace-nowrap">
          {!file ? (
            <div>삭제된 파일입니다.</div>
          ) : (
            <>
              {!file.isDirectory ? (
                <>
                  <span
                    className={cn(
                      EXT_BADGE_COLORS[ext] || "bg-gray-500",
                      "text-[10px] uppercase text-foreground rounded-xs leading-1 flex items-center justify-center px-1.5 py-1.5",
                    )}
                  >
                    {ext.slice(0, 4)}
                  </span>

                  <span className="text-ellipsis overflow-hidden flex-1">{file.name}</span>
                  <span className="opacity-30">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </>
              ) : (
                <span className="text-ellipsis overflow-hidden flex-1">{file.name}</span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

type ResponsiveImageContainerProps = {
  rotate: number;
  src: string;
  alt: string;
};

function ResponsiveImageContainer({ rotate, src, alt }: ResponsiveImageContainerProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current?.parentElement) {
        const parent = containerRef.current.parentElement;
        setSize({
          width: parent.offsetWidth,
          height: parent.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const isLandscape = rotate % 180 === 0;

  const imgWidth = isLandscape ? size.width : size.height;
  const imgHeight = isLandscape ? size.height : size.width;

  let transform = `rotate(${rotate}deg)`;
  if (rotate === -90) transform += " translateX(-100%)";
  else if (rotate === -180) transform += " translate(-100%, -100%)";
  else if (rotate === -270) transform += " translateY(-100%)";

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        width: size.width,
        height: size.height,
      }}
    >
      <img
        src={src}
        alt={alt}
        className="absolute top-0 left-0 object-contain"
        style={{
          transform,
          transformOrigin: "top left",
          width: `${imgWidth}px`,
          height: `${imgHeight}px`,
        }}
      />
    </div>
  );
}
