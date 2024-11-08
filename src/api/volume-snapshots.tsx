import {
  continueOrFinish,
  handleResponse,
  pushFailure,
  pushSuccess,
} from "util/helpers";
import { IncusOperationResponse } from "types/operation";
import { IncusStorageVolume, IncusVolumeSnapshot } from "types/storage";
import { IncusApiResponse, IncusSyncResponse } from "types/apiResponse";
import { EventQueue } from "context/eventQueue";
import { splitVolumeSnapshotName } from "util/storageVolume";

export const createVolumeSnapshot = (args: {
  volume: IncusStorageVolume;
  name: string;
  expiresAt: string | null;
}): Promise<IncusOperationResponse> => {
  const { volume, name, expiresAt } = args;
  return new Promise((resolve, reject) => {
    fetch(
      `/1.0/storage-pools/${volume.pool}/volumes/custom/${volume.name}/snapshots?project=${volume.project}`,
      {
        method: "POST",
        body: JSON.stringify({
          name,
          expires_at: expiresAt,
        }),
      },
    )
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const deleteVolumeSnapshot = (
  volume: IncusStorageVolume,
  snapshot: Pick<IncusVolumeSnapshot, "name">,
): Promise<IncusOperationResponse> => {
  return new Promise((resolve, reject) => {
    fetch(
      `/1.0/storage-pools/${volume.pool}/volumes/${volume.type}/${volume.name}/snapshots/${snapshot.name}?project=${volume.project}`,
      {
        method: "DELETE",
      },
    )
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const deleteVolumeSnapshotBulk = (
  volume: IncusStorageVolume,
  snapshotNames: string[],
  eventQueue: EventQueue,
): Promise<PromiseSettledResult<void>[]> => {
  const results: PromiseSettledResult<void>[] = [];
  return new Promise((resolve) => {
    void Promise.allSettled(
      snapshotNames.map(async (name) => {
        return await deleteVolumeSnapshot(volume, { name })
          .then((operation) => {
            eventQueue.set(
              operation.metadata.id,
              () => pushSuccess(results),
              (msg) => pushFailure(results, msg),
              () => continueOrFinish(results, snapshotNames.length, resolve),
            );
          })
          .catch((e) => {
            pushFailure(results, e instanceof Error ? e.message : "");
            continueOrFinish(results, snapshotNames.length, resolve);
          });
      }),
    );
  });
};

// NOTE: this api endpoint results in a synchronous operation
export const restoreVolumeSnapshot = (
  volume: IncusStorageVolume,
  snapshot: IncusVolumeSnapshot,
): Promise<IncusSyncResponse<unknown>> => {
  return new Promise((resolve, reject) => {
    fetch(
      `/1.0/storage-pools/${volume.pool}/volumes/${volume.type}/${volume.name}?project=${volume.project}`,
      {
        method: "PUT",
        body: JSON.stringify({
          restore: snapshot.name,
        }),
      },
    )
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const renameVolumeSnapshot = (args: {
  volume: IncusStorageVolume;
  snapshot: IncusVolumeSnapshot;
  newName: string;
}): Promise<IncusOperationResponse> => {
  const { volume, snapshot, newName } = args;
  return new Promise((resolve, reject) => {
    fetch(
      `/1.0/storage-pools/${volume.pool}/volumes/${volume.type}/${volume.name}/snapshots/${snapshot.name}?project=${volume.project}`,
      {
        method: "POST",
        body: JSON.stringify({
          name: newName,
        }),
      },
    )
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

// NOTE: this api endpoint results in a synchronous operation
export const updateVolumeSnapshot = (args: {
  volume: IncusStorageVolume;
  snapshot: IncusVolumeSnapshot;
  expiresAt: string | null;
}): Promise<IncusSyncResponse<unknown>> => {
  const { volume, snapshot, expiresAt } = args;
  return new Promise((resolve, reject) => {
    fetch(
      `/1.0/storage-pools/${volume.pool}/volumes/${volume.type}/${volume.name}/snapshots/${snapshot.name}?project=${volume.project}`,
      {
        method: "PUT",
        body: JSON.stringify({
          expires_at: expiresAt,
        }),
      },
    )
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const fetchStorageVolumeSnapshots = (args: {
  pool: string;
  type: string;
  volumeName: string;
  project: string;
}): Promise<IncusVolumeSnapshot[]> => {
  const { pool, type, volumeName, project } = args;
  return new Promise((resolve, reject) => {
    fetch(
      `/1.0/storage-pools/${pool}/volumes/${type}/${volumeName}/snapshots?project=${project}&recursion=2`,
    )
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusVolumeSnapshot[]>) =>
        resolve(
          data.metadata.map((snapshot) => ({
            ...snapshot,
            name: splitVolumeSnapshotName(snapshot.name).snapshotName,
          })),
        ),
      )
      .catch(reject);
  });
};
