import * as React from "react";
import * as AntD from "antd";
import { Asset3D } from "../../../state";

/**
 * @type {React.ComponentType<
     *   AntD.FormProps<any> & { validating: boolean, avatars: Asset3D[] }
 * >}
 */
export const AvatarForm = (props) => {
  const { validating, avatars, ...restProps } = props;

  return (
    <>
      <AntD.Form {...restProps}>
        <AntD.Form.Item
          label="name"
          name="label"
          hasFeedback={validating}
          validateStatus={validating ? "validating" : null}
          rules={[{ required: true, message: "You gotta have a name!" }]}
        >
          <AntD.Input placeholder="Samuel L Jackson" type="text" />
        </AntD.Form.Item>
        <AntD.Form.Item label="avatar" name="visible_gltf_url">
          <AntD.Radio.Group size="large">
            {avatars.map(({ previewImageUrl, assetUrl }) => {
              return (
                <AntD.Radio.Button value={assetUrl} key={assetUrl}>
                  <img style={{ maxHeight: "100%" }} src={previewImageUrl} />
                </AntD.Radio.Button>
              );
            })}
          </AntD.Radio.Group>
        </AntD.Form.Item>
      </AntD.Form>
    </>
  );
};
