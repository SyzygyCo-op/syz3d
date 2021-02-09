import { copyMap } from "../utils";

export class Room {
  /**
   * @param {string} id
   */
  constructor(id) {
    this.id = id;
  }

  playerEntityMap = new Map();
  networkedComponents = new Map();
  /** @type string[] */
  playerIdList = [];

  clone() {
    const theClone = new Room(this.id);
    theClone.copy(this);
    return theClone;
  }

  /**
   * @param {Room} src
   */
  copy(src) {
    this.id = src.id;
    copyMap(this.playerEntityMap, src.playerEntityMap);
    copyMap(this.networkedComponents, src.networkedComponents);
    src.playerIdList.forEach((value, index) => {
      this.playerIdList[index] = value;
    });
    return this;
  }
}
