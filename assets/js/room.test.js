import { joinRoom } from "./room";

jest.mock("phoenix", () => {
  class Socket {
    connect() {}
    channel() {
      return {
        join() {},
      };
    }
  }

  class Presence {
    onJoin(fn) {
      this.list = () => [{ metas: [{ player_id: "1" }, { player_id: "1" }] }];
      fn();

      this.list = () => [
        {
          metas: [{ player_id: "1" }, { player_id: "1" }],
        },
        {
          metas: [{ player_id: "2" }, { player_id: "2" }],
        },
      ];
      fn();
    }

    onLeave(fn) {
      this.list = () => [{ metas: [{ player_id: "1" }, { player_id: "1" }] }];
      fn();

      this.list = () => [];
      fn();
    }
  }

  return {
    Socket,
    Presence,
  };
});

describe("joinRoom", () => {
  test("dedup by player_id on join", () => {
    const spy = jest.fn();
    joinRoom("best-fwends", {
      player_id: "moom",
      onJoin: spy,
    });

    expect(spy.mock.calls).toEqual([
      [[{ player_id: "1" }]],
      [[{ player_id: "2" }]],
    ]);
  });

  test("dedup by player_id on leave", () => {
    const spy = jest.fn();
    joinRoom("best-fwends", {
      player_id: "moom",
      onJoin: () => {},
      onLeave: spy,
    });

    expect(spy.mock.calls).toEqual([[["2"]], [["1"]]]);
  });
});
