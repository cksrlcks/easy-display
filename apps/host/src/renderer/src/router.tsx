import { createHashRouter } from "react-router";

import App from "./App";
import Error from "./components/Error";
import Device from "./routes/Device";
import Media from "./routes/Media";
import Screen from "./routes/Screen";
import ScreenSetting from "./routes/ScreenSetting";
import Setting from "./routes/Setting";

export const router = createHashRouter([
  {
    path: "/",
    errorElement: <Error />,
    element: <App />,
    children: [
      {
        index: true,
        element: <Media />,
      },
      {
        path: "screen",
        children: [
          {
            index: true,
            element: <Screen />,
          },
          {
            path: ":screenId",
            element: <ScreenSetting />,
          },
        ],
      },
      {
        path: "device",
        element: <Device />,
      },
      {
        path: "setting",
        element: <Setting />,
      },
    ],
  },
]);
