const Order = require("../models/orderSchema.model");
const { getServiceablePincodesData } = require("../AllCouriers/NimbusPost/Couriers/couriers.controller");
const{checkServiceability}=require("../AllCouriers/ShipRocket/MainServices/mainServices.controller");
const{checkServiceabilityXpressBees}=require("../AllCouriers/Xpressbees/MainServices/mainServices.controller");

const checkServiceabilityAll= async (service, id,pincode) => {
    try {
        const currentOrder = await Order.findById(id);
        if (!currentOrder) throw new Error("Order not found");

        console.log("pincode",pincode);

        if (service.courierProviderName === "NimbusPost") {
            const payload = {
                origin:pincode,
                destination: currentOrder.shipping_details.pinCode,
                payment_type: currentOrder.order_type === 'Cash on Delivery' ? "cod" : "prepaid",
                order_amount: currentOrder.sub_total,
                weight:currentOrder.shipping_cost.weight,
                length: currentOrder.shipping_cost.dimensions.length,
                breadth: currentOrder.shipping_cost.dimensions.width,
                height: currentOrder.shipping_cost.dimensions.height,
            };

            const result = await getServiceablePincodesData(service.courierProviderServiceName, payload);
            return result;
        }

        if (service.courierProviderName === "Shiprocket") {
            const payload = {
                origin:pincode,
                destination: currentOrder.shipping_details.pinCode,
                payment_type: currentOrder.order_type === 'Cash on Delivery' ? true : false,
                weight: `${parseInt(currentOrder.shipping_cost.weight)/1000}`,
                length: currentOrder.shipping_cost.dimensions.length,
                breadth: currentOrder.shipping_cost.dimensions.width,
                height: currentOrder.shipping_cost.dimensions.height,

            };

            const result = await checkServiceability(service.courierProviderServiceName, payload);
            return result;
        }

        if (service.courierProviderName === "Xpressbees") {
            
            const payload = {
                    origin:pincode,
                    destination: currentOrder.shipping_details.pinCode,
                    payment_type: currentOrder.order_type === 'Cash on Delivery' ?"cod":"prepaid",
                    order_amount:currentOrder.sub_total,
                    weight:Math.max(parseInt(currentOrder.shipping_cost.weight),parseInt(currentOrder.shipping_cost.volumetricWeight)),
                    length: currentOrder.shipping_cost.dimensions.length,
                    breadth: currentOrder.shipping_cost.dimensions.width,
                    height: currentOrder.shipping_cost.dimensions.height,
    
            };

            const result=await checkServiceabilityXpressBees(service.courierProviderServiceName,payload);
            return result;

        }

        

        return false;
    } catch (error) {
        console.error("Error in checking serviceability:", error.message);
        throw error;
    }
};

module.exports = { checkServiceabilityAll};
