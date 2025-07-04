import { app, ipcMain } from "electron";

ipcMain.handle("quit-app", () => {
  app.quit();
});
