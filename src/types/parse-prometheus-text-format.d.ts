declare module "parse-prometheus-text-format" {
  import { IncusMetricGroup } from "./metrics";

  function parsePrometheusTextFormat(input: string): IncusMetricGroup[];
  export = parsePrometheusTextFormat;
}
