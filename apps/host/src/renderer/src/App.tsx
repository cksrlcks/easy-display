import log from "electron-log/renderer";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

import GlobalSetting from "./components/GlobalSetting";
import Logo from "./components/layout/Logo";
import Nav from "./components/layout/Nav";
import Screen from "./components/layout/Screen";
import Provider from "./context/Provider";

log.info("Log from the renderer process");

export default function App() {
  return (
    <Provider>
      <Screen>
        <Screen.Header>
          <div className="flex items-center gap-2 justify-between">
            <Logo />
            <GlobalSetting />
          </div>
          <Nav />
        </Screen.Header>
        <Screen.Body>
          <Outlet />
        </Screen.Body>
      </Screen>

      <Toaster />
    </Provider>
  );
}
