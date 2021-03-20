import * as AntD from "antd";
import Draggable from "react-draggable";
import * as React from "react";
import { DragOutlined } from "@ant-design/icons";

/**
 * @type React.ComponentType<AntD.ModalProps>
 */
export const DraggableModal = (props) => {
  const [bounds, setBounds] = React.useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const [disabled, setDisabled] = React.useState(true);

  const draggleRef = React.useRef(null);

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    setBounds({
      left: -targetRect?.left + uiData?.x,
      right: clientWidth - (targetRect?.right - uiData?.x),
      top: -targetRect?.top + uiData?.y,
      bottom: clientHeight - (targetRect?.bottom - uiData?.y),
    });
  };

  return (
    <AntD.Modal
      {...props}
      centered={false}
      title={
        <div
          style={{
            width: "100%",
            cursor: "move",
          }}
          onMouseOver={() => {
            setDisabled(false);
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
          // fix eslintjsx-a11y/mouse-events-have-key-events
          // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
          onFocus={() => {}}
          onBlur={() => {}}
          // end
        >
          <AntD.Space>
            <DragOutlined />
            {props.title}
          </AntD.Space>
        </div>
      }
      modalRender={(modal) => (
        <Draggable disabled={disabled} bounds={bounds} onStart={onStart}>
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
    >
      {props.children}
    </AntD.Modal>
  );
};
