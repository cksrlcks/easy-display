import { Outlet } from "react-router";
import { Toaster } from "sonner";

import Logo from "./components/layout/Logo";
import Nav from "./components/layout/Nav";
import Screen from "./components/layout/Screen";

export default function App() {
  return (
    <>
      <Screen>
        <Screen.Header>
          <Logo />
          <Nav />
        </Screen.Header>
        <Screen.Body>
          <Outlet />
        </Screen.Body>
      </Screen>

      <Toaster />
    </>
  );
}
