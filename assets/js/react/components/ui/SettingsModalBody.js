import * as React from "react";
import * as AntD from "antd";
import { NameTag } from "./NameTag";
import {
  HeartTwoTone,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";
import { uiFullScreen } from "../../../state";

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
    <AntD.Form onValuesChange={props.onValuesChange} fields={props.fields}>
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
            <AntD.Switch />
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
            label="touchscreen controls"
            name="shouldShowVirtualGamePad"
            valuePropName="checked"
          >
            <AntD.Switch />
          </AntD.Form.Item>
        </AntD.Col>
      </AntD.Row>
      <AntD.Row style={{ margin: "1rem" }}>
        <AntD.Col flex="auto">
          <AntD.Form.Item
            label="3rd person view"
            name="shouldUse3rdPersonCamera"
            valuePropName="checked"
          >
            <AntD.Switch />
          </AntD.Form.Item>
        </AntD.Col>
      </AntD.Row>
      <AntD.Row style={{ margin: "1rem" }}>
        <AntD.Button onClick={toggleFullScreen}>
          {uiFullScreen.isActive ? (
            <FullscreenExitOutlined />
          ) : (
            <FullscreenOutlined />
          )}
        </AntD.Button>
      </AntD.Row>
      <p style={{ textAlign: "center" }}>
        Made with <HeartTwoTone twoToneColor="#000" /> in my nest.
      </p>
      <p style={{ textAlign: "center" }}>
        No animals were harmed in the making of this game.
      </p>
    </AntD.Form>
  );

  function toggleFullScreen() {
    uiFullScreen.toggle();
  }
};
