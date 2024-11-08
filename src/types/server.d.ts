import { IncusConfigPair } from "./config";

type IncusAuthMethods = "tls" | "oidc" | "unix";

type SupportedStorageDriver = {
  Name: string;
  Version: string;
  Remote: boolean;
};

export interface IncusSettings {
  api_status: string;
  config?: IncusConfigPair;
  environment?: {
    architectures: string[];
    os_name?: string;
    server_version?: string;
    server_clustered: boolean;
    storage_supported_drivers: SupportedStorageDriver[];
  };
  auth?: "trusted" | "untrusted";
  auth_methods?: IncusAuthMethods;
  auth_user_method?: IncusAuthMethods;
  auth_user_name?: string;
  api_extensions?: string[];
}
