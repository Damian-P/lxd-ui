import { FC } from "react";
import { getIpAddresses } from "util/networks";
import { IncusInstance } from "types/instance";
import ExpandableList from "components/ExpandableList";

interface Props {
  instance: IncusInstance;
  family: "inet" | "inet6";
}

const InstanceIps: FC<Props> = ({ instance, family }) => {
  const addresses = getIpAddresses(instance, family);
  return addresses.length ? (
    <ExpandableList
      items={addresses.map((item) => (
        <div
          key={item.address}
          className="ip u-truncate"
          title={`IP ${item.address} (${item.iface})`}
        >
          {item.address} ({item.iface})
        </div>
      ))}
    />
  ) : (
    <>-</>
  );
};

export default InstanceIps;
