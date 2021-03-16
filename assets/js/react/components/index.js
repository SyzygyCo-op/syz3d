import * as React from "react";
export { Entity } from './Entity'
export { ReactApp } from './ReactApp'

/**
 * @param {{
 *   onSubmit: (data: { player_id: string; texture: string }) => void;
 *   onClose: () => void;
 * }} props
 */
export const PlayerFormReact = (props) => {
  return (
    <form onSubmit={handleSubmit}>
      <label>
        What should your name tag say?
        <input name="player_id" type="text" placeholder="Samuel L. Jackson" />
      </label>
      <label>
        Choose a texture (for your avatar.)
        <select name="texture" defaultValue="">
          <option value="/images/water_texture.jpg">Water</option>
          <option value="/images/lava_texture.jpg">Lava</option>
        </select>
      </label>
      <input type="submit" value="Save" />
      {props.onClose && (
        <input type="button" value="Let's go!" onClick={props.onClose} />
      )}
    </form>
  );

  /**
   * @param {React.FormEvent} evt
   */
  function handleSubmit(evt) {
    evt.preventDefault();
    const data = new FormData(
      /**
       * @type any
       */ (evt.target)
    );
    /**
     * @type string
     */
    const player_id = /**
     * @type string
     */ (data.get("player_id"));
    const texture = /**
     * @type string
     */ (data.get("texture"));
    props.onSubmit({ player_id, texture });
  }
};
