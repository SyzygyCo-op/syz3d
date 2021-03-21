import * as React from "react";
import * as AntD from "antd";
import { NameTag } from "./NameTag";

/**
 * @type React.CSSProperties
 */
const smallHeading = {
  fontSize: "0.75rem",
  textTransform: "uppercase",
};

/**
  * @param {{ onAvatarEdit: () => void, localPlayerName: string }} props
 */
export const SettingsModalBody = (props) => {
  return (
    <>
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
    </>
  );
};
