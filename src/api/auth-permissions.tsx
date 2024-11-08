import { handleResponse } from "util/helpers";
import { IncusApiResponse } from "types/apiResponse";
import { IncusPermission } from "types/permissions";

export const fetchPermissions = (args: {
  resourceType: string;
  project?: string;
}): Promise<IncusPermission[]> => {
  const { resourceType, project } = args;
  let url = `/1.0/auth/permissions?entity-type=${resourceType}`;
  if (project) {
    url += `&project=${project}`;
  }

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusPermission[]>) => resolve(data.metadata))
      .catch(reject);
  });
};
