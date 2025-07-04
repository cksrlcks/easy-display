import ConfirmDialog from "@renderer/components/ConfirmDialog";
import ScreenFrame from "@renderer/components/Screen";
import AddScreenDialog from "@renderer/components/ScreenFormDialog";
import ScrollableListArea from "@renderer/components/ScrollableListArea";
import { Button } from "@renderer/components/ui/button";
import { useScreenActions, useScreens } from "@renderer/hooks/useScreens";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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

    if (data?.length === 0) {
      return (
        <div className="text-center h-full flex items-center justify-center text-gray-500">
          등록된 스크린이 없습니다.
        </div>
      );
    }

    return (
      <AnimatePresence>
        <ul>
          {data?.map((screen) => (
            <motion.li
              layout
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
              }}
              exit={{ opacity: 0 }}
              key={screen.id}
              className="pb-4 mb-4 border-b last:border-0"
            >
              <div className="flex items-center gap-8">
                <ScreenFrame type="screen" className="max-w-[380px]" />
                <div className="space-y-3 flex-1">
                  <div className="text-2xl font-medium">{screen.alias}</div>
                  <ul className="space-y-1 text-sm">
                    {[
                      { label: "ID", value: screen.id },
                      { label: "생성일", value: new Date(screen.createdAt).toLocaleDateString() },
                      { label: "수정일", value: new Date(screen.updatedAt).toLocaleDateString() },
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
                  <ConfirmDialog
                    title="스크린 삭제"
                    description="이 스크린을 삭제하시겠습니까?"
                    buttonText={{ confirm: "삭제", cancel: "취소" }}
                    onClick={() => onDeleteScreen({ id: screen.id })}
                  >
                    <Button size="sm" variant="outline" className="text-xs">
                      삭제
                    </Button>
                  </ConfirmDialog>
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
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
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
      <ScrollableListArea>{renderContent()}</ScrollableListArea>
    </div>
  );
}
