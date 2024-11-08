import { IncusConfigPair } from "./config";
import { IncusDevices } from "./device";

interface IncusInstanceUsageProp {
  usage: number;
}

interface IncusInstanceMemory {
  swap_usage: number;
  swap_usage_peak: number;
  usage: number;
  usage_peak: number;
}

interface IncusInstanceNetworkAddress {
  address: string;
  family: string;
  netmask: string;
  scope: string;
}

interface IncusInstanceNetworkCounters {
  bytes_received: number;
  bytes_sent: number;
  errors_received: number;
  errors_sent: number;
  packets_dropped_inbound: number;
  packets_dropped_outbound: number;
  packets_received: number;
  packets_sent: number;
}

interface IncusInstanceNetwork {
  addresses: IncusInstanceNetworkAddress[];
  counters: IncusInstanceNetworkCounters;
  host_name: string;
  hwaddr: string;
  mtu: number;
  state: "up" | "down";
  type: string;
}

interface IncusInstanceState {
  cpu: IncusInstanceUsageProp;
  disk: {
    root: IncusInstanceUsageProp;
  } & Record<string, IncusInstanceUsageProp>;
  memory: IncusInstanceMemory;
  network?: Record<string, IncusInstanceNetwork>;
  pid: number;
  processes: number;
  status: string;
}

interface IncusInstanceSnapshot {
  name: string;
  created_at: string;
  expires_at: string;
  stateful: boolean;
}

export type IncusInstanceAction =
  | "freeze"
  | "restart"
  | "start"
  | "stop"
  | "unfreeze";

export type IncusInstanceStatus =
  | "Error"
  | "Freezing"
  | "Frozen"
  | "Restarting"
  | "Running"
  | "Starting"
  | "Stopped"
  | "Stopping";

export interface IncusInstance {
  architecture: string;
  config: {
    "image.description"?: string;
  } & IncusConfigPair;
  created_at: string;
  description: string;
  devices: IncusDevices;
  ephemeral: boolean;
  expanded_config: IncusConfigPair;
  expanded_devices?: IncusDevices;
  last_used_at: string;
  location: string;
  name: string;
  profiles: string[];
  project: string;
  restore?: string;
  snapshots: IncusInstanceSnapshot[] | null;
  state?: IncusInstanceState;
  stateful: boolean;
  status: IncusInstanceStatus;
  type: string;
  etag?: string;
}
