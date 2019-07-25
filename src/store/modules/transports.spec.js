import {
  default as transportsModule,
  getters
} from "@/store/modules/transports";

describe("store module transports", () => {
  describe("getters", () => {
    const state = {
      types: [...transportsModule.state.types]
    };

    const transportType = state.types[0];

    describe("getTransportTypeIconComponentByValue", () => {
      it("should return the value of a type based on its value", () => {
        const result = getters.getTransportTypeIconComponentByValue(state)(
          transportType.value
        );

        expect(result).toBe(transportType.iconComponent);
      });
    });
  });
});
