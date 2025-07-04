import { isImageFile, isVideoFile } from "@renderer/lib/utils";
import { ScreenData } from "@repo/types";
import { useEffect, useState } from "react";

const DEV_URL = "http://localhost:51235";
const PROD_URL = "";

const ROOT_URL = import.meta.env.DEV ? DEV_URL : PROD_URL;

export default function Webview() {
  const [screenData, setScreenData] = useState<ScreenData | null>(null);
  const searchParams = new URLSearchParams(window.location.search);
  const deviceId = searchParams.get("deviceId");

  useEffect(() => {
    console.log("Webview component mounted");
    fetch(`${ROOT_URL}/get-screen-data?deviceId=${deviceId}`)
      .then((response) => response.json())
      .then((json) => {
        console.log("Screen data fetched:", json);
        // You can handle the fetched data here, e.g., set it to state or display it
        const { data } = json;
        setScreenData(data);
      })
      .catch((error) => {
        console.error("Error fetching screen data:", error);
      });
  }, [deviceId]);

  const fileType = (filePath: string | null) => {
    const ext = filePath?.split(".").pop()?.toLowerCase();

    if (!ext) return "none";

    if (isImageFile(ext)) return "image";
    if (isVideoFile(ext)) return "video";

    return "not-supported";
  };

  return (
    <div className="flex justify-center items-center h-full flex-col">
      웹뷰용 스크린 화면 : {deviceId}
      <div className="max-w-[800px] space-y-4">
        {screenData?.slides.map((slide) => (
          <div key={slide.id}>
            {fileType(slide.filePath) === "image" ? (
              <img
                src={`${ROOT_URL}/media?path=${encodeURIComponent(slide.filePath || "")}`}
                alt=""
              />
            ) : (
              <video controls autoPlay muted loop>
                <source
                  src={`${ROOT_URL}/media?path=${encodeURIComponent(slide.filePath || "")}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
