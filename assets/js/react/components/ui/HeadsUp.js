import * as React from "react";
import * as AntD from "antd";
import {
  SettingFilled,
  ReloadOutlined,
  QuestionCircleFilled,
} from "@ant-design/icons";
import { NameTag } from "./NameTag";
import { zIndexes } from "../../../state/UILayering";

/**
 * @param {{
 *   onAvatarEdit: () => void;
 *   onSettingsOpen: () => void;
 *   onHelpOpen: () => void;
 *   localPlayerName: string;
 * }} props
 */
export const HeadsUp = (props) => {
  return (
    <AntD.Space
      align="center"
      style={{
        height: "2rem",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: zIndexes.headsUp,
      }}
    >
      <button onClick={props.onSettingsOpen}>
        <SettingFilled style={{ fontSize: "1.5rem" }} />
      </button>

      <button onClick={props.onHelpOpen}>
        <QuestionCircleFilled style={{ fontSize: "1.5rem" }} />
      </button>

      <button onClick={props.onAvatarEdit}>
        <NameTag name={props.localPlayerName} />
      </button>

      {process.env.NODE_ENV === "development" && (
        <button onClick={reloadPage}>
          <ReloadOutlined />
        </button>
      )}
    </AntD.Space>
  );

  function reloadPage() {
    location.reload();
  }
};
