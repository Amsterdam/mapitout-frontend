import { isEqual, groupBy, toPairs } from "lodash-es";

export const getters = {
  getGroupsByParent: state => parent => {
    let filters = state.filters;

    if (parent) {
      filters = state.filters.find(filter => isEqual(filter, parent)).children;
    }

    return toPairs(groupBy(filters, filter => filter.category));
  }
};

export const mutations = {};

export const actions = {
  toggle() {}
};

export default {
  namespaced: true,
  state: {
    filters: [
      {
        name: "Station",
        value: "Station",
        category: "root",
        selected: false,
        children: [
          {
            name: "Tram Station",
            value: "Tram Station",
            category: null,
            selected: false
          },
          {
            name: "Bus Station",
            value: "Bus Station",
            category: null,
            selected: false
          }
        ]
      },
      {
        name: "School",
        value: "School",
        category: "root",
        selected: false,
        children: [
          {
            name: "Age range 4-11",
            value: "Age range 4-11",
            category: "Type of education",
            selected: false
          },
          {
            name: "Age range 4-18",
            value: "Age range 4-18",
            category: "Type of education",
            selected: false
          },
          {
            name: "Primary education",
            value: "Primary education",
            category: "Type of education",
            selected: false
          },
          {
            name: "Secondary education",
            value: "Secondary education",
            category: "Type of education",
            selected: false
          },
          {
            name: "Secondary education",
            value: "15-16",
            category: "Age group",
            selected: false
          }
        ]
      }
    ]
  },
  getters,
  mutations,
  actions
};
