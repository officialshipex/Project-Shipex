const Joi = require('joi');

// Define the Joi schema with custom error messages
const bulkOrderCSVvalidationSchema = Joi.object({
    '*Order Id': Joi.string().required().messages({
        'string.empty': 'Order Id is required',
        'any.required': 'Order Id is mandatory'
    }),
    'Order Date as dd-mm-yyyy hh:MM': Joi.string().optional(),
    '*Channel': Joi.string().required().messages({
        'string.empty': 'Channel is required',
        'any.required': 'Channel is mandatory'
    }),
    '*Payment Method(COD/Prepaid)': Joi.string().valid('COD', 'Prepaid').required().messages({
      'any.only': 'Payment Method must be COD or Prepaid',
      'any.required': 'Payment Method is required'
    }),
    '*Customer First Name': Joi.string().min(1).required().messages({
        'string.empty': 'Customer First Name is required',
        'any.required': 'Customer First Name is mandatory'
    }),
    'Customer Last Name': Joi.string().allow(''),
    'Email (Optional)': Joi.string().email().allow('').messages({
        'string.email': 'Email must be a valid email address'
    }),
    '*Customer Mobile': Joi.string().pattern(/^\d+$/).required().messages({
        'string.pattern.base': 'Customer Mobile must contain only digits',
      'any.required': 'Customer Mobile is required'
    }),
    'Customer Alternate Mobile': Joi.string().pattern(/^\d+$/).allow(''),
    '*Shipping Address Line 1': Joi.string().required().messages({
        'any.required': 'Shipping Address Line 1 is required'
    }),
    'Shipping Address Line 2': Joi.string().allow(''),
    '*Shipping Address Country': Joi.string().required().messages({
        'any.required': 'Shipping Address Country is required'
    }),
    '*Shipping Address State': Joi.string().required().messages({
        'any.required': 'Shipping Address State is required'
    }),
    '*Shipping Address City': Joi.string().required().messages({
        'any.required': 'Shipping Address City is required'
    }),
    '*Shipping Address Postcode': Joi.string().pattern(/^\d+$/).required().messages({
        'string.pattern.base': 'Postcode must contain only digits',
      'any.required': 'Postcode is required'
    }),
    'Billing Address Line 1': Joi.string().allow(''),
    'Billing Address Line 2': Joi.string().allow(''),
    'Billing Address Country': Joi.string().allow(''),
    'Billing Address State': Joi.string().allow(''),
    'Billing Address City': Joi.string().allow(''),
    'Billing Address Postcode': Joi.string().pattern(/^\d*$/).allow(''),
    '*Master SKU': Joi.string().required().messages({
        'any.required': 'Master SKU is required'
    }),
    '*Product Name': Joi.string().required().messages({
        'any.required': 'Product Name is required'
    }),
    '*Product Quantity': Joi.number().integer().min(1).required().messages({
        'number.base': 'Product Quantity must be a number',
        'number.min': 'Product Quantity must be at least 1',
        'any.required': 'Product Quantity is required'
    }),
    'Tax %': Joi.number().min(0).max(100).required().messages({
        'number.base': 'Tax % must be a number',
        'number.min': 'Tax % cannot be negative',
        'number.max': 'Tax % cannot exceed 100',
        'any.required': 'Tax % is required'
    }),
    '*Selling Price(Per Unit Item, Inclusive of Tax)': Joi.number().positive().required().messages({
        'number.base': 'Selling Price must be a number',
        'number.positive': 'Selling Price must be positive',
        'any.required': 'Selling Price is required'
    }),
    'Discount(Per Unit Item)': Joi.number().min(0).allow(''),
    'Shipping Charges(Per Order)': Joi.number().min(0).allow(''),
    'COD Charges(Per Order)': Joi.number().min(0).allow(''),
    'Gift Wrap Charges(Per Order)': Joi.number().min(0).allow(''),
    'Total Discount (Per Order)': Joi.number().min(0).allow(''),
    '*Length (cm)': Joi.number().positive().required().messages({
        'number.base': 'Length must be a number',
        'number.positive': 'Length must be positive',
        'any.required': 'Length is required'
    }),
    '*Breadth (cm)': Joi.number().positive().required().messages({
        'number.base': 'Breadth must be a number',
        'number.positive': 'Breadth must be positive',
        'any.required': 'Breadth is required'
    }),
    '*Height (cm)': Joi.number().positive().required().messages({
        'number.base': 'Height must be a number',
        'number.positive': 'Height must be positive',
        'any.required': 'Height is required'
    }),
    '*Weight Of Shipment(kg)': Joi.number().positive().required().messages({
        'number.base': 'Weight must be a number',
        'number.positive': 'Weight must be positive',
        'any.required': 'Weight is required'
    }),
    'Send Notification(True/False)': Joi.string().valid('true', 'false').required().messages({
        'any.only': 'Send Notification must be "true" or "false"',
        'any.required': 'Send Notification is required'
    }),
    'Comment': Joi.string().allow(''),
    'HSN Code': Joi.string().allow(''),
    'Location Id': Joi.string().allow(''),
    'Reseller Name': Joi.string().allow(''),
    'Company Name': Joi.string().allow(''),
    'latitude': Joi.number().allow(''),
    'longitude': Joi.number().allow(''),
    'Verified Order': Joi.string().valid('1', '0').required().messages({
        'any.only': 'Verified Order must be "1" or "0"',
        'any.required': 'Verified Order is required'
    }),
    'Is documents': Joi.string().valid('Yes', 'No').allow(''),
    'Order Type': Joi.string().allow(''),
    'Order tag': Joi.string().allow('')
});

const bulkOrderExcelValidationSchema = Joi.object({
    '*Order Id': Joi.string().required().messages({
      'string.empty': 'Order ID is required',
      'any.required': 'Order ID is a mandatory field'
    }),
    'Order Date (DD-MM-YYYY) (Optional)': Joi.string().optional().pattern(/^\d{2}-\d{2}-\d{4}$/).messages({
      'string.pattern.base': 'Order Date must be in DD-MM-YYYY format'
    }),
    'Verified Order (Yes/No) (Optional)': Joi.string().valid('Yes', 'No').optional().messages({
      'any.only': 'Verified Order must be "Yes" or "No"'
    }),
    "*Buyer's Mobile No.": Joi.string().pattern(/^[0-9]{10}$/).required().messages({
      'string.empty': "Buyer's Mobile No. cannot be empty",
      'string.pattern.base': "Buyer's Mobile No. must be a valid 10-digit number",
      'any.required': "Buyer's Mobile No. is a mandatory field"
    }),
    "*Buyer's First Name": Joi.string().required().messages({
      'string.empty': 'Buyer\'s First Name is required',
      'any.required': 'Buyer\'s First Name is a mandatory field'
    }),
    "Buyer's Last Name (Optional)": Joi.string().optional().default("").messages({
      'string.empty': 'Buyer\'s Last Name is required',
    }),
    '*Shipping Complete Address': Joi.string().required().messages({
      'string.empty': 'Shipping Complete Address is required',
      'any.required': 'Shipping Complete Address is a mandatory field'
    }),
    'Shipping Address Landmark (Optional)': Joi.string().optional().messages({
      'string.empty': 'Shipping Address Landmark is optional',
      'any.required': 'Shipping Address Landmark is a optional field'
    }),
    '*Shipping Address Pincode': Joi.string().pattern(/^[0-9]{6}$/).required().messages({
      'string.pattern.base': 'Pincode must be a 6-digit number',
      'string.empty': 'Shipping Address Pincode is required',
      'any.required': 'Shipping Address Pincode is a mandatory field'
    }),
    '*Shipping Address City': Joi.string().required(),
    '*Shipping Address State': Joi.string().required(),
    '*Shipping Address Country': Joi.string().required(),
    'Email (Optional)': Joi.string().email().allow('').messages({
      'string.email': 'Email must be a valid email address'
    }),
    "Buyer's Alternate Mobile Number (Optional)": Joi.string().optional().messages({
      'string.empty': "Buyer's alternate mobile number are optional"
    }),
    "Buyer's Company Name (Optional)": Joi.string().optional().messages({
      'string.empty': 'Company name cannot be empty'
    }),
    "Buyer's GSTIN (Optional)": Joi.string().optional().messages({
      'string.empty': 'GST Number cannot be empty'
    }),
    'Billing Complete Address (Optional)': Joi.string().optional().messages({
      'string.empty': 'Complete address cannot be empty'
    }),
    'Billing Landmark (Optional)': Joi.string().optional().messages({
      'string.empty': 'Landmark cannot be empty'
    }),
    'Billing Pincode (Optional)': Joi.string().pattern(/^[0-9]{6}$/).optional().messages({
      'string.pattern.base': 'Pincode must be a 6-digit number',
      'string.empty': 'Pincode cannot be empty'
    }),
    'Billing City (Optional)': Joi.string().optional().messages({
      'string.empty': 'City cannot be empty'
    }),
    'Billing State (Optional)': Joi.string().optional().messages({
      'string.empty': 'State cannot be empty'
    }),
    'Billing Country (Optional)': Joi.string().optional().messages({
      'string.empty': 'Country cannot be empty'
    }),
    'Pickup Address Id (Optional)': Joi.string().optional().messages({
      'string.empty': 'Pickup Address Id cannot be empty'
    }),
    '*Order Channel': Joi.string().required(),
    '*Payment Method (COD/Prepaid)': Joi.string().required().valid('COD', 'Prepaid').messages({
      'any.only': 'Payment Method must be "COD" or "Prepaid"'
    }),
    '*Product Name': Joi.string().required(),
    '*Master SKU': Joi.string().required(),
    '*Product Quantity': Joi.number().integer().min(1).required().messages({
      'number.base': 'Product Quantity must be a number',
      'number.min': 'Product Quantity must be at least 1'
    }),
    '*Per Unit Price in INR (Inclusive of Tax)': Joi.number().min(0).required(),
    'Product Discount (Per Unit Item) (Optional)': Joi.number().min(0).max(100).optional(),
    'HSN Code (Optional)': Joi.string().optional(),
    'Tax Rate(percentage) (Optional)': Joi.number().min(0).max(100).optional(),
    'Shipping Charges (Per Order) (Optional)': Joi.number().min(0).optional(),
    'Gift Wrap Charges (Per Order) (Optional)': Joi.number().min(0).optional(),
    'Transaction Fee (Per Order) (Optional)': Joi.number().min(0).optional(),
    'Total Discount (Per Order) (Optional)': Joi.number().min(0).optional(),
    'Order Tag (Optional)': Joi.string().optional(),
    'Reseller Name (Optional)': Joi.string().optional(),
    '*Weight Of Shipment (kg)': Joi.number().min(0).required(),
    '*Length (cm)': Joi.number().min(0).required(),
    '*Breadth (cm)': Joi.number().min(0).required(),
    '*Height (cm)': Joi.number().min(0).required(),
    'Send Notification (Yes/No) (Optional)': Joi.string().valid('Yes', 'No').optional(),
    '*Contain Documents (Yes/No)': Joi.string().valid('Yes', 'No').required().messages({
      'any.only': 'Contain Documents must be "Yes" or "No"'
    }),
    'Courier ID (Optional)': Joi.string().optional()
  });

// const bulkOrderExcelValidationSchema = Joi.object({
//   '*Order Id': Joi.string().required().messages({
//     'string.empty': 'Order ID is required',
//     'any.required': 'Order ID is a mandatory field'
//   }),
//   'Order Date (DD-MM-YYYY) (Optional)': Joi.string().optional().pattern(/^\d{2}-\d{2}-\d{4}$/).messages({
//     'string.pattern.base': 'Order Date must be in DD-MM-YYYY format'
//   }),
//   'Verified Order (Yes/No) (Optional)': Joi.string().valid('Yes', 'No').optional().messages({
//     'any.only': 'Verified Order must be "Yes" or "No"'
//   }),
//   "*Buyer's Mobile No.": Joi.string().pattern(/^[0-9]{10}$/).required().messages({
//   'string.empty': "Buyer's Mobile No. cannot be empty",
//   'string.pattern.base': "Buyer's Mobile No. must be a valid 10-digit number",
//   'any.required': "Buyer's Mobile No. is a mandatory field"
//   }),
//   "*Buyer's First Name": Joi.string().required().messages({
//     'string.empty': 'Buyer\'s First Name is required',
//     'any.required': 'Buyer\'s First Name is a mandatory field'
//   }),
//   "Buyer's Last Name (Optional)": Joi.string().optional().default("").messages({
//     'string.empty': 'Buyer\'s Last Name is required',
//   }),
//   '*Shipping Complete Address': Joi.string().required().messages({
//     'string.empty': 'Shipping Complete Address is required',
//     'any.required': 'Shipping Complete Address is a mandatory field'
//   }),
//   'Shipping Address Landmark (Optional)': Joi.string().optional().messages({
//     'string.empty': 'Shipping Address Landmark is optional',
//     'any.required': 'Shipping Address Landmark is a optional field'
//   }),
//   '*Shipping Address Pincode': Joi.string().pattern(/^\d+$/).required().messages({
//     'string.empty': 'Shipping Address Pincode is required',
//     'any.required': 'Shipping Address Pincode is a mandatory field'
//   }),
//   '*Shipping Address City': Joi.string().required(),
//   '*Shipping Address State': Joi.string().required(),
//   '*Shipping Address Country': Joi.string().required(),
//   'Email (Optional)': Joi.string().email().allow('').messages({
//      'string.email': 'Email must be a valid email address'
//   }),
//   "Buyer's Alternate Mobile Number (Optional)":Joi.number().optional().messages({
//     'number.empty': "Buyer's alternate mobile number are optional"
//   }),
//   "Buyer's Company Name (Optional)":Joi.string().optional().messages({
//     'string.empty': 'Company name cannot be empty'
//   }),
//   "Buyer's GSTIN (Optional)":Joi.number().optional().messages({
//     'string.empty':'GST Number cannot be empty'
//   }),
//   'Billing Complete Address (Optional)':Joi.string().optional().messages({
//     'string.empty': 'Complete address cannot be empty'
//   }),
//   'Billing Landmark (Optional)':Joi.string().optional().messages({
//     'string.empty': 'Landmark cannot be empty'
//   }),
//   'Billing Pincode (Optional)': Joi.string().pattern(/^[0-9]{6}$/).required().messages({
//     'string.pattern.base': 'Pincode must be a 6-digit number',
//     'any.required': 'Pincode is required',
//     'string.empty': 'Pincode cannot be empty'
//   }),
//   'Billing City (Optional)': Joi.string().optional().messages({
//     'string.empty': 'City cannot be empty'
//   }),
//   'Billing State (Optional)': Joi.string().optional().messages({
//     'string.empty': 'State cannot be empty'
//   }),
//   'Billing Country (Optional)': Joi.string().optional().messages({
//     'string.empty': 'Country cannot be empty'
//   }),
//   'Pickup Address Id (Optional)': Joi.string().optional().messages({
//     'string.empty': 'Pickup Address Id cannot be empty'
//   }),
//   '*Order Channel': Joi.string().required(),
//   '*Payment Method (COD/Prepaid)': Joi.string().required().valid('COD', 'Prepaid').messages({
//     'any.only': 'Payment Method must be "COD" or "Prepaid"'
//   }),
//   '*Product Name': Joi.string().required(),
//   '*Master SKU': Joi.string().required(),
//   '*Product Quantity': Joi.number().integer().min(1).required().messages({
//     'number.base': 'Product Quantity must be a number',
//     'number.min': 'Product Quantity must be at least 1'
//   }),
//   '*Per Unit Price in INR (Inclusive of Tax)': Joi.number().min(0).required(),
//   'Product Discount (Per Unit Item) (Optional)': Joi.number().min(0).max(100).optional(),
//   'HSN Code (Optional)': Joi.string().optional(),
//   'Tax Rate(percentage) (Optional)':Joi.number().min(0).max(100).optional(),
//   'Shipping Charges (Per Order) (Optional)': Joi.number().min(0).optional(),
//   'Gift Wrap Charges (Per Order) (Optional)': Joi.number().min(0).optional(),
//   'Transaction Fee (Per Order) (Optional)': Joi.number().min(0).optional(),
//   'Total Discount (Per Order) (Optional)': Joi.number().min(0).optional(),
//   'Order Tag (Optional)': Joi.string().optional(),
//   'Reseller Name (Optional)': Joi.string().optional(),
//   '*Weight Of Shipment (kg)': Joi.number().min(0).required(),
//   '*Length (cm)': Joi.number().min(0).required(),
//   '*Breadth (cm)': Joi.number().min(0).required(),
//   '*Height (cm)': Joi.number().min(0).required(),
//   'Send Notification (Yes/No) (Optional)': Joi.string().valid('Yes', 'No').optional(),
//   '*Contain Documents (Yes/No)': Joi.string().valid('Yes', 'No').required().messages({
//     'any.only': 'Contain Documents must be "Yes" or "No"'
//   }),
//   'Courier ID (Optional)': Joi.number().optional()
// });



module.exports = {
     bulkOrderCSVvalidationSchema,
     bulkOrderExcelValidationSchema
};
