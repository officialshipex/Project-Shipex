const Order = require('../model/order.model');



const createOrder = async (req,res) => {
    try {
        const orderData = req.body;
        const order = new Order(orderData);

        await order.save();
        res.status(201).json({ message: 'Shipment created successfully', order });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }

      
//     try{
//         const shipmentData = {
//             buyerDetails:{
//                 buyerName:req.body.buyerDetails.buyerName,
//                 phoneNumber:req.body.buyerDetails.phoneNumber,
//                 alternatePhoneNumber:req.body.buyerDetails.alternatePhoneNumber,
//                 email:req.body.buyerDetails.email
//             },
//             buyerAddress:{
//                 completeAddress:req.body.buyerAddress.completeAddress,
//                 landmark:req.body.buyerAddress.landmark,
//                 pincode:req.body.buyerAddress.pincode,
//                 city:req.body.buyerAddress.city,
//                 state:req.body.buyerAddress.state,
//                 country:req.body.buyerAddress.country,
//                 compamyName:req.body.buyerAddress.compamyName,
//                 gstinNumber:req.body.buyerAddress.gstinNumber,
//                 billingAddressSameAsShipping:req.body.buyerAddress.billingAddressSameAsShipping
//             },
//             orderDetails:{
//                 orderId :req.body.orderDetails.orderId,
//                 orderType:req.body.orderDetails.orderType,
//                 orderDate:req.body.orderDetails.orderDate,
//             },
//             productDetails:[{
//                 productName:req.body.productDetails.productName,
//                 quantity:req.body.productDetails.quantity,
//                 unitPrice:req.body.productDetails.unitPrice,
//                 SKU:req.body.productDetails.SKU,
//                 HSN:req.body.productDetails.HSN,
//                 taxRate:req.body.productDetails.taxRate,
//                 productCategory:req.body.productDetails.productCategory,
//                 discount:req.body.productDetails.discount
//                 }],
//             payment:{
//                 cod:req.body.payment.cod,
//                 prepaid:req.body.payment.prepaid,
//                 transactionId:req.body.payment.transactionId,
//                 discount:req.body.payment.discount
//             },
//             packageDetails:{
//                 weigth:req.body.packageDetails.weigth,
//                 volumentricWeigth:req.body.packageDetails.volumentricWeigth
//             },
//             pickUpAddress:{
//                 primary:{
//                     addressLine:req.body.pickUpAddress.primary.addressLine,
//                     city:req.body.pickUpAddress.primary.city,
//                     state:req.body.pickUpAddress.primary.state,
//                     country:req.body.pickUpAddress.primary.country,
//                     pincode:req.body.pickUpAddress.primary.pincode
//                 },
//                 additionalAddresses:[
//                     {
//                     addressLine:req.body.pickUpAddress.additionalAddresses.addressLine,
//                     city:req.body.pickUpAddress.additionalAddresses.city,
//                     state:req.body.pickUpAddress.additionalAddresses.state,
//                     country:req.body.pickUpAddress.additionalAddresses.country,
//                     pincode:req.body.pickUpAddress.additionalAddresses.pincode
//                     },
//                     {  
//                     addressLine:req.body.pickUpAddress.additionalAddresses.addressLine,
//                     city:req.body.pickUpAddress.additionalAddresses.city,
//                     state:req.body.pickUpAddress.additionalAddresses.state,
//                     country:req.body.pickUpAddress.additionalAddresses.country,
//                     pincode:req.body.pickUpAddress.additionalAddresses.pincode
//                     }
//                 ]
//             }
//         }
        
//         const newShipment = await Shipment.create(shipmentData);
//         console.log(newShipment);
        
//         await newShipment.save();

//         return res.status(200).json({
//             success: true,
//             message: "Shipment created successfully",
//             data: newShipment,
//           })

//     }catch (error) {
//         console.log("error", error);
//         return res.status(500).json({
//           success: false,
//           message: "Internal server error",
//         })
//     }
}


const getAllOrders = async (req,res) => {
    try {
        const orders = await Order.find();
        console.log("All orders",orders);
        
        return res.status(200).json(orders);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    
    // try {
    //     const allShipments = await Shipment.find();
    //     console.log(allShipments);
        
    //     return res.status(200).json(allShipments);

    // } catch (error) {
    //     res.status(500).json({
    //         message:'Error fetching shipments'
    //     })
    // }
}

module.exports = {
    createOrder,
    getAllOrders
}