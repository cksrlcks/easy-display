import { DragDropEvents, DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import DraggableItem from "@renderer/components/DraggableItem";
import FileItem from "@renderer/components/FileItem";
import MediaDrawer from "@renderer/components/MediaDrawer";
import SlideContextMenu from "@renderer/components/SlideContextMenu";
import { Button } from "@renderer/components/ui/button";
import { Form, FormField } from "@renderer/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";
import { useExplorer } from "@renderer/hooks/useExplorer";
import { useScreenActions, useScreenById } from "@renderer/hooks/useScreens";
import { isImageFile, isVideoFile } from "@renderer/lib/utils";
import { ExplorerItem } from "@shared/types";
import { ArrowLeft, Check, Eye, EyeOff, Import, RotateCcwSquare } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";

const ScreenSettingFormSchema = z.object({
  slides: z.array(
    z.object({
      duration: z.number().nullable(),
      show: z.boolean(),
      rotate: z.number(),
      file: z
        .object({
          isDirectory: z.boolean(),
          ext: z.string().optional(),
          path: z.string(),
          name: z.string(),
          size: z.number(),
        })
        .nullable(),
    }),
  ),
});

type ScreenSettingFormType = z.infer<typeof ScreenSettingFormSchema>;

export default function ScreenSetting() {
  const params = useParams<{ screenId: string }>();
  const navigate = useNavigate();
  const { data, isPending } = useScreenById(params.screenId);
  const { updateScreenSlides } = useScreenActions();
  const { openFile } = useExplorer();

  const form = useForm<ScreenSettingFormType>({
    resolver: zodResolver(ScreenSettingFormSchema),
    mode: "onSubmit",
    defaultValues: {
      slides: data?.slides || [],
    },
  });

  useEffect(() => {
    if (data?.slides) {
      form.reset({ slides: data.slides });
    }
  }, [data, form]);

  const { fields, append, move, remove } = useFieldArray({
    control: form.control,
    name: "slides",
  });

  const handleAddSlide = async (files: ExplorerItem[]) => {
    if (!files || files.length === 0) return;

    files.forEach((file) => {
      append({
        duration: file.ext && isVideoFile(file.ext) ? null : 10,
        show: true,
        rotate: 0,
        file,
      });
    });
  };

  const handleDragEnd: DragDropEvents["dragend"] = ({ operation }) => {
    const { source } = operation;
    if (!source || !isSortable(source)) return;
    if (source.sortable.index === source.sortable.initialIndex) return;

    move(source.sortable.initialIndex, source.sortable.index);
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!params.screenId) return;

    await updateScreenSlides({
      screenId: params.screenId,
      slides: data.slides.map((slide) => ({ ...slide, filePath: slide.file?.path || null })),
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col h-full">
        <header className="flex justify-between">
          <Button variant="ghost" size="sm" className="gap-3" onClick={() => navigate("/screen")}>
            <ArrowLeft />
            {data?.alias} 스크린 설정
          </Button>
          <div className="flex items-center gap-2">
            <MediaDrawer onSelect={handleAddSlide}>
              <Button type="button" size="sm" variant="outline" className="text-xs">
                <Import />
                미디어 추가
              </Button>
            </MediaDrawer>
            <Button
              type="submit"
              size="sm"
              variant="outline"
              disabled={form.formState.isSubmitting || isPending || !form.formState.isDirty}
            >
              <Check />
              저장
            </Button>
          </div>
        </header>
        <div className="bg-black/10 h-full flex-1 overflow-y-auto rounded-lg p-10 pt-8">
          {isPending && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10">
              <span className="text-white">슬라이드를 불러오는중...</span>
            </div>
          )}

          <DragDropProvider onDragEnd={handleDragEnd}>
            <ul className="grid grid-cols-4 gap-x-4 gap-y-6">
              {fields.map((fieldItem, index) => (
                <DraggableItem key={fieldItem.id} id={fieldItem.id} index={index}>
                  {({ handler }) => (
                    <li key={fieldItem.id}>
                      <div className="mb-4">
                        <div className="relative mb-2 cursor-pointer" ref={handler}>
                          <span className="absolute left-3 top-3 w-5 h-5 flex justify-center items-center bg-white text-black rounded-full text-xs font-medium z-10">
                            {index + 1}
                          </span>
                          <SlideContextMenu
                            onDelete={() => remove(index)}
                            {...(fieldItem.file && {
                              file: fieldItem.file,
                              onOpen: () => openFile(fieldItem.file!.path),
                            })}
                          >
                            <FileItem
                              file={fieldItem.file}
                              rotate={form.watch(`slides.${index}.rotate`)}
                              mode="screen"
                              showInfo
                            />
                          </SlideContextMenu>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={`slides.${index}.show`}
                          render={({ field }) => (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => field.onChange(!field.value)}
                            >
                              {field.value ? <Eye size={16} /> : <EyeOff size={16} />}
                            </Button>
                          )}
                        />
                        {fieldItem.file?.ext && isImageFile(fieldItem.file.ext) && (
                          <FormField
                            control={form.control}
                            name={`slides.${index}.rotate`}
                            render={({ field }) => (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => field.onChange((field.value - 90) % 360)}
                              >
                                <RotateCcwSquare size={16} />
                              </Button>
                            )}
                          />
                        )}
                        <FormField
                          control={form.control}
                          name={`slides.${index}.duration`}
                          render={({ field }) => (
                            <Select
                              defaultValue={field.value ? String(field.value) : "video-time"}
                              onValueChange={(value) =>
                                value === "video-time"
                                  ? field.onChange(null)
                                  : field.onChange(Number(value))
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="시간선택" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="2">2초</SelectItem>
                                  <SelectItem value="4">4초</SelectItem>
                                  <SelectItem value="6">6초</SelectItem>
                                  <SelectItem value="8">8초</SelectItem>
                                  <SelectItem value="10">10초</SelectItem>
                                  <SelectItem value="12">12초</SelectItem>
                                  {fieldItem.file?.ext && isVideoFile(fieldItem.file.ext) && (
                                    <SelectItem value="video-time">비디오 시간</SelectItem>
                                  )}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </li>
                  )}
                </DraggableItem>
              ))}
            </ul>
          </DragDropProvider>
        </div>
      </form>
    </Form>
  );
}
