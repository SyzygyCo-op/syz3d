import * as React from "react";
import * as AntD from "antd";

/**
 * @param {React.PropsWithChildren<AntD.DrawerProps>} props
 */
export const Drawer = (props) => {
  return (
    <AntD.Drawer
      {...props}
      headerStyle={{ border: 0 }}
      getContainer={false}
    >
      {props.children}
    </AntD.Drawer>
  );
};
