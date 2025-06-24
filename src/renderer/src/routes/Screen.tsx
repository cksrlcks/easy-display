import DeleteScreenDialog from "@renderer/components/DeleteScreenDialog";
import ScreenFrame from "@renderer/components/Screen";
import AddScreenDialog from "@renderer/components/ScreenFormDialog";
import { Button } from "@renderer/components/ui/button";
import { useScreenActions, useScreens } from "@renderer/hooks/useScreens";
import { Plus } from "lucide-react";
import { Link } from "react-router";

export default function Screen() {
  const { data, isPending } = useScreens();
  const { onAddScreen, onEditScreen, onDeleteScreen } = useScreenActions();

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="text-center h-full flex items-center justify-center text-gray-500">
          로딩중...
        </div>
      );
    }

    if (!data) {
      return (
        <div className="text-center h-full flex items-center justify-center text-gray-500">
          로딩 중...
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="text-center h-full flex items-center justify-center text-gray-500">
          등록된 스크린이 없습니다.
        </div>
      );
    }

    return (
      <ul>
        {data?.map((screen) => (
          <li key={screen.id} className="pb-4 mb-4 border-b last:border-0">
            <div className="flex items-center gap-8">
              <ScreenFrame type="screen" />
              <div className="space-y-3 flex-1">
                <div className="text-2xl font-medium">{screen.alias}</div>
                <ul className="space-y-1 text-sm">
                  {[
                    { label: "ID", value: screen.id },
                    { label: "생성일", value: new Date(screen.createdAt).toLocaleDateString() },
                    { label: "수정일", value: new Date(screen.updatedAt).toLocaleDateString() },
                    { label: "방향", value: screen.direction === "horizontal" ? "가로" : "세로" },
                    { label: "슬라이드", value: screen.slides.length },
                  ].map((item) => (
                    <li key={item.label}>
                      <div className="flex items-center gap-2">
                        <div className="opacity-25">{item.label}</div>
                        <div>{item.value}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-2">
                <DeleteScreenDialog onDelete={() => onDeleteScreen({ id: screen.id })}>
                  <Button size="sm" variant="outline" className="text-xs">
                    삭제
                  </Button>
                </DeleteScreenDialog>
                <AddScreenDialog initialData={screen} onSubmit={onEditScreen}>
                  <Button size="sm" variant="outline" className="text-xs">
                    수정
                  </Button>
                </AddScreenDialog>
                <Button size="sm" variant="outline" className="text-xs" asChild>
                  <Link to={`/screen/${screen.id}`}>슬라이드 관리</Link>
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="flex gap-1">
        <AddScreenDialog onSubmit={onAddScreen}>
          <Button size="sm" variant="outline" className="text-xs">
            <Plus />
            스크린 추가
          </Button>
        </AddScreenDialog>
      </div>
      <div className="bg-black/10 p-10 rounded-lg relative h-full overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}
