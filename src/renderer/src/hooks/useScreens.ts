import { Screen, Slide } from "@shared/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useScreens() {
  return useQuery({
    queryKey: ["screens"],
    queryFn: async () => {
      const response = await window.api.screenList();
      if (!response.success) {
        toast.error(response.message);
      }
      return response.data;
    },
  });
}

export function useScreenById(id?: string) {
  return useQuery({
    queryKey: ["screens", id],
    queryFn: async () => {
      const response = await window.api.screenGet({ id });
      if (!response.success) {
        toast.error(response.message);
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function useScreenActions() {
  const queryClient = useQueryClient();

  const onAddScreen = async (data: Pick<Screen, "alias" | "direction">) => {
    const response = await window.api.screenCreate(data);

    if (!response.success) {
      toast.error(response.message);
    }

    toast.success(response.message);
    queryClient.invalidateQueries({ queryKey: ["screens"] });
  };

  const onEditScreen = async (data: Pick<Screen, "id" | "alias" | "direction">) => {
    const response = await window.api.screenUpdate(data);

    if (!response.success) {
      toast.error(response.message);
    }

    toast.success(response.message);
    queryClient.invalidateQueries({ queryKey: ["screens"] });
  };

  const onDeleteScreen = async (data: Pick<Screen, "id">) => {
    const response = await window.api.screenDelete(data);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    queryClient.invalidateQueries({ queryKey: ["screens"] });
  };

  const updateScreenSlides = async ({
    screenId,
    slides,
  }: {
    screenId: Screen["id"];
    slides: Pick<Slide, "duration" | "show" | "filePath">[];
  }) => {
    const response = await window.api.screenUpdateSlides({ screenId, slides });

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
    queryClient.invalidateQueries({ queryKey: ["screens"] });
  };

  return {
    onAddScreen,
    onEditScreen,
    onDeleteScreen,
    updateScreenSlides,
  };
}
