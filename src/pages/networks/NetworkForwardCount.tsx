import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "util/queryKeys";
import { IncusNetwork } from "types/network";
import { fetchNetworkForwards } from "api/network-forwards";

interface Props {
  network: IncusNetwork;
  project: string;
}

const NetworkForwardCount: FC<Props> = ({ network, project }) => {
  if (network.managed === false || (network.type != "bridge" && network.type != "ovn")) {
    return <>-</>;
  }

  const { data: forwards = [], isLoading } = useQuery({
    queryKey: [
      queryKeys.projects,
      project,
      queryKeys.networks,
      network,
      queryKeys.forwards,
      project,
    ],
    queryFn: () => fetchNetworkForwards(network.name, project),
  });

  return <>{isLoading ? "" : forwards.length}</>;
};

export default NetworkForwardCount;
