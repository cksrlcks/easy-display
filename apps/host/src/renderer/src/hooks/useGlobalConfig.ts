import { GlobalConfig } from "@shared/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGlobalConfig() {
  return useQuery({
    queryKey: ["globalConfig"],
    queryFn: async () => {
      const response = await window.api.settingGet();
      if (!response.success) {
        toast.error(response.message);
      }
      return response.data;
    },
  });
}

export function useGlobalConfigActions() {
  const queryClient = useQueryClient();

  const onUpdateGlobalConfig = async (data: Partial<GlobalConfig>) => {
    const response = await window.api.settingUpdate(data);

    if (!response.success) {
      throw new Error(response.message);
    }

    toast.success(response.message);
    queryClient.invalidateQueries({ queryKey: ["globalConfig"] });
  };

  return {
    onUpdateGlobalConfig,
  };
}
