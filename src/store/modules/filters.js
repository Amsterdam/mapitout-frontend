import { isEqual } from "lodash-es";

export const getters = {
  selectedTypes: state =>
    state.filters
      .filter(filter => filter.parentId === 0 && filter.selected)
      .map(filter => filter.value),
  selectedSubTypes: state =>
    state.filters
      .filter(filter => filter.parentId !== 0 && filter.selected)
      .map(filter => filter.value),
  hasChildren: state => filterId =>
    state.filters.filter(filter => filter.parentId === filterId).length > 0
};

export const mutations = {
  update(state, filters) {
    state.filters = filters;
  },

  setRootFilter(state, filter) {
    state.rootFilter = filter;
  }
};

export const actions = {
  update({ commit, state }, filters) {
    if (!isEqual(filters, state.filters)) {
      commit("update", filters);
    }
  },

  toggle({ dispatch, state }, { id, selected }) {
    const filters = state.filters.map(filter =>
      filter.id === id ? { ...filter, selected: !selected } : filter
    );

    dispatch("update", filters);
  }
};

export default {
  namespaced: true,
  state: {
    rootFilter: null,
    filters: [
      {
        id: 1,
        name: "Stations",
        value: "Station",
        root: true,
        propertyId: null,
        selected: false,
        parentId: 0,
        iconComponent: "icon-bus"
      },
      {
        id: 2,
        name: "Schools",
        value: "School",
        root: true,
        propertyId: null,
        selected: false,
        parentId: 0,
        iconComponent: "icon-education"
      },
      {
        id: 3,
        name: "Age Range 4-11",
        value: "Age range 4-11",
        group: "School programs",
        propertyId: 1,
        selected: false,
        parentId: 2,
        iconComponent: "icon-education"
      },
      {
        id: 4,
        name: "Age Range 4-18",
        value: "Age range 4-18",
        group: "School programs",
        propertyId: 2,
        selected: false,
        parentId: 2,
        iconComponent: "icon-education"
      },
      {
        id: 5,
        name: "Primary Education",
        value: "Primary education",
        group: "School programs",
        propertyId: 3,
        selected: false,
        parentId: 2,
        iconComponent: "icon-education"
      },
      {
        id: 6,
        name: "Secondary Education",
        value: "Secondary education",
        group: "School programs",
        propertyId: 4,
        selected: false,
        parentId: 2,
        iconComponent: "icon-education"
      },
      {
        id: 7,
        name: "International Schools",
        value: "International schools",
        group: "School system",
        propertyId: 5,
        selected: false,
        parentId: 2,
        iconComponent: "icon-education"
      },
      {
        id: 8,
        name: "Dutch Schools",
        value: "Dutch schools",
        group: "School system",
        propertyId: 6,
        selected: false,
        parentId: 2,
        iconComponent: "icon-education"
      }
    ]
  },
  getters,
  mutations,
  actions
};
