import { IncusConfigPair } from "types/config";

export interface IncusProject {
  name: string;
  config: IncusConfigPair;
  description: string;
  used_by?: string[];
  etag?: string;
}
