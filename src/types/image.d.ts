import { IncusStorageVolume } from "types/storage";

export type IncusImageType = "container" | "virtual-machine";

interface IncusImageAlias {
  name: string;
  description: string;
}

export interface IncusImage {
  fingerprint: string;
  public: boolean;
  properties?: {
    description: string;
    os: string;
    release: string;
    variant?: string;
  };
  update_source?: {
    alias: string;
    protocol: string;
    server: string;
  };
  architecture: string;
  type: IncusImageType;
  size: number;
  uploaded_at: string;
  aliases: IncusImageAlias[];
  cached: boolean;
  profiles: string[];
}

export interface ImportImage {
  aliases: string;
  server: string;
}

export interface RemoteImage {
  aliases: string;
  arch: string;
  created_at: number;
  incus_requirements?: {
    secureboot: boolean;
  };
  os: string;
  pool?: string;
  release: string;
  release_title?: string;
  variant?: string;
  versions?: Record<
    string,
    {
      items: Record<
        string,
        {
          ftype: string;
        }
      >;
    }
  >;
  server?: string;
  volume?: IncusStorageVolume;
  type?: IncusImageType;
  fingerprint?: string;
  profiles?: string[];
}

export interface RemoteImageList {
  products: {
    key: RemoteImage;
  };
}
