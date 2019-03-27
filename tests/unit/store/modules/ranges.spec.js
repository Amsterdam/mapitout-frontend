import { mutations } from "@/store/modules/ranges";

describe("ranges store module", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  describe("mutations", () => {
    describe("addRange", () => {
      it("should add the resolved address to state", () => {
        const state = { ranges: [] };

        mutations.add(state);

        expect(state.ranges.length).toBe(1);
      });
    });
  });
});
