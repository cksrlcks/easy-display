import { isImageFile, isVideoFile } from "@renderer/lib/utils";
import { Clapperboard, File } from "lucide-react";
import { InternalFile } from "src/shared/types";

import ExtBadge from "./ExtBadge";

export function FileThumbnail({ media }: { media: InternalFile }) {
  const render = () => {
    if (isImageFile(media.ext)) {
      return (
        <img
          src={`media://${encodeURI(`${media.name}.${media.ext}`)}`}
          alt={media.name}
          className="object-contain w-full h-full"
        />
      );
    } else if (isVideoFile(media.ext)) {
      return <Clapperboard />;
    } else {
      return <File />;
    }
  };

  return (
    <figure className="aspect-square bg-black/20 rounded-sm overflow-hidden relative flex items-center justify-center">
      {render()}
    </figure>
  );
}

export function FileInfo({ media }: { media: InternalFile }) {
  return (
    <div className="text-xs flex items-center gap-2 whitespace-nowrap">
      <ExtBadge ext={media.ext} />
      <span className="text-ellipsis overflow-hidden flex-1">{media.name}</span>
      <span className="opacity-30">{(media.size / 1024 / 1024).toFixed(2)} MB</span>
    </div>
  );
}
