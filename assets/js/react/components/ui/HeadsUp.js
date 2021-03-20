import * as React from "react";
import * as AntD from "antd";
import { SettingFilled } from "@ant-design/icons";
import { NameTag } from "./NameTag";


/**
  * @param {{onAvatarEdit: () => void, onSettingsOpen: () => void}} props
  *
 */
export const HeadsUp = (props) => {
  return (
    <>
      <AntD.Space align="center" style={{height: "2rem"}}>
        <button onClick={props.onSettingsOpen}>
          <SettingFilled style={{ fontSize: "1.5rem" }} />
        </button>

        <button onClick={props.onAvatarEdit}>
          <NameTag name="Buster" />
        </button>
      </AntD.Space>
    </>
  );

};
