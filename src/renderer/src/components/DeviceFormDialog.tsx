import { zodResolver } from "@hookform/resolvers/zod";
import { Device } from "@shared/types";
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

const addDeviceFormSchema = z.object({
  id: z.string().optional(),
  deviceId: z.string().min(1, "디바이스 ID를 입력하세요"),
  ip: z.string().min(7, "유효한 IP 주소를 입력하세요"),
  name: z.string().min(1, "디바이스 이름을 입력하세요"),
  alias: z.string().min(1, "디바이스 별칭을 입력하세요"),
});

type AddDeviceFormType = z.infer<typeof addDeviceFormSchema>;

type AddDeviceDialogProps = PropsWithChildren<{
  initialData: Partial<Device>;
  onDelete?: (id: string) => Promise<void>;
  onSubmit: (data: Partial<Device>) => Promise<void>;
}>;

export default function DeviceFormDialog({
  initialData,
  onDelete,
  onSubmit,
  children,
}: AddDeviceDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<AddDeviceFormType>({
    resolver: zodResolver(addDeviceFormSchema),
    mode: "onSubmit",
    defaultValues: { ...initialData, alias: initialData.alias || initialData.name },
  });

  const isEditMode = !!initialData.id;

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
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

  const handleDeleteDevice = async () => {
    if (!initialData.id) return;
    try {
      await onDelete?.(initialData.id);
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
    }
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
              <DialogTitle>디스플레이 {isEditMode ? "수정" : "추가"}</DialogTitle>
              <DialogDescription>
                {isEditMode ? "디스플레이를 수정합니다." : "새로운 디스플레이를 추가합니다."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-6">
              <input type="text" {...form.register("id")} hidden />
              <FormField
                control={form.control}
                name="deviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>디스플레이 TV ID</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="디스플레이 ID를 입력하세요"
                        readOnly
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>디스플레이 IP</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="디스플레이 IP를 입력하세요"
                        readOnly
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>디스플레이 이름</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="디스플레이 이름을 입력하세요"
                        readOnly
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>디스플레이 별칭</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="디스플레이 별칭을 입력하세요" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              {isEditMode && (
                <Button
                  type="button"
                  variant="outline"
                  className="mr-auto"
                  onClick={handleDeleteDevice}
                >
                  삭제
                </Button>
              )}
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
