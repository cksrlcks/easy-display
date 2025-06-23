import useWindowSize from "@renderer/hooks/useWindowSize";
import { isImageFile, isVideoFile } from "@renderer/lib/utils";
import { PhotoView as PhotoViewComponent } from "react-photo-view";
import { InternalFile } from "src/shared/types";

export default function PhotoView({
  media,
  children,
}: {
  media: InternalFile;
  children: React.ReactElement;
}) {
  const windowSize = useWindowSize();
  const videoPreviewWidth = windowSize.width * 0.8;
  const videoPreviewHeight = (videoPreviewWidth / 16) * 9;

  return (
    <PhotoViewComponent
      {...(isImageFile(media.ext)
        ? { src: `media://${encodeURI(`${media.name}.${media.ext}`)}` }
        : {
            width: videoPreviewWidth,
            height: videoPreviewHeight,
            render: ({ attrs }) => (
              <div {...attrs}>
                <div className="aspect-video w-full h-full">
                  {isVideoFile(media.ext) ? (
                    <video className="object-contain w-full h-full" controls>
                      <source
                        src={`/media/${encodeURI(`${media.name}.${media.ext}`)}`}
                        type={`video/${media.ext}`}
                      />
                    </video>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      미리보기할 수 없는 파일입니다.
                    </div>
                  )}
                </div>
              </div>
            ),
          })}
    >
      <div className="relative">{children}</div>
    </PhotoViewComponent>
  );
}
