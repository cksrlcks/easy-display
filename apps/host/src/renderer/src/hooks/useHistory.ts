import { useState } from "react";

type FolderHistoryState = {
  current: string;
  back: string[];
  forward: string[];
};

export default function useHistory(basePath: string = "/") {
  const [history, setHistory] = useState<FolderHistoryState>({
    current: basePath,
    back: [],
    forward: [],
  });

  const handleGoBackFolder = () => {
    setHistory((prev) => {
      if (prev.back.length === 0) return prev;

      const newBack = [...prev.back];
      const last = newBack.pop();

      return {
        current: last || "/",
        back: newBack,
        forward: [...prev.forward, prev.current],
      };
    });
  };

  const handleGoForwardFolder = () => {
    setHistory((prev) => {
      if (prev.forward.length === 0) return prev;

      const newForward = [...prev.forward];
      const next = newForward.pop();

      return {
        current: next || "/",
        back: [...prev.back, prev.current],
        forward: newForward,
      };
    });
  };

  const handleOpenFolder = (path: string) => {
    setHistory((prev) => ({
      current: path,
      back: [...prev.back, prev.current],
      forward: [],
    }));
  };

  return {
    history,
    currentFolderPath: history.current,
    goBack: handleGoBackFolder,
    goForward: handleGoForwardFolder,
    openFolder: handleOpenFolder,
  };
}
