import { createBrowserRouter } from "react-router";

import App from "./App";
import Display from "./routes/Display";
import Media from "./routes/Media";
import Screen from "./routes/Screen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Media />,
      },
      {
        path: "screen",
        element: <Screen />,
      },
      {
        path: "display",
        element: <Display />,
      },
    ],
  },
]);
