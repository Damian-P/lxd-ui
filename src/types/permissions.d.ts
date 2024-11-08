export interface IncusIdentity {
  id: string; // fingerprint for tls and email for oidc
  type: string;
  name: string;
  authentication_method: "tls" | "oidc";
  groups?: string[] | null;
  effective_groups?: string[];
  effective_permissions?: IncusPermission[];
}

export interface IncusGroup {
  name: string;
  description: string;
  permissions?: IncusPermission[];
  identities?: {
    oidc?: string[];
    tls?: string[];
  };
  identity_provider_groups?: string[];
}

export interface IncusPermission {
  entity_type: string;
  url: string;
  entitlement: string;
  groups?: IncusGroup[];
}

export interface IdpGroup {
  name: string;
  groups: string[]; // these should be names of incus groups
}
