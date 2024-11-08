export type IncusOperationStatus =
  | "Cancelled"
  | "Failure"
  | "Running"
  | "Success";

export interface IncusOperation {
  class: string;
  created_at: string;
  description: string;
  err: string;
  id: string;
  location: string;
  metadata?: Record<string, string>;
  may_cancel: boolean;
  resources?: {
    instances?: string[];
  };
  status: IncusOperationStatus;
  status_code: string;
  updated_at: string;
}

export interface IncusOperationResponse {
  operation: string;
  metadata: IncusOperation;
}

export interface IncusOperationList {
  failure?: IncusOperation[];
  running?: IncusOperation[];
  success?: IncusOperation[];
}
