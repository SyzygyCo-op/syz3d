import * as ECSY from "ecsy";
import { Room } from "./Room";

const RoomType = ECSY.createType({
  name: "Room",
  default: new Room("unnamed room"),
  copy: ECSY.copyCopyable,
  clone: ECSY.cloneClonable,
});

export class RoomComponent extends ECSY.Component {
  static schema = {
    value: {
      type: RoomType,
    },
  };
}
