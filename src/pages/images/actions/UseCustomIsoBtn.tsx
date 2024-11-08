import { FC } from "react";
import { Button } from "@canonical/react-components";
import usePortal from "react-useportal";
import { IncusImageType, RemoteImage } from "types/image";
import CustomIsoModal from "pages/images/CustomIsoModal";

interface Props {
  onSelect: (image: RemoteImage, type?: IncusImageType) => void;
}

const UseCustomIsoBtn: FC<Props> = ({ onSelect }) => {
  const { openPortal, closePortal, isOpen, Portal } = usePortal();

  const handleSelect = (image: RemoteImage, type?: IncusImageType) => {
    closePortal();
    onSelect(image, type);
  };

  return (
    <>
      <Button
        appearance="link"
        onClick={openPortal}
        type="button"
        id="select-custom-iso"
      >
        <span>Use custom ISO</span>
      </Button>
      {isOpen && (
        <Portal>
          <CustomIsoModal onClose={closePortal} onSelect={handleSelect} />
        </Portal>
      )}
    </>
  );
};

export default UseCustomIsoBtn;
