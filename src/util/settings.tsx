import { IncusSettings } from "types/server";

export const supportsOvnNetwork = (
  settings: IncusSettings | undefined,
): boolean => {
  return Boolean(
    settings?.config?.["network.ovn.northbound_connection"] ?? false,
  );
};

export const isClusteredServer = (
  settings: IncusSettings | undefined,
): boolean => {
  return settings?.environment?.server_clustered ?? false;
};
