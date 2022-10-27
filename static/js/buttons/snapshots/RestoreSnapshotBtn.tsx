import React, { FC, useState } from "react";
import { LxdInstance, LxdSnapshot } from "../../types/instance";
import { restoreSnapshot } from "../../api/snapshots";

type Props = {
  instance: LxdInstance;
  snapshot: LxdSnapshot;
  onSuccess: Function;
  onFailure: Function;
};

const RestoreSnapshotBtn: FC<Props> = ({
  instance,
  snapshot,
  onSuccess,
  onFailure,
}) => {
  const [isLoading, setLoading] = useState(false);

  const handleRestore = () => {
    setLoading(true);
    restoreSnapshot(instance, snapshot)
      .then(() => {
        setLoading(false);
        onSuccess();
      })
      .catch(() => {
        setLoading(false);
        onFailure("Error on snapshot restore.");
      });
  };

  return (
    <button onClick={handleRestore} className="is-dense">
      <i
        className={
          isLoading ? "p-icon--spinner u-animation--spin" : "p-icon--export"
        }
      >
        Restore
      </i>
    </button>
  );
};

export default RestoreSnapshotBtn;