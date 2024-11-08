export interface IncusDiskDevice {
  name?: string;
  path?: string;
  pool: string;
  size?: string;
  source?: string;
  "limits.read"?: string;
  "limits.write"?: string;
  type: "disk";
}

export interface IncusIsoDevice {
  "boot.priority": string;
  pool: string;
  source: string;
  type: "disk";
}

export interface IncusNicDevice {
  name?: string;
  network: string;
  type: "nic";
}

export interface IncusNoneDevice {
  name?: string;
  type: "none";
}

export type IncusDevices = Record<
  string,
  IncusDiskDevice | IncusIsoDevice | IncusNicDevice | IncusNoneDevice
>;
