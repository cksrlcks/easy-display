import { zodResolver } from "@hookform/resolvers/zod";
import { useGlobalConfig, useGlobalConfigActions } from "@renderer/hooks/useGlobalConfig";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
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

const globalSettingFormSchema = z.object({
  hostName: z.string().min(1, "호스트 이름을 입력하세요"),
  udpPort: z.coerce
    .number()
    .min(1024, "유효한 포트 번호를 입력하세요 (1024~65535)")
    .max(65535, "유효한 포트 번호를 입력하세요 (1024~65535)"),
  mediaServerPort: z.coerce
    .number()
    .min(1024, "유효한 포트 번호를 입력하세요 (1024~65535)")
    .max(65535, "유효한 포트 번호를 입력하세요 (1024~65535)"),
});

type GlobalSettingFormType = z.infer<typeof globalSettingFormSchema>;

export default function GlobalSetting() {
  const [open, setOpen] = useState(false);
  const { data } = useGlobalConfig();
  const { onUpdateGlobalConfig } = useGlobalConfigActions();

  const form = useForm<GlobalSettingFormType>({
    resolver: zodResolver(globalSettingFormSchema),
    mode: "onSubmit",
    defaultValues: {
      hostName: "",
      udpPort: 0,
      mediaServerPort: 0,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        hostName: data.hostName || "",
        udpPort: data.udpPort || 0,
        mediaServerPort: data.mediaServerPort || 0,
      });
    }
  }, [data, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onUpdateGlobalConfig(data);
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
        <Button variant="outline" size="sm">
          <Settings />
          {data?.hostName}
          설정
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Host 설정</DialogTitle>
              <DialogDescription>호스트 정보를 수정합니다.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-6">
              <FormField
                control={form.control}
                name="hostName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="hostName">호스트 이름</FormLabel>
                    <FormControl>
                      <Input id="hostName" placeholder="호스트 이름을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="udpPort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="udpPort">포트 번호</FormLabel>
                    <FormControl>
                      <Input id="udpPort" placeholder="포트 번호를 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mediaServerPort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="mediaServerPort">미디어 포트 번호</FormLabel>
                    <FormControl>
                      <Input
                        id="mediaServerPort"
                        placeholder="미디어 포트 번호를 입력하세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">닫기</Button>
              </DialogClose>
              <Button type="submit" onClick={handleSubmit}>
                저장
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
