const Joi = require('joi');

const quickOrderValidateSchema = Joi.object({
    pickupAddress: Joi.string().pattern(/^[a-zA-Z0-9\s]+$/).required().messages({
        'string.pattern.base': 'Pickup address must only contain alpha-numeric characters',
        'any.required': 'Pickup address line is required',
        'string.empty': 'Pickup address line cannot be empty'
    }),
    buyerDetails: Joi.object({
      buyerName: Joi.string().pattern(/^[a-zA-Z\s]{2,}$/).required().messages({
        'string.pattern.base': 'Buyer name must have at least 2 characters and contain only letters.',
        'any.required': 'Buyer name is required',
        'string.empty': 'Buyer name cannot be empty'
      }),
      phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Phone number must be a 10-digit number',
        'any.required': 'Phone number is required',
        'string.empty': 'Phone number cannot be empty'
      }),
      alternatePhoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Alternate phone number must be a 10-digit number',
        'any.required': 'Alternate phone number is required',
        'string.empty': 'Alternate phone number cannot be empty'
      }),
      email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required',
        'string.empty': 'Email cannot be empty'
      })
    }).required().messages({
      'object.base': 'Buyer details must be an object',
      'any.required': 'Buyer details are required'
    }),
  
    buyerAddress: Joi.object({
      completeAddress: Joi.string().pattern(/^[a-zA-Z0-9\s]+$/).required().messages({
        'string.pattern.base': 'Complete address must only contain alpha-numeric characters',
        'any.required': 'Complete address is required',
        'string.empty': 'Complete address cannot be empty'
      }),
      landmark:Joi.string().pattern(/^[a-zA-Z0-9\s]+$/).required().messages({
        'string.pattern.base': 'Landmark must only contain alpha-numeric characters',
        'any.required': 'Landmark is required',
        'string.empty': 'Landmark cannot be empty'
      }),
      pincode: Joi.string().pattern(/^[0-9]{6}$/).required().messages({
        'string.pattern.base': 'Pincode must be a 6-digit number',
        'any.required': 'Pincode is required',
        'string.empty': 'Pincode cannot be empty'
      }),
      city: Joi.string().pattern(/^[a-zA-Z\s]+$/).required().messages({
        "string.pattern.base": 'City must only contain alphabetic characters and spaces',
        'any.required': 'City is required',
        'string.empty': 'City cannot be empty'
      }),
      state: Joi.string().pattern(/^[a-zA-Z\s]+$/).required().messages({
        "string.pattern.base": 'State must only contain alphabetic characters and spaces',
        'any.required': 'State is required',
        'string.empty': 'State cannot be empty'
      }),
      country: Joi.string().pattern(/^[a-zA-Z\s]+$/).required().messages({
        'string.pattern.base': 'Country must only contain alphabetic characters and spaces',
        'any.required': 'Country is required',
        'string.empty': 'Country cannot be empty'
      }),
      companyName:Joi.string().default("").optional().messages({
        'string.base': 'Company name must be a string',
      }),
      gstinNumber:Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/).default("").optional().messages({
        'string.pattern.base':'Invalid GSTIN number format.',
      }),
      billingAddressSameAsShipping:Joi.string().valid(true,false).required().messages({
        'string.base':'billing Address Same As Shipping must be a string',
        'any.required':'billing Address Same As Shipping is required',
        'string.empty':'billing Address Same As Shipping cannot be empty'
      })
    }).required().messages({
      'object.base': 'Buyer address must be an object',
      'any.required': 'Buyer address is required'
    }),
    shippingAddress:Joi.object({
        completeAddress:Joi.string().pattern(/^[a-zA-Z0-9\s]+$/).required().messages({
            'string.pattern.base': 'Complete address must only contain alpha-numeric characters',
            'any.required':'Complete Address is required',
            'string.empty':'Complete Address cannot be empty'
        }),
        landmark:Joi.string().pattern(/^[a-zA-Z0-9\s]+$/).required().messages({
            'string.pattern.base': 'Landmark must only contain alpha-numeric characters',
            'any.required':'Landmark is required',
            'string.empty':'Landmark cannot be empty'
        }),
        pincode: Joi.string().pattern(/^[0-9]{6}$/).required().messages({
            'string.pattern.base': 'Pincode must be a 6-digit number',
            'any.required': 'Pincode is required',
            'string.empty': 'Pincode cannot be empty'
        }),
        city: Joi.string().pattern(/^[a-zA-Z\s]+$/).required().messages({
            'string.pattern.base': 'City must only contain alphabetic characters and spaces',
            'any.required': 'City is required',
            'string.empty': 'City cannot be empty'
        }),
        state: Joi.string().pattern(/^[a-zA-Z\s]+$/).required().messages({
            'string.pattern.base': 'State must only contain alphabetic characters and spaces',
            'any.required': 'State is required',
            'string.empty': 'State cannot be empty'
        }),
        country: Joi.string().pattern(/^[a-zA-Z\s]+$/).required().messages({
            'string.pattern.base': 'Country must only contain alphabetic characters and spaces',
            'any.required': 'Country is required',
            'string.empty': 'Country cannot be empty'
        }),
    }),

    productDetails: Joi.array().items(
      Joi.object({
        productName: Joi.string().pattern(/^[a-zA-Z0-9\s]+$/).required().messages({
          'string.pattern.base': 'Product name must only contain alpha-numeric characters and spaces',
          'any.required': 'Product name is required',
          'string.empty': 'Product name cannot be empty'
        }),
        quantity: Joi.number().positive().required().messages({
          'number.base': 'Quantity must be a number',
          'any.required': 'Quantity is required',
          'number.empty': 'Quantity cannot be empty'
        }),
        unitPrice: Joi.number().positive().required().messages({
          'number.base': 'Unit price must be a number',
          'any.required': 'Unit price is required',
          'number.empty': 'Unit price cannot be empty'
        }),
        category: Joi.string().required().messages({
          'string.base': 'Product category must be a string',
          'any.required': 'Product category is required',
          'string.empty': 'Product category cannot be empty'
        }),
      })
    ).required().messages({
      'array.base': 'Product details must be an array',
      'any.required': 'Product details are required'
    }),
    packageDetails: Joi.object({
        weight: Joi.number().required().messages({
            'number.base': 'Weight must be a number',
            'any.required': 'Weight is required', 
            'number.empty': 'Weight cannot be empty'
        }),
        dimensions:Joi.object({
            length: Joi.number().positive().required().messages({
                "number.base": "Length must be a number",
                "any.required": "Length is required",
              }),
              breadth: Joi.number().positive().required().messages({
                "number.base": "Breadth must be a number",
                "any.required": "Breadth is required",
              }),
              height: Joi.number().positive().required().messages({
                "number.base": "Height must be a number",
                "any.required": "Height is required",
              }),
        }).required().messages({
            'object.base': 'Dimensions must be an object',
            'any.required': 'Dimensions details are required'
        }),
        volumetricWeight: Joi.number().optional().messages({
            'number.base': 'Volumetric weight must be a number'
        })
    }).required().messages({
        'object.base': 'Package details must be an object',
        'any.required': 'Package details are required'
    }),
    paymentMethod: Joi.string().valid('COD', 'Prepaid').required().messages({
        'string.base': 'Payment method must be a string',
        'any.required': 'Payment method is required',
        'string.empty': 'Payment method cannot be empty'
      })
    });

module.exports = {
    quickOrderValidateSchema
}