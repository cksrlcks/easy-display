import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import AppScreen from "./App-Screen";
import "./assets/css/main.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppScreen />
  </StrictMode>,
);
