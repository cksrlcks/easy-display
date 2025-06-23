import "./assets/css/main.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import AppScreen from "./App-Screen";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppScreen />
  </StrictMode>,
);
