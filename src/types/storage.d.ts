import { IncusConfigPair } from "./config";

export interface IncusStoragePool {
  config: {
    size?: string;
    source?: string;
  } & Record<string, string | undefined>;
  description: string;
  driver: string;
  locations?: string[];
  name: string;
  source?: string;
  status?: string;
  used_by?: string[];
}

export type IncusStorageVolumeContentType = "filesystem" | "block" | "iso";

export type IncusStorageVolumeType =
  | "container"
  | "virtual-machine"
  | "image"
  | "custom";

export interface IncusStorageVolume {
  config: {
    "block.filesystem"?: string;
    "block.mount_options"?: string;
    "block.type"?: string;
    "volatile.rootfs.size"?: number;
    "security.shifted"?: string;
    "security.unmapped"?: string;
    "snapshots.expiry"?: string;
    "snapshots.pattern"?: string;
    "snapshots.schedule"?: string;
    "zfs.blocksize"?: string;
    "zfs.block_mode"?: string;
    "zfs.delegate"?: string;
    "zfs.remove_snapshots"?: string;
    "zfs.use_refquota"?: string;
    "zfs.reserve_space"?: string;
    size?: string;
  } & IncusConfigPair;
  content_type: IncusStorageVolumeContentType;
  created_at: string;
  description: string;
  location: string;
  name: string;
  pool: string;
  project: string;
  type: IncusStorageVolumeType;
  used_by?: string[];
  etag?: string;
}

export interface IncusStorageVolumeState {
  usage: {
    used: number;
    total: number;
  };
}

export interface IncusStoragePoolResources {
  inodes: {
    used: number;
    total: number;
  };
  space: {
    used?: number;
    total: number;
  };
}

export interface UploadState {
  percentage: number;
  loaded: number;
  total?: number;
}

export interface IncusVolumeSnapshot {
  name: string;
  created_at: string;
  expires_at?: string;
  description?: string;
}
