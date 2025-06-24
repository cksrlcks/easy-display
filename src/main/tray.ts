import { app, BrowserWindow, dialog, Menu, Tray } from "electron";

import icon from "../../resources/icon.png?asset";
import { State } from ".";
import { MESSAGE } from "./constants";

async function handleTrayQuit(window: BrowserWindow | null) {
  if (!window) return;

  const result = await dialog.showMessageBox(window, {
    type: "question",
    buttons: [MESSAGE.YES, MESSAGE.NO],
    title: MESSAGE.CONFIR_QUIT_TITLE,
    message: MESSAGE.CONFIRM_QUIT,
  });

  if (result.response === 0) {
    app.quit();
  }
}

export function initializeTray(state: State) {
  const tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: MESSAGE.CANCEL, type: "normal", click: () => handleTrayQuit(state.mainWindow) },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on("double-click", () => {
    if (state.mainWindow?.isVisible()) return;

    state.mainWindow?.show();
  });

  return tray;
}
