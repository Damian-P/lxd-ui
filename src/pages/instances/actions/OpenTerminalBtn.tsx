import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { IncusInstance } from "types/instance";
import { Button, Icon } from "@canonical/react-components";

interface Props {
  instance: IncusInstance;
}

const OpenTerminalBtn: FC<Props> = ({ instance }) => {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(
      `/ui/project/${instance.project}/instance/${instance.name}/terminal`,
    );
  };

  const isDisabled = instance.status !== "Running";

  return (
    <Button
      appearance="base"
      dense
      hasIcon
      onClick={handleOpen}
      disabled={isDisabled}
      title="Terminal"
      aria-label="Open Terminal"
    >
      <Icon name="code" />
    </Button>
  );
};

export default OpenTerminalBtn;
