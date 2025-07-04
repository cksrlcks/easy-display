import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@renderer/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";
import { Screen } from "@repo/types";
import { Device } from "@shared/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Form, FormField } from "./ui/form";

type DeviceSettingFormProps = {
  device: Device;
  screens?: Screen[];
  onSubmit: (deviceId: Device["id"], screenId?: Screen["id"]) => Promise<void>;
  className?: string;
};

const deviceSettingFormSchema = z.object({
  deviceId: z.string(),
  screenId: z.string().optional(),
});

type DeviceSettingFormType = z.infer<typeof deviceSettingFormSchema>;

export default function DeviceSettingForm({
  device,
  screens,
  onSubmit,
  className,
}: DeviceSettingFormProps) {
  const form = useForm<DeviceSettingFormType>({
    resolver: zodResolver(deviceSettingFormSchema),
    defaultValues: {
      deviceId: device.id,
      screenId: device.screenId || "none",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(device.id, data.screenId === "none" ? undefined : data.screenId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
    }
  });

  return (
    <Form {...form}>
      <form className={className} onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name="deviceId"
          render={({ field }) => <input type="hidden" {...field} value={device.id} />}
        />
        <FormField
          control={form.control}
          name="screenId"
          render={({ field }) => (
            <Select value={field.value || undefined} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="화면 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>디스플레이 목록</SelectLabel>
                  <SelectItem value="none">없음</SelectItem>
                  {screens?.map((screen) => (
                    <SelectItem key={screen.id} value={screen.id}>
                      {screen.alias}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        <Button type="submit" variant="outline">
          저장
        </Button>
      </form>
    </Form>
  );
}
