const SmartShipStatusMapping = {
  "order created": "Ready To Ship",
  "order confirmed": "Ready To Ship",
  "shipping label generated": "Ready To Ship",
  "manifested": "Ready To Ship",
  "pick up scan on field":"In-transit",
  "direct canvas bag scanned":"In-transit",
  "comm flight veh train  delayed cancelled":"In-transit",
  "shipment outscanned to network":"In-transit",
  "shipment inscan":"In-transit",
  "re-way":"In-transit",
  "mixed canvas bag scanned":"In-transit",
  "canvas bag consolidated scan":"In-transit",
  "misroute due to shipper fault wrong pin":"In-transit",
  "shipment outscan":"Out for Delivery",
  "call logs":"Out for Delivery",
  "shipped": "In-transit",
  "refusal confirmation code verified":"Undelivered",
  "consignee refused to accept":"Undelivered",
  "consignee not available cant deliver":"Undelivered",
  "delivered": "Delivered",
  
  
};

module.exports = SmartShipStatusMapping;
