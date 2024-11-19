const axios=require("axios");

const AuthToken=async(req,res)=>{
    
    const email=process.env.XpreesbeesEmail;
    const password=process.env.XpressbeesPassword;
  
    const data = `{
        "email" : "${email}",
        "password" : "${password}"
      }`;

var config = {
  method: 'post',
maxBodyLength: Infinity,
  url: 'https://shipment.xpressbees.com/api/users/login',
  headers: { },
  data : data
};

axios(config)
.then(function (response) {
  res.json(response.data);
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  res.status(500).json(error.message);
  console.log(error);
});

}


const CourierList = async(req,res)=>{
  
  const data = '';
  
  const config = {
    method: 'get',
  maxBodyLength: Infinity,
    url: 'https://shipment.xpressbees.com/api/courier',
    headers: { },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    res.json(response.data);
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    res.status(500).json(error.message);
    console.log(error);
  });

}


const OrderBooking = async(req,res)=>{
  
const data = '{\r\n "order_number": "#001",\r\n "unique_order_number": "yes/no",\r\n "shipping_charges": 40,\r\n "discount": 100,\r\n "cod_charges": 30,\r\n "payment_type": "cod",\r\n "order_amount": 2400,\r\n "package_weight": 300,\r\n "package_length": 10,\r\n "package_breadth": 10,\r\n "package_height": 10,\r\n "request_auto_pickup" : "yes",\r\n "consignee": {\r\n "name": "Customer Name",\r\n "address": "190, ABC Road",\r\n "address_2": "Near Bus Stand",\r\n "city": "Mumbai",\r\n "state": "Maharastra",\r\n "pincode": "251001",\r\n "phone": "9999999999"\r\n },\r\n "pickup": {\r\n "warehouse_name": "warehouse 1",\r\n "name" : "Nitish Kumar (Xpressbees Private Limited)",\r\n "address": "140, MG Road",\r\n "address_2": "Near metro station",\r\n "city": "Gurgaon",\r\n "state": "Haryana",\r\n "pincode": "251001",\r\n "phone": "9999999999"\r\n },\r\n "order_items": [\r\n {\r\n "name": "product 1",\r\n "qty": "18",\r\n "price": "100",\r\n "sku": "sku001"\r\n }\r\n ],\r\n "courier_id" : "",\r\n "collectable_amount":"1500"\r\n}';

const config = {
  method: 'post',
maxBodyLength: Infinity,
  url: 'https://shipment.xpressbees.com/api/shipments2',
  headers: { },
  data : data
};

axios(config)
.then(function (response) {
  res.json(response.data);
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  res.status(500).json(error.message);
  console.log(error);
});

}


const ReverseBooking = async(req,res)=>{

const data = '{\r\n    "order_id": "00230",\r\n    "request_auto_pickup": "yes",\r\n    "consignee":\r\n    {\r\n        "name": "Customer Name",\r\n        "address": "190, ABC Road",\r\n        "address_2": "Near Bus Stand",\r\n        "city": "Mumbai Navi",\r\n        "state": "Maharastra Navi",\r\n        "pincode": "560001",\r\n        "phone": "9999999999",\r\n        "alternate_phone": "1234567890"\r\n    },\r\n    "pickup":\r\n    {\r\n        "warehouse_name": "warehouse 1",\r\n        "name" : "Test",\r\n        "address": "140, MG Road",\r\n        "address_2": "Near metro station",\r\n        "city": "Gurgaon",\r\n        "state": "Haryana",\r\n        "pincode": "110059",\r\n        "phone": "9999999999"\r\n    },\r\n    "categories": "Home",\r\n    "product_name": "Lunch Box",\r\n    "product_qty": "1",\r\n    "product_amount": "300.23",\r\n    "package_weight": 500,\r\n    "package_length":"12" ,\r\n    "package_breadth":"12" ,\r\n    "package_height":"12" ,\r\n    "qccheck": "1",\r\n    "uploadedimage": "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",\r\n    "uploadedimage_2": "",\r\n    "uploadedimage_3": "",\r\n    "uploadedimage_4": "",\r\n    "product_usage": "1",\r\n    "product_damage": "1",\r\n    "brandname": "1",\r\n    "brandnametype": "Brand type",\r\n    "productsize": "1",\r\n    "productsizetype": "10",\r\n    "productcolor": "1",\r\n    "productcolourtype": "Red"\r\n}';

var config = {
  method: 'post',
maxBodyLength: Infinity,
  url: 'https://shipment.xpressbees.com/api/reverseshipments',
  headers: { },
  data : data
};

axios(config)
.then(function (response) {
  res.json(response.data);
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  res.status(500).json(error.message);
  console.log(error);
});

}


const TrackShipment = async(req,res)=>{
  
const data = '';

const config = {
  method: 'get',
maxBodyLength: Infinity,
  url: 'https://shipment.xpressbees.com/api/shipments2/track/AWB',
  headers: { },
  data : data
};

axios(config)
.then(function (response) {
  res.json(response.data);
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  res.status(500).json(error.message);
  console.log(error);
});

}



const Pickup = async(req,res)=>{
  
  const data = '{\r\n "awbs": [\r\n "14344940342223",\r\n "153299140300039",\r\n "152489840025524"\r\n ]\r\n}';
  
  const config = {
    method: 'post',
  maxBodyLength: Infinity,
    url: 'https://shipment.xpressbees.com/api/shipments2/manifest',
    headers: { },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    res.json(response.data);
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    res.status(500).json(error.message);
    console.log(error);
  });
  
}


const CancelShipment = async(req,res)=>{

const data = '{\r\n    "awb" : "14344940342223"\r\n}';

const config = {
  method: 'post',
maxBodyLength: Infinity,
  url: 'https://shipment.xpressbees.com/api/shipments2/cancel',
  headers: { },
  data : data
};

axios(config)
.then(function (response) {
  res.json(response.data);
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  res.status(500).json(error.message);
  console.log(error);
});

}

const ExceptionList = async(req,res)=>{


const data = '';

const config = {
  method: 'get',
maxBodyLength: Infinity,
  url: 'https://shipment.xpressbees.com/api/ndr',
  headers: { },
  data : data
};

axios(config)
.then(function (response) {
  res.json(response.data);
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  res.status(500).json(error.message);
  console.log(error);
});


}

const Exception = async(req,res)=>{
 
const data = '[\r\n    {\r\n        "awb" : "14344940306307",\r\n        "action" : "re-attempt",\r\n        "action_data" : {\r\n        "re_attempt_date" : "2024-02-13"\r\n        }\r\n    },\r\n    {\r\n        "awb" : "14344940306035",\r\n        "action" : "change_address",\r\n        "action_data": {\r\n        "name" : "customer name here",\r\n        "address_1" : "Address 1 here",\r\n        "address_2" : "Address 2 here"\r\n        }\r\n    }\r\n]';

const config = {
  method: 'post',
maxBodyLength: Infinity,
  url: 'https://shipment.xpressbees.com/api/ndr/create',
  headers: { },
  data : data
};

axios(config)
.then(function (response) {
  res.json(response.data);
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  res.status(500).json(error.message);
  console.log(error);
});

}

module.exports={
  generateToken,
  CourierList,
  OrderBooking,
  ReverseBooking,
  Exception,
  ExceptionList,
  CancelShipment,
  Pickup,
  TrackShipment
}

