import { handleResponse } from "util/helpers";
import {
  IncusClusterGroup,
  IncusClusterMember,
  IncusClusterMemberAction,
} from "types/cluster";
import { IncusApiResponse } from "types/apiResponse";

export const fetchClusterMembers = (): Promise<IncusClusterMember[]> => {
  return new Promise((resolve, reject) => {
    fetch("/1.0/cluster/members?recursion=2")
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusClusterMember[]>) =>
        resolve(data.metadata),
      )
      .catch(reject);
  });
};

export const postClusterMemberState = (
  member: IncusClusterMember,
  action: IncusClusterMemberAction,
): Promise<IncusClusterMember[]> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/cluster/members/${member.server_name}/state`, {
      method: "POST",
      body: JSON.stringify({
        action: action,
      }),
    })
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusClusterMember[]>) =>
        resolve(data.metadata),
      )
      .catch(reject);
  });
};

export const fetchClusterGroups = (): Promise<IncusClusterGroup[]> => {
  return new Promise((resolve, reject) => {
    fetch("/1.0/cluster/groups?recursion=1")
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusClusterGroup[]>) => resolve(data.metadata))
      .catch(reject);
  });
};

export const fetchClusterGroup = (group: string): Promise<IncusClusterGroup> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/cluster/groups/${group}`)
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusClusterGroup>) => resolve(data.metadata))
      .catch(reject);
  });
};

export const updateClusterGroup = (
  group: IncusClusterGroup,
): Promise<IncusApiResponse<null>> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/cluster/groups/${group.name}`, {
      method: "PUT",
      body: JSON.stringify(group),
    })
      .then(handleResponse)
      .then((data: IncusApiResponse<null>) => resolve(data))
      .catch(reject);
  });
};

export const createClusterGroup = (
  group: IncusClusterGroup,
): Promise<IncusApiResponse<null>> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/cluster/groups`, {
      method: "POST",
      body: JSON.stringify(group),
    })
      .then(handleResponse)
      .then((data: IncusApiResponse<null>) => resolve(data))
      .catch(reject);
  });
};

export const deleteClusterGroup = (group: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/cluster/groups/${group}`, {
      method: "DELETE",
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};
