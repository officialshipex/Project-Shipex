const axios = require('axios');

//1. Install Shopify App/Integrate shopify...
const installApp = async (req,res) => {
    const { shopName,shopSubDomain, accessToken } = req.body;

    try {
        const newShop = new Shop({ shopName, shopSubDomain, accessToken });
        await newShop.save();
        return  res.status(200).json({ message: "Shop registered successfully!" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
 
// Configure Axios instance for Shopify API requests
const shopifyApi = axios.create({
    baseURL: `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-01/`,
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    }
});

//2. Get Products from Shopify Store
const getProduct = async (req, res) => {
  try {
    const response = await shopifyApi.get('products.json');
    console.log("res:",response);
    
    return res.status(200).json({
      success: true,
      message:"Product Sync Successfully.",
      data:response.data
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Error fetching products',
       error: error.response.data 
      });
  }
};

//3. Get orders from Shopify Store
const getOrders = async (req, res) => {
  try {
    const response = await shopifyApi.get('orders.json');
    console.log("res:",response);
    
    return res.status(200).json({
      success: true,
      message:"Orders Sync Successfully.",
      data:response.data
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Error fetching products', 
      error: error.response.data 
    });
  }
};

//4. Fulfillment Order/Shipping order...
const fulFillmentOrders = async(req,res) => {  
  try {
    courierUrl = ''
    shipmentData = {
      sender: {
        name: 'Test Store Name',
        address: 'Test Store Address',
      },
      receiver: {
        name: order.shipping_address.name,
        address: order.shipping_address.address1,
        city: order.shipping_address.city,
        postal_code: order.shipping_address.zip,
        country: order.shipping_address.country,
      },
      package: {
        weight: 1.5, // Replace with actual weight
        dimensions: { length: 10, width: 5, height: 3 }, // Replace with actual dimensions
      },
    }

    
    const shipmentResponse =  await axios.post(courierUrl,shipmentData,{
      headers :{ 
        Authorization:`Bearer ${COURIER_API_KEY}`
      }
    });

    const fulfillment = shipmentResponse.data

    const response = await axios.post('fulfillments.json', fulfillment );
    
    return res.status(200).json({
      success: true,
      message:"Fulfillment Completed.",
      data:response.data
    });
  } catch (error) {
    console.error('Error updating shipping:', error.message);
    return res.status(500).json({
      success: false,
      message:'Error updating shipping',
      error: error.message
    });
  }
};


module.exports = {
  installApp,
  getProduct,
  getOrders,
  fulFillmentOrders,
}