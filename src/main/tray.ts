import { app, BrowserWindow, dialog, Menu, Tray } from "electron";

import icon from "../../resources/icon.png?asset";
import { State } from ".";

async function handleTrayQuit(window: BrowserWindow | null) {
  if (!window) return;

  const result = await dialog.showMessageBox(window, {
    type: "question",
    buttons: ["예", "아니오"],
    title: "종료 확인",
    message: "프로그램을 종료하시겠습니까?",
  });

  if (result.response === 0) {
    app.quit();
  }
}

export function initializeTray(state: State) {
  const tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: "종료", type: "normal", click: () => handleTrayQuit(state.mainWindow) },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on("double-click", () => {
    if (state.mainWindow?.isVisible()) return;

    state.mainWindow?.show();
  });

  return tray;
}
