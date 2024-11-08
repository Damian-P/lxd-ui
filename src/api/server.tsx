import { handleResponse, handleTextResponse } from "util/helpers";
import { IncusSettings } from "types/server";
import { IncusApiResponse } from "types/apiResponse";
import { IncusConfigOptions, IncusConfigPair } from "types/config";
import { IncusResources } from "types/resources";

export const fetchSettings = (): Promise<IncusSettings> => {
  return new Promise((resolve, reject) => {
    fetch("/1.0")
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusSettings>) => resolve(data.metadata))
      .catch(reject);
  });
};

export const updateSettings = (config: IncusConfigPair): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch("/1.0", {
      method: "PATCH",
      body: JSON.stringify({
        config,
      }),
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const fetchResources = (): Promise<IncusResources> => {
  return new Promise((resolve, reject) => {
    fetch("/1.0/resources")
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusResources>) => resolve(data.metadata))
      .catch(reject);
  });
};

export const fetchConfigOptions = (
  hasMetadataConfiguration: boolean,
): Promise<IncusConfigOptions | null> => {
  if (!hasMetadataConfiguration) {
    return new Promise((resolve) => resolve(null));
  }

  return new Promise((resolve, reject) => {
    fetch("/1.0/metadata/configuration")
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusConfigOptions>) => resolve(data.metadata))
      .catch(reject);
  });
};

export const fetchDocObjects = (
  hasDocumentationObject: boolean,
): Promise<string[]> => {
  if (!hasDocumentationObject) {
    return new Promise((resolve) => resolve([]));
  }

  return new Promise((resolve, reject) => {
    fetch("/documentation/objects.inv.txt")
      .then(handleTextResponse)
      .then((data) => resolve(data.split("\n")))
      .catch(reject);
  });
};
