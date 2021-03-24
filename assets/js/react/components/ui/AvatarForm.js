import * as React from "react";
import * as AntD from "antd";
import { ImageCarousel } from "./ImageCarousel";

/**
 * @type {React.ComponentType<
 *   AntD.FormProps<any> & { validating: boolean }
 * >}
 */
export const AvatarForm = (props) => {
  const { validating, ...restProps } = props;

  const carouselRef = React.useRef();

  const textures = ["/images/water_texture.jpg", "/images/lava_texture.jpg"];

  React.useEffect(() => {
    if (carouselRef.current) {
      /** @type {{goTo: any}} */
      const carousel = carouselRef.current;
      const index = textures.indexOf(props.initialValues.texture);
      carousel.goTo(index > -1 ? index : 0);
    }
  }, [props.initialValues.texture]);

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
      </AntD.Form>
      <ImageCarousel
        ref={carouselRef}
        images={textures}
        afterChange={handleChangeTexture}
      />
    </>
  );

  /** @param {number} index */
  function handleChangeTexture(index) {
    props.onValuesChange({ texture: textures[index] });
  }
};
