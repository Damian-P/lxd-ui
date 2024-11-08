import { handleEtagResponse, handleResponse } from "util/helpers";
import { IncusProject } from "types/project";
import { IncusApiResponse } from "types/apiResponse";
import { IncusOperationResponse } from "types/operation";

export const fetchProjects = (): Promise<IncusProject[]> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/projects?recursion=1`)
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusProject[]>) => resolve(data.metadata))
      .catch(reject);
  });
};

export const fetchProject = (name: string): Promise<IncusProject> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/projects/${name}`)
      .then(handleEtagResponse)
      .then((data) => resolve(data as IncusProject))
      .catch(reject);
  });
};

export const createProject = (body: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/projects`, {
      method: "POST",
      body: body,
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const updateProject = (project: IncusProject): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/projects/${project.name}`, {
      method: "PUT",
      body: JSON.stringify(project),
      headers: {
        "If-Match": project.etag ?? "invalid-etag",
      },
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const renameProject = (
  oldName: string,
  newName: string,
): Promise<IncusOperationResponse> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/projects/${oldName}`, {
      method: "POST",
      body: JSON.stringify({
        name: newName,
      }),
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const deleteProject = (project: IncusProject): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/projects/${project.name}`, {
      method: "DELETE",
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};
