import { PropsWithChildren } from "react";

function Screen({ children }: PropsWithChildren) {
  return (
    <div className="overflow-hidden h-full">
      <div className="max-w-7xl mx-auto px-8 py-6 h-full flex flex-col">{children}</div>
    </div>
  );
}

function Header({ children }: PropsWithChildren) {
  return <header className="space-y-4">{children}</header>;
}

function Body({ children }: PropsWithChildren) {
  return <div className="flex-1 min-h-0">{children}</div>;
}

Screen.Header = Header;
Screen.Body = Body;

export default Screen;
