class RoomModel {
  /**
   * @param {string} id
   */
  constructor(id) {
    this.id = id;
  }
  playersPresent = new Set();
  playersJoining = new Set();
  playersLeaving = new Set();
}

export default RoomModel;
