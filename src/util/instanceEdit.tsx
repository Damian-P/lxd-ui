import { IncusProfile } from "types/profile";
import { IncusInstance } from "types/instance";
import { formDeviceToPayload, parseDevices } from "util/formDevices";
import { parseCpuLimit, parseMemoryLimit } from "util/limits";
import { getInstanceConfigKeys } from "util/instanceConfigFields";
import { instanceEditDetailPayload } from "pages/instances/forms/EditInstanceDetails";
import { resourceLimitsPayload } from "components/forms/ResourceLimitsForm";
import { securityPoliciesPayload } from "components/forms/SecurityPoliciesForm";
import { snapshotsPayload } from "components/forms/InstanceSnapshotsForm";
import { cloudInitPayload } from "components/forms/CloudInitForm";
import { getUnhandledKeyValues } from "util/formFields";
import { EditInstanceFormValues } from "pages/instances/EditInstance";
import * as Yup from "yup";
import { EditProfileFormValues } from "pages/profiles/EditProfile";
import { migrationPayload } from "components/forms/MigrationForm";

const getEditValues = (
  item: IncusProfile | IncusInstance,
): Omit<EditProfileFormValues, "entityType" | "readOnly"> => {
  return {
    name: item.name,
    description: item.description,

    devices: parseDevices(item.devices),

    limits_cpu: parseCpuLimit(item.config["limits.cpu"]),
    limits_memory: parseMemoryLimit(item.config["limits.memory"]),
    limits_memory_swap: item.config["limits.memory.swap"],
    limits_disk_priority: item.config["limits.disk.priority"]
      ? parseInt(item.config["limits.disk.priority"])
      : undefined,
    limits_processes: item.config["limits.processes"]
      ? parseInt(item.config["limits.processes"])
      : undefined,

    security_protection_delete: item.config["security.protection.delete"],
    security_privileged: item.config["security.privileged"],
    security_nesting: item.config["security.nesting"],
    security_protection_shift: item.config["security.protection.shift"],
    security_idmap_base: item.config["security.idmap.base"],
    security_idmap_size: item.config["security.idmap.size"]
      ? parseInt(item.config["security.idmap.size"])
      : undefined,
    security_idmap_isolated: item.config["security.idmap.isolated"],
    security_guestapi: item.config["security.guestapi"],
    security_guestapi_images: item.config["security.guestapi.images"],
    security_secureboot: item.config["security.secureboot"],

    snapshots_pattern: item.config["snapshots.pattern"],
    snapshots_expiry: item.config["snapshots.expiry"],
    snapshots_schedule: item.config["snapshots.schedule"],
    snapshots_schedule_stopped: item.config["snapshots.schedule.stopped"],

    migration_stateful: item.config["migration.stateful"],

    cloud_init_network_config: item.config["cloud-init.network-config"],
    cloud_init_user_data: item.config["cloud-init.user-data"],
    cloud_init_vendor_data: item.config["cloud-init.vendor-data"],
  };
};

export const getInstanceEditValues = (
  instance: IncusInstance,
): EditInstanceFormValues => {
  return {
    instanceType: instance.type,
    profiles: instance.profiles,
    location: instance.location,
    readOnly: true,
    entityType: "instance",
    ...getEditValues(instance),
  };
};

export const getProfileEditValues = (
  profile: IncusProfile,
): EditProfileFormValues => {
  return {
    readOnly: true,
    entityType: "profile",
    ...getEditValues(profile),
  };
};

export const getInstancePayload = (
  instance: IncusInstance,
  values: EditInstanceFormValues,
) => {
  const handledConfigKeys = getInstanceConfigKeys();
  const handledKeys = new Set([
    "name",
    "description",
    "type",
    "profiles",
    "devices",
    "config",
  ]);

  return {
    ...instanceEditDetailPayload(values),
    devices: formDeviceToPayload(values.devices),
    config: {
      ...resourceLimitsPayload(values),
      ...securityPoliciesPayload(values),
      ...snapshotsPayload(values),
      ...migrationPayload(values),
      ...cloudInitPayload(values),
      ...getUnhandledKeyValues(instance.config, handledConfigKeys),
    },
    ...getUnhandledKeyValues(instance, handledKeys),
  };
};

export const InstanceEditSchema: Yup.ObjectSchema<{
  name: string;
  instanceType: string;
}> = Yup.object().shape({
  name: Yup.string().required("Instance name is required"),
  instanceType: Yup.string().required("Instance type is required"),
});
