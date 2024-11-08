import { IncusConfigPair } from "./config";
import { IncusDevices } from "./device";

export interface IncusProfile {
  config: IncusConfigPair;
  description: string;
  devices: IncusDevices;
  name: string;
  used_by?: string[];
  etag?: string;
}
