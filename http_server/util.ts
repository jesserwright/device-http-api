export type Device = {
  id: string;
  type: string;
  version: number;
  description: string;
};

export function verifyDeviceInput(
  device: Device,
): Device | null {
  if (
    !((device?.type != undefined) &&
      (device?.version != undefined) &&
      (device?.description != undefined))
  ) {
    return null;
  }
  if (device.type.length > 8) {
    return null;
  }
  if (typeof device.version !== "number") {
    return null;
  }
  if (device.description.length > 110) {
    return null;
  }
  return device;
}
