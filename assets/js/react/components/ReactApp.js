import * as React from "react";
import { observer } from "mobx-react-lite";
import { Canvas } from "react-three-fiber";
import { R3FComponent } from "../../components";
import * as UI from "./ui";
import * as AntD from "antd";
import { ObservableState } from "../../state";

const EntitySet = observer(
  /**
   * @param {{
   *   entities: ObservableState['entitiesToRender'];
   * }} props
   */
  ({ entities }) => {
    const components = [];
    entities.forEach((entity) => {
      const ReactComponent = /**
       * @type any
       */ entity.getComponent(R3FComponent).value;
      components.push(<ReactComponent entity={entity} key={entity.id} />);
    });
    return <>{components}</>;
  }
);

export const ReactApp = observer(
  /**
   * @param {{ state: ObservableState }} props
   */
  ({ state }) => {
    return (
      <>
        <div className="App">
          <UI.HeadsUp
            onAvatarEdit={handleAvatarEdit}
            onSettingsOpen={handleSettingsOpen}
          />
          <Canvas>
            <EntitySet entities={state.entitiesToRender} />
          </Canvas>
        </div>
        <UI.Drawer
          title="settings"
          placement="left"
          onClose={handleModalClose}
          bodyStyle={{ padding: 0 }}
          visible={state.openModalId === "SETTINGS"}
        >
          <UI.SettingsModalBody onAvatarEdit={handleAvatarEdit} />
        </UI.Drawer>
        <UI.Drawer
          title="edit name & avatar"
          placement="bottom"
          visible={state.openModalId === "EDIT_MY_AVATAR"}
          onClose={handleModalClose}
          maskStyle={{backgroundColor: "transparent"}}
        >
          <UI.AvatarForm
            initialValues={state.localPlayerOut}
            onValuesChange={(data) => state.inputLocalPlayer(data)}
            validating={state.localPlayerDirty}
            validateTrigger="onChange"
          />
        </UI.Drawer>
      </>
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
