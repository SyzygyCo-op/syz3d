import * as React from "react";
import * as AntD from "antd";
import { CarouselRef } from "antd/es/carousel";

/**
 * @type {React.ComponentType<
 *   AntD.CarouselProps & { images: string[]; ref: React.Ref<CarouselRef> }
 * >}
 */
export const ImageCarousel = React.forwardRef((props, ref) => {
  const { images, ...restProps } = props;
  /**
   * @type React.CSSProperties
   */
  const contentStyle = {
    height: "160px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  return (
    <AntD.Carousel
      {...restProps}
      ref={ref}
      customPaging={(i) => {
        return (
          <a>
            <img src={images[i]} />
          </a>
        );
      }}
      dots={{ className: "ImageCarousel_dots" }}
      infinite
      slidesToShow={1}
      slidesToScroll={1}
    >
      {images.map((imageUrl) => {
        return (
          <div key={imageUrl}>
            <div style={contentStyle}>
              <img style={{ maxHeight: "100%" }} src={imageUrl} />
            </div>
          </div>
        );
      })}
    </AntD.Carousel>
  );
});
