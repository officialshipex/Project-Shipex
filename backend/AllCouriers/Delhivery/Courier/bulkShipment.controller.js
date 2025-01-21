if(process.env.NODE_ENV!="production"){
 require('dotenv').config();
}
const axios = require('axios');
const { fetchBulkWaybills } = require("../Authorize/saveCourierContoller");
const url = process.env.DELHIVERY_URL;
const API_TOKEN = process.env.DEL_API_TOKEN;
const Order = require("../../../models/orderSchema.model");
const crypto = require("crypto");
const Wallet = require("../../../models/wallet");


const createShipmentFunctionDelhivery = async (selectedServiceDetails, id, wh,walletId,finalCharges) => {
    const url = `${url}/api/cmu/create.json`;

    try {
        const currentOrder = await Order.findById(id);
        const currentWallet = await Wallet.findById(walletId);

        const waybills = await fetchBulkWaybills(1);

        const payment_type =
            currentOrder.order_type === "Cash on Delivery" ? "COD" : "Pre-paid";

        const payloadData = {
            pickup_location: {
                name: wh.warehouseName || "Default Warehouse",
            },
            shipments: [
                {
                    Waybill: waybills[0],
                    country: "India",
                    city: currentOrder.shipping_details.city,
                    return_phone: wh.contactNo,
                    pin: currentOrder.shipping_details.pinCode,
                    state: currentOrder.shipping_details.state,
                    order: currentOrder.order_id,
                    add: `${currentOrder.shipping_details.address} ${currentOrder.shipping_details.address2}`,
                    payment_mode: payment_type,
                    quantity: currentOrder.Product_details.length.toString(),
                    return_add: `${wh.addressLine1}`,
                    phone: currentOrder.shipping_details.phone,
                    total_amount: currentOrder.sub_total,
                    name: `${currentOrder.shipping_details.firstName} ${currentOrder.shipping_details.lastName}`,
                    return_country: "India",
                    return_city: wh.city,
                    return_state: wh.state,
                    return_pin: wh.pinCode,
                    shipment_height: currentOrder.shipping_cost.dimensions.height,
                    shipment_width: currentOrder.shipping_cost.dimensions.width,
                    shipment_length: currentOrder.shipping_cost.dimensions.length,
                    cod_amount: payment_type === "COD" ? `${currentOrder.sub_total}` : "0",
                },
            ],
        };

        const payload = `format=json&data=${encodeURIComponent(
            JSON.stringify(payloadData)
        )}`;

        const response = await axios.post(url, payload, {
            headers: {
                Authorization: `Token ${API_TOKEN}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        if (response.data.success) {
            const result = response.data.packages[0];

            currentOrder.status = "Booked";
            currentOrder.cancelledAtStage = null;
            currentOrder.awb_number = result.waybill;
            currentOrder.shipment_id = `${result.refnum}`;
            currentOrder.service_details = selectedServiceDetails._id;
            currentOrder.warehouse = wh._id;
            currentOrder.freightCharges =
                finalCharges === "N/A" ? 0 : parseInt(finalCharges);
            currentOrder.tracking = [{ stage: "Order Booked" }];
            await currentOrder.save();

            const balanceToBeDeducted =
                finalCharges === "N/A" ? 0 : parseInt(finalCharges);
            const currentBalance = currentWallet.balance - balanceToBeDeducted;

            await currentWallet.updateOne({
                $inc: { balance: -balanceToBeDeducted },
                $push: {
                    transactions: {
                        txnType: "Shipping",
                        action: "debit",
                        amount: balanceToBeDeducted,
                        balanceAfterTransaction: currentBalance,
                        awb_number: `${result.waybill}`,
                    },
                },
            });

            return { status: 201, message: "Shipment Created Successfully" };
        } else {
            return { status: 400, error: 'Error creating shipment', details: response.data };
        }
    } catch (error) {
        console.log(error);
        console.error('Error in creating shipment:', error.message);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};


module.exports={createShipmentFunctionDelhivery};