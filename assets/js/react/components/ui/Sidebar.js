import * as React from "react";
import * as AntD from "antd";
import { SettingFilled } from "@ant-design/icons";
import { NameTag } from "./Badge";


/**
  * @param {{visible: boolean, onOpen: () => void; onClose: () => void, onAvatarEdit: () => void}} props
  *
 */
export const Sidebar = (props) => {
  return (
    <>
      <AntD.Space align="center" style={{height: "2rem"}}>
        <button onClick={props.onOpen}>
          <SettingFilled style={{ fontSize: "1.5rem" }} />
        </button>

        <button onClick={props.onAvatarEdit}>
          <NameTag name="Buster" />
        </button>
      </AntD.Space>

      <AntD.Drawer
        title="settings"
        placement="left"
        visible={props.visible}
        onClose={props.onClose}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ border: 0 }}
      >
      </AntD.Drawer>
    </>
  );

};
