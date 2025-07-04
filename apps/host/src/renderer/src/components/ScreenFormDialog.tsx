import { zodResolver } from "@hookform/resolvers/zod";
import { Screen } from "@repo/types";
import { PropsWithChildren, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

const addScreenFormSchema = z.object({
  id: z.string().optional(),
  alias: z.string().min(1, "스크린 별칭을 입력하세요"),
  direction: z.enum(["horizontal", "vertical"], {
    required_error: "스크린 방향을 선택하세요",
  }),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

type AddScreenFormType = z.infer<typeof addScreenFormSchema>;

type AddScreenDialogProps = PropsWithChildren<{
  initialData?: Partial<Screen>;
  onSubmit: (data: Partial<Screen>) => Promise<void>;
}>;

export default function ScreenFormDialog({
  initialData,
  onSubmit,
  children,
}: AddScreenDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<AddScreenFormType>({
    resolver: zodResolver(addScreenFormSchema),
    mode: "onSubmit",
    defaultValues: initialData || { alias: "", direction: "horizontal" },
  });

  const isEditMode = !!initialData;

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit({ id: initialData?.id, alias: data.alias });

      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
    }
  });

  const handleFormResetOnClose = (open: boolean) => {
    if (!open) form.reset();
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleFormResetOnClose}>
      <DialogTrigger onClick={() => setOpen(true)} asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>스크린 {isEditMode ? "수정" : "추가"}</DialogTitle>
              <DialogDescription>
                {isEditMode ? "스크린을 수정합니다." : "새로운 스크린을 추가합니다."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-6">
              <FormField
                control={form.control}
                name="alias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>스크린 이름</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="스크린 이름을 입력하세요" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">취소</Button>
              </DialogClose>
              <Button type="submit">{isEditMode ? "수정" : "생성"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
