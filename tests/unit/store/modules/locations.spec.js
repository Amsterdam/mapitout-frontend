import { mutations, getters, actions } from "../../../../src/store/modules/locations";
import { http } from "../../../../src/utils";

jest.mock("../../../../src/utils", () => {
  return {
    http: jest.fn()
  };
});

describe("locations store module", () => {
  describe("mutations", () => {
    describe("updatePois", () => {
      it("should update the state pois with the passed value", () => {
        const state = { pois: [] };
        const pois = { name: "test-name", coordinates: {} };

        mutations.updatePois(state, pois);

        expect(state.pois).toEqual(pois);
      });
    });

    describe("view", () => {
      it("should update the state details with the passed value", () => {
        const state = { details: null };
        const details = { name: "test-name", lat: 1, lng: 2 };

        mutations.view(state, details);

        expect(state.details).toEqual(details);
      });
    });
  });

  describe("getters", () => {
    describe("getPoiIconByPoiTypeId", () => {
      const poiType = { id: 0, icon: "icon" };
      const state = { poiTypes: [poiType] };

      it("should return the icon of the poi type stored in the state by value passed type id", () => {
        const result = getters.getPoiIconByPoiTypeId(state)(poiType.id);

        expect(result).toEqual(poiType.icon);
      });

      it("should return undefined if the requested id was not saved into the state", () => {
        const result = getters.getPoiIconByPoiTypeId(state)("other-id");

        expect(result).toBeUndefined();
      });
    });
  });

  describe("actions", () => {
    const context = {
      dispatch: jest.fn(),
      commit: jest.fn(),
      getters: {
        getPoiIconByPoiTypeId: jest.fn(),
        getOriginById: jest.fn()
      }
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe("fetch", () => {
      it("should commit an empty poi array and not call http whenever passed an empty filters array", () => {
        const filters = [];
        const areas = [
          {
            rangeId: "union",
            paths: []
          }
        ];
        actions.fetch(context, { filters, areas });

        expect(http).not.toHaveBeenCalled();
        expect(context.commit).toHaveBeenCalledWith("updatePois", []);
      });

      it("should commit an empty poi array and not call http whenever passed an empty areas array", () => {
        const filters = [{ value: "test" }];
        const areas = [];
        actions.fetch(context, { filters, areas });

        expect(http).not.toHaveBeenCalled();
        expect(context.commit).toHaveBeenCalledWith("updatePois", []);
      });

      it("should call http with the correct request object whenever passed the right parameters", () => {
        const filters = [{ value: "test" }];
        const areas = [
          {
            rangeId: "union",
            paths: [[{ lat: 1, lng: 2 }, { lat: 1, lng: 2 }, { lat: 1, lng: 2 }]]
          }
        ];
        actions.fetch(context, { filters, areas });

        expect(http).toHaveBeenCalledTimes(1);
        expect(http.mock.calls[0][1]).toEqual({
          body: JSON.stringify({
            poi_by_type: ["test"],
            poi_in_polygon: {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [[[2, 1], [2, 1], [2, 1]]],
                crs: { type: "name", properties: { name: "EPSG:4326" } }
              }
            }
          }),
          headers: {
            Accept: "application/json",
            "Content-type": "application/json; charset=utf-8"
          },
          method: "POST"
        });
      });

      it("should commit a populated poi array whenever the http call returns a valid json", async () => {
        const filters = [{ value: "test" }];
        const areas = [
          {
            rangeId: "union",
            paths: [[{ lat: 1, lng: 2 }, { lat: 1, lng: 2 }, { lat: 1, lng: 2 }]]
          }
        ];
        const expectedResult = { name: "test" };

        http.mockResolvedValue([[expectedResult]]);

        await actions.fetch(context, { filters, areas });

        expect(context.commit).toHaveBeenCalledWith("updatePois", [expectedResult]);
      });

      it("should commit a populated poi array whenever the http call returns an empty json", async () => {
        const filters = [{ value: "test" }];
        const areas = [
          {
            rangeId: "union",
            paths: [[{ lat: 1, lng: 2 }, { lat: 1, lng: 2 }, { lat: 1, lng: 2 }]]
          }
        ];

        http.mockResolvedValue({});

        await actions.fetch(context, { filters, areas });

        expect(context.commit).toHaveBeenCalledWith("updatePois", []);
      });

      it("should commit an empty poi array and call dispatch an error whenever the http call fails", async () => {
        const filters = [{ value: "test" }];
        const areas = [
          {
            rangeId: "union",
            paths: [[{ lat: 1, lng: 2 }, { lat: 1, lng: 2 }, { lat: 1, lng: 2 }]]
          }
        ];
        http.mockRejectedValue(new Error());

        await actions.fetch(context, { filters, areas });

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("updatePois", []);
        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch.mock.calls[0][0]).toBe("reportError");
        expect(context.dispatch.mock.calls[0][1]).toBeInstanceOf(Error);
        expect(context.dispatch.mock.calls[0][2]).toEqual({ root: true });
      });
    });

    describe("lookup", () => {
      it("should call http with the correct url and request object", () => {
        const name = "test name";
        const expectedRequestObject = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json; charset=utf-8"
          },
          body: '{"poi_by_name":"test name"}'
        };
        actions.lookup(context, name);

        expect(http).toHaveBeenCalledTimes(1);

        expect(http.mock.calls[0][1]).toEqual(expectedRequestObject);
      });

      it("should commit a details object provided a valid http call response ", async () => {
        const name = "test-query";
        const response = {
          description: "description",
          city: "Amsterdam",
          street: "street",
          postalcode: "postalcode",
          website: "website",
          phone: 2141234,
          poi_type_id: 1,
          geo_location: {
            coordinates: [1, 2]
          }
        };
        const icon = "icon";

        context.getters.getPoiIconByPoiTypeId.mockReturnValue(icon);

        http.mockResolvedValue([[response]]);

        const location = {
          name: response.name,
          description: response.description,
          address: `${response.street}, ${response.postalcode} ${response.city}`,
          website: response.website,
          phone: response.phone,
          lng: response.geo_location.coordinates[0],
          lat: response.geo_location.coordinates[1],
          icon
        };

        await actions.lookup(context, name);

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("view", location);
      });

      it("should commit a null details object provided an empty http call response ", async () => {
        const name = "test-query";

        http.mockResolvedValue({});

        await actions.lookup(context, name);

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("view", null);
      });

      it("should commit a null details object and dispatch an error on a failed http call", async () => {
        const query = "test-query";

        http.mockRejectedValue(new Error());

        await actions.lookup(context, query);

        expect(context.commit).toHaveBeenCalledTimes(1);
        expect(context.commit).toHaveBeenCalledWith("view", null);
        expect(context.dispatch).toBeCalledTimes(1);
        expect(context.dispatch.mock.calls[0][0]).toBe("reportError");
        expect(context.dispatch.mock.calls[0][1]).toBeInstanceOf(Error);
        expect(context.dispatch.mock.calls[0][2]).toEqual({ root: true });
      });
    });
  });
});
