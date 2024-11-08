import parsePrometheusTextFormat from "parse-prometheus-text-format";
import { IncusMetricGroup } from "types/metrics";

export const fetchMetrics = (): Promise<IncusMetricGroup[]> => {
  return new Promise((resolve, reject) => {
    fetch("/1.0/metrics")
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        const json = parsePrometheusTextFormat(text);
        resolve(json);
      })
      .catch(reject);
  });
};
