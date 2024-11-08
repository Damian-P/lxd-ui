import { FC, KeyboardEvent } from "react";
import { IncusInstance } from "types/instance";
import {
  ActionButton,
  Button,
  Form,
  Modal,
  Select,
} from "@canonical/react-components";
import * as Yup from "yup";
import { useFormik } from "formik";
import { IncusClusterMember } from "types/cluster";

interface Props {
  close: () => void;
  migrate: (target: string) => void;
  instance: IncusInstance;
  members: IncusClusterMember[];
}

const MigrateInstanceForm: FC<Props> = ({
  close,
  migrate,
  instance,
  members,
}) => {
  const memberNames = members.map((member) => member.server_name).sort();

  const MigrateSchema = Yup.object().shape({
    target: Yup.string().min(1, "This field is required"),
  });

  const formik = useFormik({
    initialValues: {
      target: memberNames.find((member) => member !== instance.location) ?? "",
    },
    validationSchema: MigrateSchema,
    onSubmit: (values) => {
      migrate(values.target);
    },
  });

  const handleEscKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") {
      close();
    }
  };

  return (
    <Modal
      close={close}
      className="migrate-instance-modal"
      title={`Migrate instance ${instance.name}`}
      buttonRow={
        <>
          <Button
            className="u-no-margin--bottom"
            type="button"
            aria-label="cancel migrate"
            appearance="base"
            onClick={close}
          >
            Cancel
          </Button>
          <ActionButton
            appearance="positive"
            className="u-no-margin--bottom"
            onClick={() => void formik.submitForm()}
            disabled={!formik.isValid}
          >
            Migrate
          </ActionButton>
        </>
      }
      onKeyDown={handleEscKey}
    >
      <Form onSubmit={formik.handleSubmit}>
        <Select
          id="locationMember"
          label="Move instance to cluster member"
          onChange={(e) => void formik.setFieldValue("target", e.target.value)}
          value={formik.values.target}
          options={memberNames.map((member) => {
            return {
              label: member,
              value: member,
              disabled: member === instance.location,
            };
          })}
        />
      </Form>
    </Modal>
  );
};

export default MigrateInstanceForm;
