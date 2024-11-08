export interface IncusApiResponse<T> {
  metadata: T;
}

export interface IncusSyncResponse<T> {
  type: "sync";
  status: string;
  status_code: number;
  error_code: number;
  error: string;
  metadata: T;
}
