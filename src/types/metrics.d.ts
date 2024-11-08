export interface IncusMetricGroup {
  name: string;
  help: string;
  type: string;
  metrics: IncusMetric[];
}

export interface IncusMetric {
  value: number;
  labels: {
    name: string;
    mountpoint?: string;
    project: string;
    type: string;
  };
}
