export type IncusConfigPair = Record<string, string | undefined>;

export type ConfigField = IncusConfigOption & {
  category: string;
  default: string;
  key: string;
};

export interface IncusConfigOption {
  default?: string;
  defaultdesc?: string;
  longdesc?: string;
  scope?: "global" | "local";
  shortdesc?: string;
  type: "bool" | "string" | "integer";
}

export interface LxcConfigOptionCategories {
  [category: string]: {
    keys: {
      [key: string]: IncusConfigOption;
    }[];
  };
}

export interface IncusConfigOptions {
  configs: {
    cluster: LxcConfigOptionCategories;
    instance: LxcConfigOptionCategories;
    "network-bridge": LxcConfigOptionCategories;
    "network-macvlan": LxcConfigOptionCategories;
    "network-ovn": LxcConfigOptionCategories;
    "network-physical": LxcConfigOptionCategories;
    "network-sriov": LxcConfigOptionCategories;
    project: LxcConfigOptionCategories;
    server: LxcConfigOptionCategories;
    "storage-btrfs": LxcConfigOptionCategories;
    "storage-ceph": LxcConfigOptionCategories;
    "storage-cephfs": LxcConfigOptionCategories;
    "storage-cephobject": LxcConfigOptionCategories;
    "storage-dir": LxcConfigOptionCategories;
    "storage-lvm": LxcConfigOptionCategories;
    "storage-powerflex": LxcConfigOptionCategories;
    "storage-zfs": LxcConfigOptionCategories;
    "storage-lvmcluster": LxcConfigOptionCategories;
  };
}

export type IncusConfigOptionsKeys = keyof IncusConfigOptions["configs"];
