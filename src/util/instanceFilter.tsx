import { IncusInstanceStatus } from "types/instance";

export interface InstanceFilters {
  queries: string[];
  statuses: IncusInstanceStatus[];
  types: string[];
  profileQueries: string[];
}

export const instanceStatuses: IncusInstanceStatus[] = [
  "Running",
  "Stopped",
  "Frozen",
  "Error",
];

export const instanceTypes: string[] = ["Container", "VM"];

export const enrichStatuses = (
  statuses: IncusInstanceStatus[],
): IncusInstanceStatus[] => {
  if (statuses.includes("Frozen")) {
    statuses.push("Freezing");
  }
  if (statuses.includes("Running")) {
    statuses.push(...(["Restarting", "Starting"] as IncusInstanceStatus[]));
  }
  if (statuses.includes("Stopped")) {
    statuses.push("Stopping");
  }

  return statuses;
};
