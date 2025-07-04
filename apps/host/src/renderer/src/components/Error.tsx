import { Button } from "./ui/button";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center gap-4">
      <h2 className="text-lg">문제가 발생했습니다.</h2>
      <Button variant="outline" onClick={() => window.api.quitApp()}>
        종료하기
      </Button>
    </div>
  );
}
