import * as React from "react";
import { observer } from "mobx-react-lite";
import { Canvas, invalidate } from "react-three-fiber";
import * as UI from "./ui";
import { ObservableState, avatars } from "../../state";
import { Entity } from "./Entity";
import { gameLoop } from "../../world";

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

const EntitySet = observer(
  /**
   * @param {{
   *   entities: ObservableState['entitiesToRender'];
   * }} props
   */
  ({ entities }) => {
    return (
      <>
        {entities.map((entity) => {
          return <Entity entity={entity} key={entity.id} />;
        })}
      </>
    );
  }
);

const invalidateOnTick = () => invalidate();

export const ReactApp = observer(
  /**
   * @param {{ state: ObservableState }} props
   */
  ({ state }) => {
    gameLoop.useTick(invalidateOnTick);
    return (
      <ErrorBoundary>
        <div className="App">
          <UI.HeadsUp
            onAvatarEdit={handleAvatarEdit}
            onSettingsOpen={handleSettingsOpen}
            localPlayerName={state.localPlayer.actual.player_name}
          />
          <Canvas invalidateFrameloop>
            <pointLight args={[0xffffff, 1, 100]} position={[3, 3, 3]} />
            <React.Suspense fallback={null}>
              <EntitySet entities={state.entitiesToRender} />
            </React.Suspense>
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
            localPlayerName={state.localPlayer.actual.player_name}
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

    function handleModalClose() {
      state.setOpenModal(null);
    }

    function handleAvatarEdit() {
      state.setOpenModal("EDIT_MY_AVATAR");
    }
  }
);
