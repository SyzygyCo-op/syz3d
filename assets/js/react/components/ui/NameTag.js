import * as React from "react";
import * as AntD from "antd";
import { SmileOutlined } from "@ant-design/icons";

export const NameTag = ({ name }) => {
  return (
    <AntD.Space>
      <SmileOutlined style={{ fontSize: "1.5rem" }} />
      {name}
    </AntD.Space>
  );
};
