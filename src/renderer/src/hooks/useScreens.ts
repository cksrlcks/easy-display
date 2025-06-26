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
      if (!id) return;

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

  const onAddScreen = async (data: Partial<Screen>) => {
    const response = await window.api.screenCreate(data);

    if (!response.success) {
      throw new Error(response.message);
    }

    toast.success(response.message);
    queryClient.invalidateQueries({ queryKey: ["screens"] });
  };

  const onEditScreen = async (data: Partial<Screen>) => {
    const response = await window.api.screenUpdate(data);

    if (!response.success) {
      throw new Error(response.message);
    }

    toast.success(response.message);
    queryClient.invalidateQueries({ queryKey: ["screens"] });
  };

  const onDeleteScreen = async (data: Pick<Screen, "id">) => {
    const response = await window.api.screenDelete(data);

    if (!response.success) {
      throw new Error(response.message);
    }

    toast.success(response.message);
    queryClient.invalidateQueries({ queryKey: ["screens"] });
  };

  const updateScreenSlides = async ({
    screenId,
    slides,
  }: {
    screenId: Screen["id"];
    slides: Partial<Slide>[];
  }) => {
    const response = await window.api.screenUpdateSlides({ screenId, slides });

    if (!response.success) {
      throw new Error(response.message);
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
