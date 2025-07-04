import Monitor from "@renderer/assets/img/screen.svg";
import ConfirmDialog from "@renderer/components/ConfirmDialog";
import DeviceFormDialog from "@renderer/components/DeviceFormDialog";
import Screen from "@renderer/components/Screen";
import ScrollableListArea from "@renderer/components/ScrollableListArea";
import { Button } from "@renderer/components/ui/button";
import { useDeviceActions, useDevices, useLocalDevices } from "@renderer/hooks/useDevice";
import { LaptopMinimalCheck, Network } from "lucide-react";

export default function Device() {
  const localDevices = useLocalDevices();

  const { data: devices } = useDevices();
  const { onAddDevice, onDeleteDevice } = useDeviceActions();

  const registeredId = (deviceId: string) => {
    return devices?.find((device) => device.deviceId === deviceId)?.["id"] || "";
  };

  const handleDeleteDevice = (id: string) => {
    onDeleteDevice({ id });
  };

  return (
    <div className="flex gap-4 h-full">
      <div className="w-[60%] text-center flex flex-col items-center justify-center gap-6">
        <figure className="relative">
          <span className="absolute inline-flex aspect-square w-[80%] animate-ping rounded-full bg-black/10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>
          <span className="absolute inline-flex aspect-square w-[80%] animate-ping rounded-full bg-black/10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 delay-100"></span>

          <img src={Monitor} alt="screen" className="z-1 relative" />
        </figure>
        <div className="space-y-2">
          <h2 className="text-xl font-medium">디스플레이 탐색</h2>
          <div className="text-lg opacity-35">
            로컬 네트워크 내에 있는 장비들을 검색합니다. <br />
            안드로이드 TV에서 전용앱을 실행해주세요.
          </div>
        </div>
      </div>
      <ScrollableListArea className="flex-1 h-full">
        {localDevices.length === 0 ? (
          <div className="text-lg opacity-35 text-center w-full h-full flex items-center justify-center">
            검색된 장비가 없습니다.
          </div>
        ) : (
          <ul className="w-full">
            {localDevices.map((tv) => {
              const id = registeredId(tv.deviceId);
              const isRegistered = id !== "";

              return (
                <li key={tv.deviceId} className="border-b pb-8 mb-8 last:border-0">
                  <div className="relative mb-2">
                    <span className="absolute left-4 top-4 flex gap-2 items-center text-sm">
                      <Network size={16} className="-mt-1/2 opacity-30" />
                      <span>{tv.deviceName}</span> |<span>{tv.ip}</span>
                    </span>
                    <Screen type="device" className="max-w-full" />
                  </div>
                  <div className="flex items-center justify-between">
                    {isRegistered ? (
                      <>
                        <ConfirmDialog
                          title="디스플레이 제거"
                          description="이 디스플레이를 제거하시겠습니까?"
                          buttonText={{ confirm: "제거", cancel: "취소" }}
                          onClick={() => handleDeleteDevice(id)}
                        >
                          <Button variant="outline" size="sm">
                            제거
                          </Button>
                        </ConfirmDialog>
                        <div className="flex items-center gap-2">
                          <LaptopMinimalCheck size={18} className="text-green-400" />
                          <span className="text-sm opacity-30">등록된 디스플레입니다.</span>
                        </div>
                      </>
                    ) : (
                      <DeviceFormDialog
                        initialData={{
                          deviceId: tv.deviceId,
                          name: tv.deviceName,
                          ip: tv.ip,
                          alias: tv.deviceName,
                        }}
                        onSubmit={onAddDevice}
                      >
                        <Button variant="outline" size="sm">
                          등록
                        </Button>
                      </DeviceFormDialog>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </ScrollableListArea>
    </div>
  );
}
