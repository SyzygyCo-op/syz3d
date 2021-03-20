import * as React from "react";
import * as AntD from "antd";

/** @type {React.ComponentType<AntD.FormProps | {validating: boolean}>} */
export const AvatarForm = (props) => {
  const { validating, ...restProps } = props;
  return (
    <AntD.Form {...restProps}>
      <AntD.Form.Item
        label="name"
        name="player_name"
        hasFeedback={validating}
        validateStatus={validating ? "validating" : null}
        rules={[{ required: true, message: "You gotta have a name!" }]}
      >
        <AntD.Input placeholder="Samuel L Jackson" type="text" />
      </AntD.Form.Item>
    </AntD.Form>
  );
};
