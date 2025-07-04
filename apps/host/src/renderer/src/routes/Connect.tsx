import DeviceFormDialog from "@renderer/components/DeviceFormDialog";
import DeviceSettingForm from "@renderer/components/DeviceSettingForm";
import Screen from "@renderer/components/Screen";
import ScrollableListArea from "@renderer/components/ScrollableListArea";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { useDeviceActions, useDevices } from "@renderer/hooks/useDevice";
import { useScreens } from "@renderer/hooks/useScreens";
import { Screen as ScreenType } from "@repo/types";
import { Device } from "@shared/types";

export default function Connect() {
  const { data: devices, isPending: isPendingDevices } = useDevices();
  const { data: screens, isPending: isPendingScreens } = useScreens();
  const { onEditDevice, onDeleteDevice } = useDeviceActions();

  const isPending = isPendingDevices || isPendingScreens;

  const handleUpdateDeviceSetting = async (deviceId: Device["id"], screenId?: ScreenType["id"]) => {
    await onEditDevice({
      id: deviceId,
      screenId: screenId,
    });
  };

  const handleUpdateDeviceProfile = async (deviceId: Device["id"], data: Partial<Device>) => {
    await onEditDevice({ ...data, id: deviceId });
  };

  const handleDeleteDevice = async (id: Device["id"]) => {
    await onDeleteDevice({ id });
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      <ScrollableListArea>
        <ul className="max-w-[640px] mx-auto h-full">
          {!isPending && devices?.length === 0 && (
            <div className="text-lg  opacity-35 text-center w-full h-full flex items-center justify-center">
              등록된 디바이스가 없습니다.
            </div>
          )}
          {devices?.map((device) => (
            <li key={device.id} className="pb-4 mb-4 border-b last:border-0">
              <div className="flex items-center mb-4">
                <Screen type="device" />
                <div className="w-10  h-1 bg-white/20"></div>
                <Screen type="screen" />
              </div>
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="text"
                    placeholder="디바이스 이름"
                    readOnly
                    disabled
                    value={device.alias || device.name || "TV"}
                  />
                  <DeviceFormDialog
                    initialData={device}
                    onDelete={handleDeleteDevice}
                    onSubmit={(data) => handleUpdateDeviceProfile(device.id, data)}
                  >
                    <Button variant="outline">수정</Button>
                  </DeviceFormDialog>
                </div>
                <DeviceSettingForm
                  className="flex items-center gap-2 flex-1"
                  device={device}
                  screens={screens}
                  onSubmit={handleUpdateDeviceSetting}
                />
              </div>
            </li>
          ))}
        </ul>
      </ScrollableListArea>
    </div>
  );
}
