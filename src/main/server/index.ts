import express from "express";
import path from "path";

import { MEDIA_FOLDER } from "../constants";

/**
 * 외부 display용 서버 (tv app의 webview에서 바라볼 서버)
 */
export function startServer() {
  const app = express();

  app.use("/media", express.static(MEDIA_FOLDER));
  app.use(express.static(path.join(__dirname, "../renderer")));

  app.get("/screen", (_, res) => {
    res.sendFile(path.join(__dirname, "../renderer/screen.html"));
  });

  app.listen(3000);
}
