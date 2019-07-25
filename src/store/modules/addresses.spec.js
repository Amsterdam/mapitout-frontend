import { default as addressesModule, getters, actions } from "./addresses";
import * as apiGeodata from "../../api/geodata";

describe("store module origins", () => {
  describe("getters", () => {
    const state = {
      types: [...addressesModule.state.types]
    };

    const addressType = state.types[0];

    describe("getAddressIconByOriginTypeId", () => {
      it("should return the icon of the address type stored in the state by passed type id", () => {
        const result = getters.getAddressIconByTypeId(state)(addressType.id);

        expect(result).toEqual(addressType.icon);
      });
    });

    describe("getAddressIconComponentByTypeId", () => {
      it("should return the icon of the address type stored in the state by passed type id", () => {
        const result = getters.getAddressIconComponentByTypeId(state)(
          addressType.id
        );

        expect(result).toEqual(addressType.iconComponent);
      });
    });

    describe("getAddressHighlightColorByTypeId", () => {
      it("should return the highlight color of the address type stored in the state by passed type id", () => {
        const result = getters.getAddressHighlightColorByTypeId(state)(
          addressType.id
        );

        expect(result).toEqual(addressType.highlightColor);
      });
    });
  });

  describe("actions", () => {
    const context = {
      dispatch: jest.fn()
    };

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe("search", () => {
      const searchAddressesSpy = jest
        .spyOn(apiGeodata, "searchAddresses")
        .mockImplementation();

      it("should call searchAddresses api with the correct parameters", async () => {
        const query = "testQuery";

        await actions.search(context, query);

        expect(searchAddressesSpy).toHaveBeenCalledTimes(1);
        expect(searchAddressesSpy).toHaveBeenCalledWith(query);
      });

      it("should return dispatch an error and return an empty array when the api call throws an error", async () => {
        const query = "testQuery";
        const error = new Error("test-error");

        searchAddressesSpy.mockRejectedValue(error);

        const result = await actions.search(context, query);

        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch).toHaveBeenCalledWith("errors/network", error, {
          root: true
        });
        expect(result).toEqual([]);
      });

      it("should return the value provided by the api call", async () => {
        const query = "testQuery";

        const expectedValue = [{ id: "test" }];

        searchAddressesSpy.mockResolvedValue(expectedValue);

        const result = await actions.search(context, query);

        expect(result).toEqual(expectedValue);
      });
    });

    describe("geoLocate", () => {
      const geoLocateAdrressSpy = jest
        .spyOn(apiGeodata, "geoLocateAddress")
        .mockImplementation();

      it("should call geoLocate api with the correct parameters", async () => {
        const id = "testQuery";

        await actions.geoLocate(context, id);

        expect(geoLocateAdrressSpy).toHaveBeenCalledTimes(1);
        expect(geoLocateAdrressSpy).toHaveBeenCalledWith(id);
      });

      it("should return dispatch an error and return null when the api call throws an error", async () => {
        const id = "testQuery";
        const error = new Error("test-error");

        geoLocateAdrressSpy.mockRejectedValue(error);

        const result = await actions.geoLocate(context, id);

        expect(context.dispatch).toHaveBeenCalledTimes(1);
        expect(context.dispatch).toHaveBeenCalledWith("errors/network", error, {
          root: true
        });
        expect(result).toEqual(null);
      });

      it("should return the value provided by the api call", async () => {
        const query = "testQuery";

        const expectedValue = { id: "test" };

        geoLocateAdrressSpy.mockResolvedValue(expectedValue);

        const result = await actions.geoLocate(context, query);

        expect(result).toEqual(expectedValue);
      });
    });
  });
});
