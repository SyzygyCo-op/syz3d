import * as React from "react";
import { observer } from "mobx-react-lite";
import { Canvas, invalidate } from "@react-three/fiber";
import * as UI from "./ui";
import { ObservableState, avatars, userSettings, uiFullScreen } from "../../state";
import { gameLoop, world } from "../../world";
import { Scene } from "./Scene";
import { AdaptiveDpr, AdaptiveEvents, Preload } from "@react-three/drei";
import { CameraSystem } from "../../systems";
import { CollisionHelper } from "./CollisionHelper";
import { mapStateToFields } from "./ui/Form";
import { VirtualGamePad } from "./ui/VirtualGamePad";
import { zIndexes } from "../../state/UILayering";
import { Modal } from 'antd';
import { HelpModalBody } from './ui/HelpModalBody';
import { WelcomeModalBody } from './ui/WelcomeModalBody';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

const invalidateOnTick = () => invalidate();

export const ReactApp = observer(
  /** @param {{ state: ObservableState }} props */
  ({ state }) => {
    gameLoop.useTick(invalidateOnTick);

    const camera = world.getSystem(CameraSystem).camera;

    // TODO use static field?
    const settingsFields = mapStateToFields(userSettings, [
      "shouldShowNameTags",
      "shouldShowVirtualGamePad",
      "shouldUse3rdPersonCamera"
    ]);

    const fullScreenElementRef = React.useCallback((element) => {
      uiFullScreen.setElement(element)
    }, [uiFullScreen])

    return (
      <ErrorBoundary>
        <main ref={fullScreenElementRef}>
          <UI.HeadsUp
            onAvatarEdit={handleAvatarEdit}
            onSettingsOpen={handleSettingsOpen}
            onHelpOpen={handleHelpOpen}
            localPlayerName={state.localPlayer.actual.label}
          />
          <div className="Scene" style={{ zIndex: zIndexes.scene }}>
            <Canvas frameloop="demand" camera={camera} mode="concurrent">
              <AdaptiveDpr pixelated />
              <AdaptiveEvents />
              <React.Suspense fallback={null}>
                <Preload all />
                <Scene
                  stationaryObject3DList={state.stationaryObject3DList}
                  movingObject3DList={state.movingObject3DList}
                />
              </React.Suspense>
              {state.debugCollisionTriangles && (
                <CollisionHelper triangles={state.debugCollisionTriangles} />
              )}
            </Canvas>
          </div>
          <UI.Drawer
            title="settings"
            placement="left"
            onClose={handleModalClose}
            bodyStyle={{ padding: 0 }}
            visible={state.openModalId === "SETTINGS"}
          >
            <UI.SettingsModalBody
              onAvatarEdit={handleAvatarEdit}
              // TODO use selectors
              localPlayerName={state.localPlayer.actual.label}
              onValuesChange={handleSettingsChange}
              fields={settingsFields}
            />
          </UI.Drawer>
          <UI.Drawer
            height="50%"
            title="lewks"
            placement="bottom"
            visible={state.openModalId === "EDIT_MY_AVATAR"}
            onClose={handleModalClose}
            maskStyle={{ backgroundColor: "transparent" }}
          >
            <UI.AvatarForm
              avatars={avatars}
              initialValues={state.localPlayer.actual}
              onValuesChange={(data) => {
                state.localPlayer.setRequest(data);
              }}
              validating={state.localPlayer.isDirty}
              validateTrigger="onChange"
            />
          </UI.Drawer>
          <Modal
            title="help"
            visible={state.openModalId === "HELP"}
            footer={[]}
            onCancel={handleModalClose}
            onOk={handleModalClose}
          ><HelpModalBody/></Modal>
          <Modal
            title="welcome"
            visible={state.openModalId === "WELCOME"}
            footer={[]}
            onCancel={handleModalClose}
            onOk={handleModalClose}
          ><WelcomeModalBody/></Modal>
          {userSettings.shouldShowVirtualGamePad && <VirtualGamePad />}
        </main>
      </ErrorBoundary>
    );

    function handleSettingsOpen() {
      state.setOpenModal("SETTINGS");
    }

    function handleHelpOpen() {
      state.setOpenModal("HELP");
    }

    function handleSettingsChange(changedValues) {
      userSettings.update(changedValues);
    }

    function handleModalClose() {
      state.setOpenModal(null);
    }

    function handleAvatarEdit() {
      state.setOpenModal("EDIT_MY_AVATAR");
    }
  }
);
