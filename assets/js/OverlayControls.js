import * as React from "react";
import * as DRMT from "dreamt";
import { WelcomeScreenReact } from "./welcome";
import { RenderReactComponent } from "./renderer";
import { BumpComponent } from "./animation";

/**
 * @type React.ComponentType<{entity: DRMT.Entity}>
 */
export const OverlayControlsReact = ({ entity }) => {
  return (
    <div>
      <button onClick={handleClickEdit}>customize avatar</button>
      <button onClick={handleClickBump}>say "cheers!"</button>
    </div>
  );

  function handleClickEdit() {
    DRMT.updateComponent(entity, RenderReactComponent, {
      value: WelcomeScreenReact,
    });
  }

  function handleClickBump() {
    // TODO have updateComponent addComponent if necessary?
    // or make an upsertComponent helper?
    if(!entity.hasComponent(BumpComponent)) {
      entity.addComponent(BumpComponent, {value: 0})
    } else {
      DRMT.updateComponent(entity, BumpComponent, {
        value: 0,
      });
    }
  }
};
