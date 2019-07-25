export const getters = {
  getTransportTypeIconComponentByValue: state => value =>
    state.types.find(type => type.value === value).iconComponent
};

export default {
  namespaced: true,
  state: {
    types: [
      {
        value: "public_transport",
        label: "Public Transport",
        iconComponent: "icon-transport-bus"
      },
      {
        value: "driving",
        label: "Vehicle",
        iconComponent: "icon-transport-car"
      },
      {
        value: "cycling",
        label: "Bicycle",
        iconComponent: "icon-transport-bicycle"
      },
      {
        value: "walking",
        label: "Walking",
        iconComponent: "icon-transport-pedestrian"
      },
      {
        value: "cycling+ferry",
        label: "Public Transport and Bicycle",
        iconComponent: "icon-transport-bicycle-bus"
      }
    ]
  },
  getters
};
