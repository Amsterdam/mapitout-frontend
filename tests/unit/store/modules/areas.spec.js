import { mutations, actions } from "@/store/modules/areas";
import { http } from "../../../../src/utils";

jest.mock("../../../../src/utils", () => {
  return {
    http: jest.fn()
  };
});

describe("areas store module", () => {
  describe("mutations", () => {
    describe("replace", () => {
      it("should replace the state areas", () => {
        const areas = [{ id: "area-0" }];
        const state = {
          areas: []
        };

        mutations.replace(state, areas);

        expect(state.areas).toEqual(areas);
      });
    });

    describe("save", () => {
      it("should save the areas to the state cache", () => {
        const areas = [{ id: "area-0" }];
        const key = "key";
        const state = {
          cache: []
        };

        mutations.save(state, { key, areas });

        expect(state.cache).toEqual([{ key, areas }]);
      });

      it("should not add duplicate keys to the cache", () => {
        const areas1 = [{ id: "area-0" }];
        const key = "key";
        const state = {
          cache: [{ key, areas: areas1 }]
        };

        mutations.save(state, { key, areas: { id: "area-2" } });

        expect(state.cache).toEqual([{ key, areas: areas1 }]);
      });
    });
  });

  describe("actions", () => {
    const context = {
      dispatch: jest.fn(),
      commit: jest.fn(),
      getters: {
        getAreasFromCache: jest.fn()
      },
      rootGetters: {
        "transports/getTransportValueById": jest.fn()
      },
      rootState: {
        ranges: {
          ranges: []
        }
      }
    };

    const departureTime = new Date().toISOString();

    let ranges = [
      {
        id: 0,
        originTypeId: 0,
        originId: "origin-0",
        travelTime: 45,
        transportTypeId: 0,
        departureTime
      },
      {
        id: 1,
        originTypeId: 1,
        originId: "origin-1",
        travelTime: 20,
        transportTypeId: 1,
        departureTime
      }
    ];

    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe("fetch", () => {
      it("should commit an empty areas array when there are no ranges with defined origins in state", () => {
        actions.fetch({
          ...context,
          rootState: {
            ranges: {
              ranges: [{ id: 0 }]
            }
          }
        });

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("replace", []);
      });
      it("should commit an empty areas array when there are no ranges with defined origins in state", () => {
        actions.fetch({
          ...context,
          rootState: {
            ranges: {
              ranges: [{ id: 0 }]
            }
          }
        });

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("replace", []);
      });
      it("should call fetch with the correct request object", () => {
        const expectedRequest = {
          body: `{"departure_searches":[{"id":"range-0","coords":{"lat":1,"lng":2},"departure_time":"${ranges[0].departureTime.toISOString()}","travel_time":2700,"transportation":{"type":"public_transport"}},{"id":"range-1","coords":{"lat":1,"lng":2},"departure_time":"${ranges[1].departureTime.toISOString()}","travel_time":1200,"transportation":{"type":"car"}}],"unions":[{"id":"union","search_ids":["range-0","range-1"]}],"intersections":[{"id":"intersection","search_ids":["range-0","range-1"]}]}`,
          headers: {
            Accept: "application/json",
            "Content-type": "application/json; charset=utf-8"
          },
          method: "POST"
        };

        actions.fetch(context, ranges);

        expect(http).toHaveBeenCalledTimes(1);
        expect(http.mock.calls[0][1]).toEqual(expectedRequest);
      });

      it("should commit a populated areas array whenever a valid response is returned", async () => {
        http.mockResolvedValue({
          results: [
            {
              search_id: "range-0",
              shapes: [
                {
                  shell: [{}],
                  holes: [[{}], [{}]]
                }
              ]
            }
          ]
        });

        await actions.fetch(context, ranges);

        expect(context.commit).toHaveBeenCalledWith("update", [
          { id: "area-0", paths: [[{}], [{}], [{}]], rangeId: "range-0" }
        ]);
      });

      it("should commit an empty array and dispatch an error whenever the http call fails", async () => {
        http.mockRejectedValue(new Error());

        await actions.fetch(context, ranges);

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("update", []);
        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch.mock.calls[0][0]).toBe("reportError");
        expect(context.dispatch.mock.calls[0][1]).toBeInstanceOf(Error);
        expect(context.dispatch.mock.calls[0][2]).toEqual({ root: true });
      });
    });
  });
});
