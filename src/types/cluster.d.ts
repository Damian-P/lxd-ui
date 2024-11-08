export type IncusClusterMemberAction = "evacuate" | "restore";

export type IncusClusterMemberStatus = "Evacuated" | "Online";

export interface IncusClusterMember {
  architecture: string;
  database: boolean;
  description: string;
  failure_domain: string;
  groups?: string[];
  message: string;
  roles: string[];
  server_name: string;
  status: IncusClusterMemberStatus;
  url: string;
}

export interface IncusClusterGroup {
  description: string;
  members: string[];
  name: string;
}
