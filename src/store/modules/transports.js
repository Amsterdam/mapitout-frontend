const getters = {
  getTransportValueById: state => id => state.types.find(type => type.id === id).value
};

export default {
  namespaced: true,
  state: {
    types: [
      { id: 0, value: "public_transport", label: "Public Transport", icon: "icon-transport-bus" },
      { id: 1, value: "driving", label: "Vehicle", icon: "icon-transport-car" },
      { id: 2, value: "cycling", label: "Bicycle", icon: "icon-transport-bicycle" },
      { id: 3, value: "walking", label: "Walking", icon: "icon-transport-pedestrian" },
      {
        id: 4,
        value: "cycling+ferry",
        label: "Public Transport and Bicycle",
        icon: "icon-transport-bicycle-bus"
      }
    ]
  },
  getters
};
