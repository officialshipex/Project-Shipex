if(process.env.NODE_ENV!="production"){
 require('dotenv').config();
}
const axios = require('axios');
const { fetchBulkWaybills } = require("../Authorize/saveCourierContoller");
const url = process.env.DELHIVERY_URL;
const API_TOKEN = process.env.DEL_API_TOKEN;
const Order = require("../../../models/newOrder.model");
const crypto = require("crypto");
const Wallet = require("../../../models/wallet");
const {createClientWarehouse}=require("./couriers.controller")


const createShipmentFunctionDelhivery = async (selectedServiceDetails, id, wh,walletId,finalCharges) => {
    const delUrl = `${url}/api/cmu/create.json`;
    

    try {
        const currentOrder = await Order.findById(id);
        // console.log("hjhvhjv",currentOrder)
        const createClientWarehouses = await createClientWarehouse(
            currentOrder.pickupAddress
          );
        const currentWallet = await Wallet.findById(walletId);

        const waybills = await fetchBulkWaybills(1);
        // console.log(waybills)

        const payment_type =
            currentOrder.paymentDetails.method === "COD" ? "COD" : "Prepaid";

            console.log("warehouse",wh)
        const payloadData = {
            pickup_location: {
                name: wh.contactName || "Default Warehouse",
            },
            shipments: [
                {
                    Waybill: waybills[0],
                    country: "India",
                    city: currentOrder.receiverAddress.city,
                    // return_phone: wh.contactNo,
                    pin: currentOrder.receiverAddress.pinCode,
                    state: currentOrder.receiverAddress.state,
                    order: currentOrder.orderId,
                    add: currentOrder.receiverAddress.address || "Default Warehouse",
                    payment_mode: payment_type,
                    quantity: currentOrder.productDetails.reduce((sum, product) => sum + product.quantity, 0).toString(), // Total quantity
                    // return_add: `${wh.addressLine1}`,
                    phone: currentOrder.receiverAddress.phoneNumber,
                    products_desc: currentOrder.productDetails.map(product => product.name).join(", "), // Join product names
                    total_amount: currentOrder.paymentDetails.amount,
                    name: currentOrder.receiverAddress.contactName || "Default Warehouse",
                    // return_country: "India",
                    // return_city: wh.city,
                    // return_state: wh.state,
                    // return_pin: wh.pinCode,
                    shipment_height: currentOrder.packageDetails.volumetricWeight.height,
                    shipment_width: currentOrder.packageDetails.volumetricWeight.width,
                    shipment_length: currentOrder.packageDetails.volumetricWeight.length,
                    cod_amount: payment_type === "COD" ? `${currentOrder.paymentDetails.amount}` : "0",
                },
            ],
        };

        const payload = `format=json&data=${encodeURIComponent(
            JSON.stringify(payloadData)
        )}`;
        let response
if(currentWallet.balance>=finalCharges){
     response = await axios.post(delUrl, payload, {
        headers: {
            Authorization: `Token ${API_TOKEN}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
}else{
    return { status: 400,success:false,message:"Low Balance" };
  
}
        // const response = await axios.post(delUrl, payload, {
        //     headers: {
        //         Authorization: `Token ${API_TOKEN}`,
        //         "Content-Type": "application/x-www-form-urlencoded",
        //     },
        // });

        if (response.data.success) {
            const result = response.data.packages[0];
            currentOrder.status = "Ready To Ship";
            currentOrder.cancelledAtStage = null;
            currentOrder.awb_number = result.waybill;
            currentOrder.shipment_id = `${result.refnum}`;
            currentOrder.provider =selectedServiceDetails.provider;
            currentOrder.totalFreightCharges =
            finalCharges === "N/A" ? 0 : parseInt(finalCharges);
            currentOrder.courierServiceName =selectedServiceDetails.courierServiceName;
            
            currentOrder.shipmentCreatedAt = new Date();
            let savedOrder = await currentOrder.save();
            let balanceToBeDeducted =
              finalCharges === "N/A" ? 0 : parseInt(finalCharges);
            // console.log("sjakjska",balanceToBeDeducted)
            await currentWallet.updateOne({
              $inc: { balance: -balanceToBeDeducted },
              $push: {
                transactions: {
                  channelOrderId: currentOrder.orderId || null, // Include if available
                  category: "debit",
                  amount: balanceToBeDeducted, // Fixing incorrect reference
                  balanceAfterTransaction:
                    currentWallet.balance - balanceToBeDeducted,
                  date: new Date().toISOString().slice(0, 16).replace("T", " "),
                  awb_number: result.waybill || "", // Ensuring it follows the schema
                  description: `Freight Chages Applied`,
                },
              },
            });
            return { status: 201, message: "Shipment Created Succesfully", details: response.data };
           
          } else {
            return { status: 400, error: 'Error creating shipment', details: response.data };
        }
    } catch (error) {
        console.log(error);
        console.error('Error in creating shipment:', error.message);
        return { status: 500,error: 'Internal Server Error', message: error.message  }
      
    }
};


module.exports={createShipmentFunctionDelhivery};