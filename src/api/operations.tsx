import { handleResponse } from "util/helpers";
import { IncusOperation, IncusOperationList } from "types/operation";
import { IncusApiResponse } from "types/apiResponse";

const sortOperationList = (operations: IncusOperationList) => {
  const newestFirst = (a: IncusOperation, b: IncusOperation) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  };
  operations.failure?.sort(newestFirst);
  operations.success?.sort(newestFirst);
  operations.running?.sort(newestFirst);
};

export const fetchOperations = (project: string): Promise<IncusOperationList> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/operations?project=${project}&recursion=1`)
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusOperationList>) => {
        sortOperationList(data.metadata);
        return resolve(data.metadata);
      })
      .catch(reject);
  });
};

export const fetchAllOperations = (): Promise<IncusOperationList> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/operations?all-projects=true&recursion=1`)
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusOperationList>) => {
        sortOperationList(data.metadata);
        return resolve(data.metadata);
      })
      .catch(reject);
  });
};

export const cancelOperation = (id: string): Promise<IncusOperationList> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/operations/${id}`, {
      method: "DELETE",
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};
