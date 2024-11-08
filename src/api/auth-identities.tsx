import { handleResponse, handleSettledResult } from "util/helpers";
import { IncusApiResponse } from "types/apiResponse";
import { IncusIdentity } from "types/permissions";

export const fetchIdentities = (): Promise<IncusIdentity[]> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/auth/identities?recursion=1`)
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusIdentity[]>) => resolve(data.metadata))
      .catch(reject);
  });
};

export const fetchIdentity = (
  id: string,
  authMethod: string,
): Promise<IncusIdentity> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/auth/identities/${authMethod}/${id}`)
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusIdentity>) => resolve(data.metadata))
      .catch(reject);
  });
};

export const updateIdentity = (identity: Partial<IncusIdentity>) => {
  return new Promise((resolve, reject) => {
    fetch(
      `/1.0/auth/identities/${identity.authentication_method}/${identity.id}`,
      {
        method: "PUT",
        body: JSON.stringify(identity),
      },
    )
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const updateIdentities = (
  identities: Partial<IncusIdentity>[],
): Promise<void> => {
  return new Promise((resolve, reject) => {
    void Promise.allSettled(
      identities.map((identity) => updateIdentity(identity)),
    )
      .then(handleSettledResult)
      .then(resolve)
      .catch(reject);
  });
};
