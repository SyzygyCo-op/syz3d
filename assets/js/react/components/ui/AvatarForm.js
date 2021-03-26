import * as React from "react";
import * as AntD from "antd";

/**
 * @type {React.ComponentType<
 *   AntD.FormProps<any> & { validating: boolean }
 * >}
 */
export const AvatarForm = (props) => {
  const { validating, ...restProps } = props;

  const textures = ["/images/water_texture.jpg", "/images/lava_texture.jpg"];

  return (
    <>
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
        <AntD.Form.Item label="texture" name="texture">
          <AntD.Radio.Group size="large">
            {textures.map((imageUrl) => {
              return (
                <AntD.Radio.Button value={imageUrl}>
                  <img style={{ maxHeight: "100%" }} src={imageUrl} />
                </AntD.Radio.Button>
              );
            })}
          </AntD.Radio.Group>
        </AntD.Form.Item>
      </AntD.Form>
    </>
  );
};
