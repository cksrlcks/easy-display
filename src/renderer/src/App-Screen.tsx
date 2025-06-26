import Webview from "./components/Webview";
import Provider from "./context/Provider";

export default function AppSreen() {
  return (
    <Provider>
      <Webview />
    </Provider>
  );
}
