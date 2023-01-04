export type Device = {
  id: string;
  type: string;
  version: string;
  description: string;
};

export function verifyDeviceInput(
  device: Device,
): Device | null {
  if (
    device.type === undefined || device.version === undefined ||
    device.description === undefined
  ) {
    return null;
  }

  if (device.type.length > 16 || device.type.length < 1) {
    return null;
  }

  const parsedInt = parseInt(device.version);
  if (typeof parsedInt !== "number") {
    return null;
  }
  if (parsedInt) {
    if (parsedInt < 0) {
      return null;
    }
  }

  if (device.description.length > 110 || device.description.length < 1) {
    return null;
  }

  return device;
}
