import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Row } from "@canonical/react-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createInstanceFromJson,
  fetchInstance,
  updateInstanceFromJson,
} from "../api/instances";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../util/queryKeys";
import SubmitButton from "../buttons/SubmitButton";
import { load as loadYaml, dump as dumpYaml } from "js-yaml";
import PanelHeader from "../components/PanelHeader";
import NotificationRow from "../components/NotificationRow";
import Aside from "../components/Aside";
import useNotification from "../util/useNotification";
import YamlEditor from "@focus-reactive/react-yaml";
import usePanelParams from "../util/usePanelParams";

const InstanceFormYaml: FC = () => {
  const navigate = useNavigate();
  const notify = useNotification();
  const panelParams = usePanelParams();
  const queryClient = useQueryClient();

  const yamlToJson = (yamlString: string): string => {
    const json = loadYaml(yamlString.trim());
    return JSON.stringify(json);
  };

  const InstanceSchema = Yup.object().shape({
    instanceYaml: Yup.string().required("This field is required"),
  });

  const initialYaml = "\n\n";

  const formik = useFormik({
    initialValues: {
      instanceYaml: initialYaml,
    },
    validationSchema: InstanceSchema,
    onSubmit: (values) => {
      if (values.instanceYaml.trim() === "") {
        formik.setSubmitting(false);
        return notify.failure(
          "",
          new Error("Please enter a valid YAML configuration.")
        );
      }
      const instanceJson = yamlToJson(values.instanceYaml);
      const mutation = panelParams.instance
        ? updateInstanceFromJson
        : createInstanceFromJson;
      mutation(instanceJson)
        .then(() => {
          void queryClient.invalidateQueries({
            queryKey: [queryKeys.instances],
          });
          navigate("/instances");
        })
        .catch((e) => {
          formik.setSubmitting(false);
          notify.failure("Error on instance configuration save.", e);
        });
    },
  });

  const { data: instance } = useQuery({
    queryKey: [queryKeys.instances, panelParams.instance],
    queryFn: () => fetchInstance(panelParams.instance ?? "", 0),
    enabled: panelParams.instance !== null && panelParams.instance !== "",
  });

  if (formik.values.instanceYaml === initialYaml && instance) {
    const yaml = dumpYaml(instance);
    void formik.setFieldValue("instanceYaml", yaml);
  }

  return (
    <Aside width="wide">
      <div className="p-panel">
        <PanelHeader
          title={
            <h4>
              {panelParams.instance
                ? `Edit instance configuration for ${panelParams.instance}`
                : "Create instance from YAML configuration"}
            </h4>
          }
        />
        <NotificationRow notify={notify} />
        <Row>
          <Form onSubmit={formik.handleSubmit} stacked>
            <div className="p-instance-yaml">
              <YamlEditor
                // using the instance name as a key to force a remount of the component
                // (it won't update otherwise)
                key={instance ? `update-${instance.name}` : "create"}
                text={formik.values.instanceYaml}
                onChange={({ text }) =>
                  void formik.setValues({ instanceYaml: text })
                }
              />
            </div>
            <Row className="u-align--right">
              <Col size={12}>
                <Button onClick={() => navigate("/instances")} type="button">
                  Cancel
                </Button>
                <SubmitButton
                  isSubmitting={formik.isSubmitting}
                  isDisabled={!formik.isValid}
                  buttonLabel={
                    panelParams.instance ? "Update instance" : "Create instance"
                  }
                />
              </Col>
            </Row>
          </Form>
        </Row>
      </div>
    </Aside>
  );
};

export default InstanceFormYaml;