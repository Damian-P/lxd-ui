import { handleResponse } from "util/helpers";
import { IncusWarning } from "types/warning";
import { IncusApiResponse } from "types/apiResponse";

export const fetchWarnings = (): Promise<IncusWarning[]> => {
  return new Promise((resolve, reject) => {
    fetch("/1.0/warnings?recursion=1")
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusWarning[]>) => resolve(data.metadata))
      .catch(reject);
  });
};
