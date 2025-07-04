import { Device, LocalDevice } from "@shared/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useLocalDevices() {
  const [localDevices, setLocalDevices] = useState<LocalDevice[]>([]);

  useEffect(() => {
    window.api.socketStartDiscovery();
    window.api.socketDiscoveredDevices(setLocalDevices);

    return () => {
      window.api.socketStopDiscovery();
    };
  }, []);

  return localDevices;
}

export function useDevices() {
  return useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const response = await window.api.deviceList();
      if (!response.success) {
        toast.error(response.message);
      }
      return response.data;
    },
  });
}

export function useDeviceById(id?: string) {
  return useQuery({
    queryKey: ["devices", id],
    queryFn: async () => {
      if (!id) return;

      const response = await window.api.deviceGet({ id });
      if (!response.success) {
        toast.error(response.message);
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function useDeviceActions() {
  const queryClient = useQueryClient();

  const onAddDevice = async (data: Partial<Device>) => {
    const response = await window.api.deviceCreate(data);

    if (!response.success) {
      throw new Error(response.message);
    }

    toast.success(response.message);
    queryClient.invalidateQueries({ queryKey: ["devices"] });
  };

  const onEditDevice = async (data: Partial<Device>) => {
    const response = await window.api.deviceUpdate(data);

    if (!response.success) {
      throw new Error(response.message);
    }

    toast.success(response.message);
    queryClient.invalidateQueries({ queryKey: ["devices"] });
  };

  const onDeleteDevice = async (data: Pick<Device, "id">) => {
    const response = await window.api.deviceDelete(data);

    if (!response.success) {
      throw new Error(response.message);
    }

    toast.success(response.message);
    queryClient.invalidateQueries({ queryKey: ["devices"] });
  };

  return {
    onAddDevice,
    onEditDevice,
    onDeleteDevice,
  };
}
