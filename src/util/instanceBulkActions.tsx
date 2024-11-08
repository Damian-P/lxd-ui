import {
  IncusInstance,
  IncusInstanceAction,
  IncusInstanceStatus,
} from "types/instance";
import { InstanceBulkAction } from "api/instances";

// map desired actions to pairs of instance status and performed action
// statuses missing will be ignored
const actionsToPerform: Partial<
  Record<
    IncusInstanceAction,
    Partial<Record<IncusInstanceStatus, IncusInstanceAction>>
  >
> = {
  start: {
    Frozen: "unfreeze",
    Stopped: "start",
  },
  restart: {
    Freezing: "restart",
    Running: "restart",
  },
  freeze: {
    Running: "freeze",
  },
  stop: {
    Freezing: "stop",
    Running: "stop",
    Starting: "stop",
    Frozen: "stop",
  },
};

export const instanceAction = (
  desiredAction: IncusInstanceAction,
  currentState: IncusInstanceStatus,
): IncusInstanceAction | undefined => {
  const actionMap = actionsToPerform[desiredAction];
  return actionMap ? actionMap[currentState] : undefined;
};

export const instanceActions = (
  instances: IncusInstance[],
  desiredAction: IncusInstanceAction,
): InstanceBulkAction[] => {
  const actions: InstanceBulkAction[] = [];
  instances.forEach((instance) => {
    const action = instanceAction(desiredAction, instance.status);
    if (action) {
      actions.push({
        name: instance.name,
        project: instance.project,
        action: action,
      });
    }
  });
  return actions;
};

export const instanceActionLabel = (action: IncusInstanceAction): string => {
  return {
    unfreeze: "started",
    start: "started",
    restart: "restarted",
    freeze: "frozen",
    stop: "stopped",
  }[action];
};

export const pluralize = (item: string, count: number): string => {
  const isSingular = count === 1;

  if (isSingular) {
    return item;
  }

  if (item.includes("identity")) {
    return item.replace("identity", "identities");
  }

  return `${item}s`;
};

export const statusLabel = (status: IncusInstanceStatus): string | undefined => {
  const statusToLabel: Partial<Record<IncusInstanceStatus, string>> = {
    Frozen: "frozen",
    Stopped: "stopped",
    Running: "running",
  };
  return statusToLabel[status];
};
