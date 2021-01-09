import { joinRoomChannel } from "./socket";
import RoomModel from "./RoomModel";

jest.mock("phoenix", () => {
  class Socket {
    connect() {}
    channel() {
      return {
        join() {},
      };
    }
  }

  /* Scenario:
   *  remote1 joins and stays, then remote2 and remote3 join then leave, then remote3 joins again.
   */
  class Presence {
    async onSync(handleSync) {
      this.list = () => [
        { metas: [{ player_id: "local" }] },
        { metas: [{ player_id: "remote1" }] },
      ];
      handleSync();

      this.list = () => [
        {
          metas: [{ player_id: "local" }],
        },
        {
          metas: [{ player_id: "remote1" }],
        },
        {
          metas: [{ player_id: "remote2" }],
        },
        {
          metas: [{ player_id: "remote3" }],
        },
      ];
      handleSync();

      // Allow onLeave logic to run
      await new Promise((resolve) => setImmediate(resolve));

      this.list = () => [
        { metas: [{ player_id: "local" }] },
        { metas: [{ player_id: "remote1" }] },
        { metas: [{ player_id: "remote3" }] },
      ];

      handleSync();
    }

    onLeave(handleLeave) {
      this.list = () => [
        { metas: [{ player_id: "local" }] },
        { metas: [{ player_id: "remote1" }] },
      ];
      handleLeave();
    }
  }

  return {
    Socket,
    Presence,
  };
});

describe("joinRoomChannel", () => {
  test("joining/leaving", async () => {
    const room = new RoomModel("best-fwends");
    joinRoomChannel(room, "local");

    // Allow onJoin logic to run again
    await new Promise((resolve) => setImmediate(resolve));

    expect(room.playersJoining).toEqual(
      new Set(["local", "remote1", "remote3"])
    );
    expect(room.playersLeaving).toEqual(new Set(["remote2"]));
  });
});
