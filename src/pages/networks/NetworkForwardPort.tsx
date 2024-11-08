import { FC } from "react";
import { IncusNetworkForwardPort } from "types/network";

interface Props {
  port: IncusNetworkForwardPort;
}

const NetworkForwardPort: FC<Props> = ({ port }) => {
  const targetPort =
    port.target_port && port.target_port.length > 0
      ? port.target_port
      : port.listen_port;

  const rightArrow = String.fromCharCode(8594);
  const caption = `:${port.listen_port} ${rightArrow} ${port.target_address}:${targetPort} (${port.protocol})`;

  return (
    <div className="u-truncate" title={caption}>
      {caption}
    </div>
  );
};

export default NetworkForwardPort;
