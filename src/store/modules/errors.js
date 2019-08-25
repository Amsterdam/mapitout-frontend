export const actions = {
  network(context, error) {
    // eslint-disable-next-line no-console
    console.error(error);
  },

  generic(context, error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

export default {
  namespaced: true,
  actions
};
