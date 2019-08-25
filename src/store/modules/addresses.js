import IconHome from "@/assets/icons/IconHome.svg";
import IconTransport from "@/assets/icons/IconBus.svg";
import IconHealth from "@/assets/icons/IconHealth.svg";
import IconWork from "@/assets/icons/IconWork.svg";
import IconEducation from "@/assets/icons/IconEducation.svg";
import IconWellness from "@/assets/icons/IconWellness.svg";

import { geoLocateAddress, searchAddresses } from "../../api/geodata";

export const getters = {
  getAddressIconByTypeId: state => id =>
    state.types.find(address => address.id === id).icon,

  getAddressIconComponentByTypeId: state => id =>
    state.types.find(address => address.id === id).iconComponent,

  getAddressHighlightColorByTypeId: state => id =>
    state.types.find(address => address.id === id).highlightColor
};

export const actions = {
  async search({ dispatch }, query) {
    try {
      return await searchAddresses(query);
    } catch (error) {
      dispatch("errors/network", error, { root: true });

      return [];
    }
  },

  async geoLocate({ dispatch }, id) {
    try {
      return await geoLocateAddress(id);
    } catch (error) {
      dispatch("errors/network", error, { root: true });

      return null;
    }
  }
};

export default {
  namespaced: true,
  state: {
    types: [
      {
        id: 0,
        value: "home",
        label: "Home",
        icon: IconHome,
        iconComponent: "icon-home",
        highlightColor: "#ff0000"
      },
      {
        id: 1,
        value: "transport",
        label: "Station",
        icon: IconTransport,
        iconComponent: "icon-transport",
        highlightColor: "#fd6500"
      },
      {
        id: 2,
        value: "health",
        label: "Health",
        icon: IconHealth,
        iconComponent: "icon-health",
        highlightColor: "#87c010"
      },
      {
        id: 3,
        value: "work",
        label: "Work",
        icon: IconWork,
        iconComponent: "icon-work",
        highlightColor: "#ff0000"
      },
      {
        id: 4,
        value: "education",
        label: "School",
        icon: IconEducation,
        iconComponent: "icon-education",
        highlightColor: "#0c65d5"
      },
      {
        id: 5,
        value: "wellness",
        label: "Gym",
        icon: IconWellness,
        iconComponent: "icon-wellness",
        highlightColor: "#942190"
      }
    ]
  },
  getters,
  actions
};
