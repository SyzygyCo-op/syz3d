import * as React from "react";
import { keyMap } from "../../../state";
import { Collapse } from "antd";
import { List } from "./List";
import { Typography } from "antd";
import {
  SettingFilled,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const nodeAddToHomeScreen = (
  <>
    <Title level={3}>install for better expirience on mobile!</Title>
    <p>Once installed, you can:</p>
    <List>
      <List.Item>access this game from your home screen</List.Item>
      <List.Item>use it in fullscreen, as it was meant to be</List.Item>
      <List.Item>see the fun app icon</List.Item>
    </List>
    <p>
      This is called a PWA (progressive Web app.) Once installed, it still
      actually runs in a Web browser, but with the appearance of a "native" app,
      like from the App Store. This game doesn't use any extra priveliges or
      permissions once installed, if you're concerned about that.
    </p>
    <Collapse>
      <Collapse.Panel key="Android" header="How to install on Android">
        <List ordered>
          <List.Item>
            Tap <Text strong>Add to home screen</Text>.
          </List.Item>
          <List.Item>Follow the on-screen instructions to install.</List.Item>
        </List>
      </Collapse.Panel>
      <Collapse.Panel key="iOS" header="How to install on iOS">
        <List ordered>
          <List.Item>
            Tap the share button in iOS (looks like{" "}
            <img
              src="/images/iOS-share-icon.png"
              alt="share button"
              style={{ height: "1em" }}
            />
            ), which should bring up a menu that looks like:
            <img
              src="/images/iOS_share_menu.jpg"
              alt="share menu"
              style={{ maxWidth: "100%", display: "inline-block" }}
            />
          </List.Item>
          <List.Item>
            Tap the <Text strong>Add to Home Screen</Text> option, and that
            should be it!
          </List.Item>
        </List>
      </Collapse.Panel>
    </Collapse>
  </>
);

const nodeControlsKeyboard = (
  <>
    <Title level={3}>keyboard</Title>
    <dl>
      {keyMap.getActions().map((actionName) => {
        return (
          <React.Fragment key={actionName}>
            <dt style={{float: "left"}}>{keyMap.getHumanReadableName(actionName)}</dt>
            <dd style={{float: "right"}}>
              {keyMap.getKeyNames(actionName).map((name, idx, ary) => <React.Fragment key={name}><Text keyboard>{name}</Text>{idx < ary.length -1 ? "," : ""}</React.Fragment>)}
            </dd>
            <br/>
          </React.Fragment>
        );
      })}
    </dl>
  </>
);

const nodeControlsMouse = (
  <>
    <Title level={3}>mouse</Title>
    <p>A left-click within the game locks the mouse so that it can be used to control the camera view. Left-click again to unlock.</p>
    <p><Text strong>Note:</Text> I've noticed an issue with the mouse when using Firefox. If it's acting weird for you, try another browser (like Chrome).</p>
  </>
);

const nodeControlsVirtualGamePad = (
  <>
    <Title level={3}>touchscreen controls</Title>
    <p>Handy for, and enabled by default, on mobile devices. Can be toggled in the <SettingFilled/> settings panel. Features two virtual joysticks, one for controlling the camera and the other for moving. Tap on the look/jump joystick to jump.</p>
  </>
);

/** @type React.FunctionComponent */
export const HelpModalBody = () => {
  return (
    <>
      <Title level={1}>controls</Title>
      {nodeControlsKeyboard}
      {nodeControlsMouse}
      {nodeControlsVirtualGamePad}
      <Title level={1}>tips</Title>
      {nodeAddToHomeScreen}
    </>
  );
};
