import * as React from "react";
import { observer } from "mobx-react-lite";
import { Canvas, invalidate } from "@react-three/fiber";
import * as UI from "./ui";
import { ObservableState, avatars, userSettings } from "../../state";
import { gameLoop, world } from "../../world";
import { Scene } from "./Scene";
import { AdaptiveDpr, AdaptiveEvents, Preload } from "@react-three/drei";
import { CameraSystem } from "../../systems";
import { CollisionHelper } from "./CollisionHelper";
import { mapStateToFields } from "./ui/Form";

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

    const settingsFields = mapStateToFields(userSettings, ['shouldShowNameTags'])

    return (
      <ErrorBoundary>
        <div className="App">
          <UI.HeadsUp
            onAvatarEdit={handleAvatarEdit}
            onSettingsOpen={handleSettingsOpen}
            localPlayerName={state.localPlayer.actual.label}
          />
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
      </ErrorBoundary>
    );

    function handleSettingsOpen() {
      state.setOpenModal("SETTINGS");
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
