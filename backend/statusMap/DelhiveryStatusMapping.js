
const DelhiveryStatusMapping = {
  "bag added to trip": "In-transit",
  "vehicle departed": "In-transit",
  "trip arrived": "In-transit",
  "bag received at facility": "In-transit",
  "shipment picked up":"In-transit",
  "vehicle delayed - controllable":"In-transit",
  "pickup scheduled":"Ready To Ship",
  "out for pickup":"Ready To Ship",
  "added to bag":"In-transit",
  
};

module.exports = DelhiveryStatusMapping;
