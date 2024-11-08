import {
  IncusDiskDevice,
  IncusIsoDevice,
  IncusNicDevice,
  IncusNoneDevice,
} from "types/device";

export const isNicDevice = (
  device: IncusDiskDevice | IncusNicDevice | IncusIsoDevice | IncusNoneDevice,
): device is IncusNicDevice => device.type === "nic";

export const isDiskDevice = (
  device: IncusDiskDevice | IncusNicDevice | IncusIsoDevice | IncusNoneDevice,
): device is IncusDiskDevice => device.type === "disk";
