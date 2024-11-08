import { FC, ReactNode } from "react";
import { Button, ButtonProps } from "@canonical/react-components";
import usePortal from "react-useportal";
import CustomVolumeModal from "pages/storage/CustomVolumeModal";
import { IncusStorageVolume } from "types/storage";

interface Props {
  children: ReactNode;
  buttonProps?: ButtonProps;
  project: string;
  setValue: (volume: IncusStorageVolume) => void;
}

const CustomVolumeSelectBtn: FC<Props> = ({
  children,
  buttonProps,
  project,
  setValue,
}) => {
  const { openPortal, closePortal, isOpen, Portal } = usePortal();

  const handleCancel = () => closePortal();

  const handleFinish = (volume: IncusStorageVolume) => {
    setValue(volume);
    closePortal();
  };

  return (
    <>
      <Button onClick={openPortal} type="button" hasIcon {...buttonProps}>
        {children}
      </Button>
      {isOpen && (
        <Portal>
          <CustomVolumeModal
            project={project}
            onFinish={handleFinish}
            onCancel={handleCancel}
          />
        </Portal>
      )}
    </>
  );
};

export default CustomVolumeSelectBtn;
