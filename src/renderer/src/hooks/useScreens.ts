import { InternalFile, Screen, Slide } from "@shared/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useScreens() {
  return useQuery({
    queryKey: ["screens"],
    queryFn: async () => {
      const response = await window.api.getScreenList();
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
      const response = await window.api.getScreenById({ id });
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
    const response = await window.api.createScreen(data);

    if (!response.success) {
      throw new Error(response.message);
    }

    toast.success(response.message);
    queryClient.invalidateQueries({ queryKey: ["screens"] });
  };

  const onEditScreen = async (data: Pick<Screen, "id" | "alias" | "direction">) => {
    const response = await window.api.updateScreen(data);

    if (!response.success) {
      throw new Error(response.message);
    }

    toast.success(response.message);
    queryClient.invalidateQueries({ queryKey: ["screens"] });
  };

  const onDeleteScreen = async (data: Pick<Screen, "id">) => {
    const response = await window.api.deleteScreen(data);

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
    slides: (Pick<Slide, "duration" | "show"> & { file: InternalFile | null })[];
  }) => {
    const convertedData = slides.map((slide) => ({
      ...slide,
      filePath: slide.file ? slide.file.path : null,
    }));

    const response = await window.api.updateScreenSlides({ screenId, slides: convertedData });

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
