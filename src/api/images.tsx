import {
  continueOrFinish,
  handleResponse,
  pushFailure,
  pushSuccess,
} from "util/helpers";
import { IncusImage } from "types/image";
import { IncusApiResponse } from "types/apiResponse";
import { IncusOperationResponse } from "types/operation";
import { EventQueue } from "context/eventQueue";
import { IncusInstance, IncusInstanceSnapshot } from "types/instance";

export const fetchImage = (
  image: string,
  project: string,
): Promise<IncusImage> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/images/${image}?project=${project}`)
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusImage>) => resolve(data.metadata))
      .catch(reject);
  });
};

export const fetchImageList = (project?: string): Promise<IncusImage[]> => {
  const url =
    "/1.0/images?recursion=1" + (project ? `&project=${project}` : "");
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusImage[]>) => resolve(data.metadata))
      .catch(reject);
  });
};

export const deleteImage = (
  image: IncusImage,
  project: string,
): Promise<IncusOperationResponse> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/images/${image.fingerprint}?project=${project}`, {
      method: "DELETE",
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const deleteImageBulk = (
  fingerprints: string[],
  project: string,
  eventQueue: EventQueue,
): Promise<PromiseSettledResult<void>[]> => {
  const results: PromiseSettledResult<void>[] = [];
  return new Promise((resolve) => {
    void Promise.allSettled(
      fingerprints.map((name) => {
        const image = { fingerprint: name } as IncusImage;
        return deleteImage(image, project)
          .then((operation) => {
            eventQueue.set(
              operation.metadata.id,
              () => pushSuccess(results),
              (msg) => pushFailure(results, msg),
              () => continueOrFinish(results, fingerprints.length, resolve),
            );
          })
          .catch((e) => {
            pushFailure(results, e instanceof Error ? e.message : "");
            continueOrFinish(results, fingerprints.length, resolve);
          });
      }),
    );
  });
};

export const createImageFromInstanceSnapshot = (
  instance: IncusInstance,
  snapshot: IncusInstanceSnapshot,
  isPublic: boolean,
): Promise<IncusOperationResponse> => {
  return new Promise((resolve, reject) => {
    fetch("/1.0/images", {
      method: "POST",
      body: JSON.stringify({
        public: isPublic,
        source: {
          type: "snapshot",
          name: `${instance.name}/${snapshot.name}`,
        },
      }),
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const createImageAlias = (
  fingerprint: string,
  alias: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    fetch("/1.0/images/aliases", {
      method: "POST",
      body: JSON.stringify({
        target: fingerprint,
        name: alias,
      }),
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};
