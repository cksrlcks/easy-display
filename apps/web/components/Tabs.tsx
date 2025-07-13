"use client";

import { cn } from "@/lib/utils";
import { PropsWithChildren, createContext, useContext, useState } from "react";

type TabContext = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const TabContext = createContext<null | TabContext>(null);

const useTab = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("useTab must be used within a TabProvider");
  }
  return context;
};

export const Tabs = ({ defaultValue, children }: PropsWithChildren<{ defaultValue: string }>) => {
  const [activeTab, setActiveTab] = useState<string>(defaultValue);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="space-y-4">{children}</div>
    </TabContext.Provider>
  );
};

export const TabList = ({ children }: PropsWithChildren) => {
  return <ul className="flex items-center mb-10">{children}</ul>;
};

export const TabButton = ({ value, children }: PropsWithChildren<{ value: string }>) => {
  const { activeTab, setActiveTab } = useTab();

  const handleClick = () => {
    setActiveTab(value);
  };

  return (
    <button
      className={cn(
        "py-6 px-4 flex items-center justify-center cursor-pointer flex-1 border-b-2 border-white/20 text-gray-500 transition-colors text-sm",
        activeTab === value && "border-white text-white font-semibold",
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export const TabContent = ({ value, children }: PropsWithChildren<{ value: string }>) => {
  const { activeTab } = useTab();

  return activeTab === value ? <div>{children}</div> : null;
};
