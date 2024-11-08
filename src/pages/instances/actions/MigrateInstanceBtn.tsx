import { FC } from "react";
import { Button, Icon } from "@canonical/react-components";
import MigrateInstanceForm from "pages/instances/MigrateInstanceForm";
import usePortal from "react-useportal";
import { migrateInstance } from "api/instances";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "util/queryKeys";
import { fetchClusterMembers } from "api/cluster";
import Loader from "components/Loader";
import { useEventQueue } from "context/eventQueue";
import ItemName from "components/ItemName";
import { useToastNotification } from "context/toastNotificationProvider";

interface Props {
  instance: IncusInstance;
}

const MigrateInstanceBtn: FC<Props> = ({ instance }) => {
  const eventQueue = useEventQueue();
  const toastNotify = useToastNotification();
  const { openPortal, closePortal, isOpen, Portal } = usePortal();
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: [queryKeys.cluster, queryKeys.members],
    queryFn: fetchClusterMembers,
  });

  if (isLoading) {
    return <Loader />;
  }

  const handleSuccess = (newTarget: string) => {
    toastNotify.success(
      <>
        Migration finished for instance{" "}
        <ItemName item={{ name: instance.name }} bold />
      </>,
    );
    void queryClient.invalidateQueries({
      queryKey: [queryKeys.instances, instance],
    });
  };

  const notifyFailure = (e: unknown) => {
    toastNotify.failure(`Migration failed on instance ${instance.name}`, e);
  };

  const handleFailure = (msg: string) => {
    notifyFailure(new Error(msg));
    void queryClient.invalidateQueries({
      queryKey: [queryKeys.instances, instance],
    });
  };

  const handleMigrate = (target: string) => {
    migrateInstance(instance, target)
      .then((operation) => {
        eventQueue.set(
          operation.metadata.id,
          () => handleSuccess(target),
          handleFailure,
        );
        toastNotify.info(`Migration started for instance ${instance.name}`);
        closePortal();
      })
      .catch((e) => {
        notifyFailure(e);
        closePortal();
      });
  };

  return (
    <>
      {isOpen && (
        <Portal>
          <MigrateInstanceForm
            close={closePortal}
            migrate={handleMigrate}
            instance={instance}
            members={members}
          />
        </Portal>
      )}
      <Button
        appearance="base"
        loading={isLoading}
        className="has-icon is-dense"
        onClick={openPortal}
      >
        <Icon name="connected" />
      </Button>
    </>
  );
};

export default MigrateInstanceBtn;
