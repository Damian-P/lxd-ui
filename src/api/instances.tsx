import {
  continueOrFinish,
  handleEtagResponse,
  handleResponse,
  handleTextResponse,
  pushFailure,
  pushSuccess,
} from "util/helpers";
import { IncusInstance, IncusInstanceAction } from "types/instance";
import { IncusTerminal, TerminalConnectPayload } from "types/terminal";
import { IncusApiResponse } from "types/apiResponse";
import { IncusOperationResponse } from "types/operation";
import { EventQueue } from "context/eventQueue";

export const fetchInstance = (
  name: string,
  project: string,
  recursion = 2,
): Promise<IncusInstance> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/instances/${name}?project=${project}&recursion=${recursion}`)
      .then(handleEtagResponse)
      .then((data) => resolve(data as IncusInstance))
      .catch(reject);
  });
};

export const fetchInstances = (project: string): Promise<IncusInstance[]> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/instances?project=${project}&recursion=2`)
      .then(handleResponse)
      .then((data: IncusApiResponse<IncusInstance[]>) => resolve(data.metadata))
      .catch(reject);
  });
};

export const createInstance = (
  body: string,
  project: string,
  target?: string,
): Promise<IncusOperationResponse> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/instances?project=${project}&target=${target ?? ""}`, {
      method: "POST",
      body: body,
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const updateInstance = (
  instance: IncusInstance,
  project: string,
): Promise<IncusOperationResponse> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/instances/${instance.name}?project=${project}`, {
      method: "PUT",
      body: JSON.stringify(instance),
      headers: {
        "If-Match": instance.etag ?? "invalid-etag",
      },
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const renameInstance = (
  oldName: string,
  newName: string,
  project: string,
): Promise<IncusOperationResponse> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/instances/${oldName}?project=${project}`, {
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

export const migrateInstance = (
  instance: IncusInstance,
  target: string,
): Promise<IncusOperationResponse> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/instances/${instance.name}?project=${instance.project}&target=${target}`, {
      method: "POST",
      body: JSON.stringify({
        migration: true,
        live: instance.type === "virtual-machine" && instance.status === "Running",
      }),
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const startInstance = (
  instance: IncusInstance,
): Promise<IncusOperationResponse> => {
  return putInstanceAction(instance.name, instance.project, "start");
};

export const stopInstance = (
  instance: IncusInstance,
  isForce: boolean,
): Promise<IncusOperationResponse> => {
  return putInstanceAction(instance.name, instance.project, "stop", isForce);
};

export const freezeInstance = (
  instance: IncusInstance,
): Promise<IncusOperationResponse> => {
  return putInstanceAction(instance.name, instance.project, "freeze");
};

export const unfreezeInstance = (
  instance: IncusInstance,
): Promise<IncusOperationResponse> => {
  return putInstanceAction(instance.name, instance.project, "unfreeze");
};

export const restartInstance = (
  instance: IncusInstance,
  isForce: boolean,
): Promise<IncusOperationResponse> => {
  return putInstanceAction(instance.name, instance.project, "restart", isForce);
};

const putInstanceAction = (
  instance: string,
  project: string,
  action: IncusInstanceAction,
  isForce?: boolean,
): Promise<IncusOperationResponse> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/instances/${instance}/state?project=${project}`, {
      method: "PUT",
      body: JSON.stringify({
        action: action,
        force: isForce,
      }),
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export interface InstanceBulkAction {
  name: string;
  project: string;
  action: IncusInstanceAction;
}

export const updateInstanceBulkAction = (
  actions: InstanceBulkAction[],
  isForce: boolean,
  eventQueue: EventQueue,
): Promise<PromiseSettledResult<void>[]> => {
  const results: PromiseSettledResult<void>[] = [];
  return new Promise((resolve) => {
    void Promise.allSettled(
      actions.map(async ({ name, project, action }) => {
        return await putInstanceAction(name, project, action, isForce)
          .then((operation) => {
            eventQueue.set(
              operation.metadata.id,
              () => pushSuccess(results),
              (msg) => pushFailure(results, msg),
              () => continueOrFinish(results, actions.length, resolve),
            );
          })
          .catch((e) => {
            pushFailure(results, e instanceof Error ? e.message : "");
            continueOrFinish(results, actions.length, resolve);
          });
      }),
    );
  });
};

export const deleteInstance = (
  instance: IncusInstance,
): Promise<IncusOperationResponse> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/instances/${instance.name}?project=${instance.project}`, {
      method: "DELETE",
    })
      .then(handleResponse)
      .then(resolve)
      .catch(reject);
  });
};

export const deleteInstanceBulk = (
  instances: IncusInstance[],
  eventQueue: EventQueue,
): Promise<PromiseSettledResult<void>[]> => {
  const results: PromiseSettledResult<void>[] = [];
  return new Promise((resolve) => {
    void Promise.allSettled(
      instances.map(async (instance) => {
        return await deleteInstance(instance)
          .then((operation) => {
            eventQueue.set(
              operation.metadata.id,
              () => pushSuccess(results),
              (msg) => pushFailure(results, msg),
              () => continueOrFinish(results, instances.length, resolve),
            );
          })
          .catch((e) => {
            pushFailure(results, e instanceof Error ? e.message : "");
            continueOrFinish(results, instances.length, resolve);
          });
      }),
    );
  });
};

export const connectInstanceExec = (
  name: string,
  project: string,
  payload: TerminalConnectPayload,
): Promise<IncusTerminal> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/instances/${name}/exec?project=${project}&wait=10`, {
      method: "POST",
      body: JSON.stringify({
        command: [payload.command],
        "wait-for-websocket": true,
        environment: payload.environment.reduce(
          (a, v) => ({ ...a, [v.key]: v.value }),
          {},
        ),
        interactive: true,
        group: payload.group,
        user: payload.user,
      }),
    })
      .then(handleResponse)
      .then((data: IncusTerminal) => resolve(data))
      .catch(reject);
  });
};

export const connectInstanceVga = (
  name: string,
  project: string,
): Promise<IncusTerminal> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/instances/${name}/console?project=${project}&wait=10`, {
      method: "POST",
      body: JSON.stringify({
        type: "vga",
        width: 0,
        height: 0,
      }),
    })
      .then(handleResponse)
      .then((data: IncusTerminal) => resolve(data))
      .catch(reject);
  });
};

export const connectInstanceConsole = (
  name: string,
  project: string,
): Promise<IncusTerminal> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/instances/${name}/console?project=${project}&wait=10`, {
      method: "POST",
      body: JSON.stringify({
        "wait-for-websocket": true,
        type: "console",
      }),
    })
      .then(handleResponse)
      .then((data: IncusTerminal) => resolve(data))
      .catch(reject);
  });
};

export const fetchInstanceConsoleBuffer = (
  name: string,
  project: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/instances/${name}/console?project=${project}`, {
      method: "GET",
    })
      .then(handleTextResponse)
      .then((data: string) => resolve(data))
      .catch(reject);
  });
};

export const fetchInstanceLogs = (
  name: string,
  project: string,
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/instances/${name}/logs?project=${project}`, {
      method: "GET",
    })
      .then(handleResponse)
      .then((data: IncusApiResponse<string[]>) => resolve(data.metadata))
      .catch(reject);
  });
};

export const fetchInstanceLogFile = (
  name: string,
  project: string,
  file: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/instances/${name}/logs/${file}?project=${project}`, {
      method: "GET",
    })
      .then(handleTextResponse)
      .then((data: string) => resolve(data))
      .catch(reject);
  });
};
