import * as React from "react";
import * as AntD from "antd";
import { NameTag } from "./NameTag";

/** @type React.CSSProperties */
const smallHeading = {
  fontSize: "0.75rem",
  textTransform: "uppercase",
};

/**
 * @type {React.ComponentType<
 *   AntD.FormProps<any> & {
 *     onAvatarEdit: () => void;
 *     localPlayerName: string;
 *   }
 * >}
 */
export const SettingsModalBody = (props) => {
  return (
    <AntD.Form
      onValuesChange={props.onValuesChange}
      fields={props.fields}
    >
      <AntD.Divider orientation="left" style={{ margin: 0 }}>
        <span style={smallHeading}>lewks</span>
      </AntD.Divider>
      <AntD.Row style={{ margin: "1rem" }}>
        <AntD.Col flex="auto">
          <NameTag name={props.localPlayerName} />
        </AntD.Col>
        <AntD.Col>
          <AntD.Button type="text" onClick={props.onAvatarEdit}>
            edit
          </AntD.Button>
        </AntD.Col>
      </AntD.Row>
      <AntD.Divider orientation="left" style={{ margin: 0 }}>
        <span style={smallHeading}>show</span>
      </AntD.Divider>
      <AntD.Row style={{ margin: "1rem" }}>
        <AntD.Col flex="auto">
          <AntD.Form.Item
            label="Nametags"
            name="shouldShowNameTags"
            valuePropName="checked"
          >
            <AntD.Switch/>
          </AntD.Form.Item>
        </AntD.Col>
        <AntD.Col>
          <AntD.Typography.Text keyboard strong>
            n
          </AntD.Typography.Text>
        </AntD.Col>
      </AntD.Row>
      <AntD.Row style={{ margin: "1rem" }}>
        <AntD.Col flex="auto">
          <AntD.Form.Item
            label="On-screen controls"
            name="shouldShowVirtualGamePad"
            valuePropName="checked"
          >
            <AntD.Switch/>
          </AntD.Form.Item>
        </AntD.Col>
      </AntD.Row>
    </AntD.Form>
  );

};
