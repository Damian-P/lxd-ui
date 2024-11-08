import { getProfileConfigKeys } from "util/instanceConfigFields";
import { profileDetailPayload } from "pages/profiles/forms/ProfileDetailsForm";
import { formDeviceToPayload } from "util/formDevices";
import { resourceLimitsPayload } from "components/forms/ResourceLimitsForm";
import { securityPoliciesPayload } from "components/forms/SecurityPoliciesForm";
import { snapshotsPayload } from "components/forms/InstanceSnapshotsForm";
import { cloudInitPayload } from "components/forms/CloudInitForm";
import { getUnhandledKeyValues } from "util/formFields";
import { EditProfileFormValues } from "pages/profiles/EditProfile";
import { IncusProfile } from "types/profile";
import { migrationPayload } from "components/forms/MigrationForm";

export const getProfilePayload = (
  profile: IncusProfile,
  values: EditProfileFormValues,
) => {
  const handledConfigKeys = getProfileConfigKeys();
  const handledKeys = new Set(["name", "description", "devices", "config"]);

  return {
    ...profileDetailPayload(values),
    devices: formDeviceToPayload(values.devices),
    config: {
      ...resourceLimitsPayload(values),
      ...securityPoliciesPayload(values),
      ...snapshotsPayload(values),
      ...migrationPayload(values),
      ...cloudInitPayload(values),
      ...getUnhandledKeyValues(profile.config, handledConfigKeys),
    },
    ...getUnhandledKeyValues(profile, handledKeys),
  };
};
