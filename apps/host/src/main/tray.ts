import { BrowserWindow, Menu, Tray, app, dialog, shell } from "electron";

import { State } from ".";
import trayIcon from "../../resources/tray-icon.png?asset";
import { COMMON_MESSAGE, MEDIA_FOLDER } from "./constants";

async function handleTrayQuit(window: BrowserWindow | null) {
  if (!window) return;

  const result = await dialog.showMessageBox(window, {
    type: "question",
    buttons: [COMMON_MESSAGE.YES, COMMON_MESSAGE.NO],
    title: COMMON_MESSAGE.CONFIR_QUIT_TITLE,
    message: COMMON_MESSAGE.CONFIRM_QUIT,
  });

  if (result.response === 0) {
    app.quit();
  }
}

export function initializeTray(state: State) {
  const tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: COMMON_MESSAGE.OPEN_MEDIA_FOLDER,
      type: "normal",
      click: () => shell.openPath(MEDIA_FOLDER),
    },
    { label: COMMON_MESSAGE.QUITE, type: "normal", click: () => handleTrayQuit(state.mainWindow) },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on("double-click", () => {
    if (state.mainWindow?.isVisible()) return;

    state.mainWindow?.show();
  });

  return tray;
}
