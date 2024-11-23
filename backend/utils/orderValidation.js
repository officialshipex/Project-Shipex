const Joi = require('joi');

const orderValidateSchema = Joi.object({
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
        "string.pattern.base": 'complete address must only contain alpha-numeric characters',
        'any.required': 'Complete address is required',
        'string.empty': 'Complete address cannot be empty'
      }),
      landmark:Joi.string().pattern(/^[a-zA-Z0-9\s]+$/).required().messages({
        "string.pattern.base": 'Landmark must only contain alpha-numeric characters',
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
        "string.pattern.base": 'Country must only contain alphabetic characters and spaces',
        'any.required': 'Country is required',
        'string.empty': 'Country cannot be empty'
      }),
      companyName:Joi.string().required().messages({
        'string.base': 'Company name must be a string',
        'any.required': 'Company name is required',
        'string.empty': 'Company name cannot be empty'
      }),
      gstinNumber:Joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/).required().messages({
        'string.base':'GST Number must be a string',
        'any.required':'GST Number is required',
        'string.empty':'GST Number cannot be empty'
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
  
    orderDetails: Joi.object({
      orderId: Joi.string().pattern(/^[a-zA-Z0-9]+$/).required().messages({
        "string.pattern.base": 'Order ID must only contain alpha-numeric characters',
        'any.required': 'Order ID is required',
        'string.empty': 'Order ID cannot be empty'
      }),
      orderType: Joi.string().valid('Standard', 'Express').required().messages({
        'string.base': 'Order type must be a string',
        'any.required': 'Order type is required',
        'string.empty': 'Order type cannot be empty'
      }),
      orderDate: Joi.string().isoDate().required().messages({
        'string.base': 'Order date must be a valid ISO date',
        'any.required': 'Order date is required',
        'string.empty': 'Order date cannot be empty'
      }),
      shippingCharges: Joi.number().positive().required().messages({
        'number.base': 'Shipping charges must be a number',
        'any.required': 'Shipping charges are required',
        'number.empty': 'Shipping charges cannot be empty'
      }),
      giftWrap:Joi.number().default(0).optional().messages({
        'number.base': 'Giftwrap must be a number'
      }),
      transaction: Joi.number().default(0).optional().messages({
        'number.base': 'Transaction must be a number'
      }),
      additionalDiscount: Joi.number().default(0).optional().messages({
        'number.base': 'Additional Discount must be a number'
      }),
      subTotal: Joi.number().default(0).optional().messages({
        'number.base': 'Sub Total must be a number'
      }),
      otherCharges: Joi.number().default(0).optional().messages({
        'number.base': 'Other charges must be a number'
      }),
      totalOrderValue: Joi.number().default(0).optional().messages({
        'number.base': 'Total order value must be a number'
      })
    }).required().messages({
      'object.base': 'Order details must be an object',
      'any.required': 'Order details are required'
    }),
  
    productDetails: Joi.array().items(
      Joi.object({
        productName: Joi.string().pattern(/^[a-zA-Z0-9\s]+$/).required().messages({
          'string.pattern.base': 'Product name must only contain alpha-numeric characters',
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
        SKU: Joi.string().required().messages({
          'string.base': 'SKU must be a string',
          'any.required': 'SKU is required',
          'string.empty': 'SKU cannot be empty'
        }),
        HSN: Joi.string().required().messages({
          'string.base': 'HSN must be a string',
          'any.required': 'HSN is required',
          'string.empty': 'HSN cannot be empty'
        }),
        taxRate: Joi.number().min(0).max(100).required().messages({
          'number.base': 'Tax rate must be a number',
          'any.required': 'Tax rate is required',
          'number.empty': 'Tax rate cannot be empty'
        }),
        productCategory: Joi.string().required().messages({
          'string.base': 'Product category must be a string',
          'any.required': 'Product category is required',
          'string.empty': 'Product category cannot be empty'
        }),
        discount: Joi.number().min(0).optional().messages({
          'number.base': 'Discount must be a number'
        })
      })
    ).required().messages({
      'array.base': 'Product details must be an array',
      'any.required': 'Product details are required'
    }),
  
    payment: Joi.object({
      PaymentMethod: Joi.string().valid('COD', 'Prepaid').required().messages({
        'string.base': 'Payment method must be a string',
        'any.required': 'Payment method is required',
        'string.empty': 'Payment method cannot be empty'
      })
    }).required().messages({
      'object.base': 'Payment details must be an object',
      'any.required': 'Payment details are required'
    }),
  
    packageDetails: Joi.object({
      weight: Joi.number().required().messages({
        'number.base': 'Weight must be a number',
        'any.required': 'Weight is required', 
        'number.empty': 'Weight cannot be empty'
      }),
      volumetricWeight: Joi.number().optional().messages({
        'number.base': 'Volumetric weight must be a number'
      })
    }).required().messages({
      'object.base': 'Package details must be an object',
      'any.required': 'Package details are required'
    }),
  
    pickUpAddress: Joi.object({
      primary: Joi.object({
        addressLine: Joi.string().pattern(/^[a-zA-Z0-9\s]+$/).required().messages({
          'string.pattern.base': 'Primary address line must be a string',
          'any.required': 'Primary address line is required',
          'string.empty': 'Primary address line cannot be empty'
        }),
        city: Joi.string().required().messages({
          'string.base': 'City must be a string',
          'any.required': 'City is required',
          'string.empty': 'City cannot be empty'
        }),
        state: Joi.string().required().messages({
          'string.base': 'State must be a string',
          'any.required': 'State is required',
          'string.empty': 'State cannot be empty'
        }),
        country: Joi.string().required().messages({
          'string.base': 'Country must be a string',
          'any.required': 'Country is required',
          'string.empty': 'Country cannot be empty'
        }),
        pincode: Joi.string().pattern(/^[0-9]{6}$/).required().messages({
          'string.pattern.base': 'Pincode must be a 6-digit number',
          'any.required': 'Pincode is required',
          'string.empty': 'Pincode cannot be empty'
        })
      }).required().messages({
        'object.base': 'Primary address must be an object',
        'any.required': 'Primary address is required'
      }),
      additionalAddresses: Joi.array().items(
        Joi.object({
          addressLine: Joi.string().pattern(/^[a-zA-z0-9\s]+$/).required().messages({
            'string.pattern.base': 'Address line must be a string',
            'any.required': 'Address line is required',
            'string.empty': 'Address line cannot be empty'
          }),
          city: Joi.string().pattern(/^[a-zA-Z\s]+$/).required().messages({
            'string.pattern.base': 'City must be a string',
            'any.required': 'City is required',
            'string.empty': 'City cannot be empty'
          }),
          state: Joi.string().pattern(/^[a-zA-Z\s]+$/).required().messages({
            'string.pattern.base': 'State must be a string',
            'any.required': 'State is required',
            'string.empty': 'State cannot be empty'
          }),
          country: Joi.string().pattern(/^[a-zA-Z\s]+$/).required().messages({
            'string.pattern.base': 'Country must be a string',
            'any.required': 'Country is required',
            'string.empty': 'Country cannot be empty'
          }),
          pincode: Joi.string().pattern(/^[0-9]{6}$/).required().messages({
            'string.pattern.base': 'Pincode must be a 6-digit number',
            'any.required': 'Pincode is required',
            'string.empty': 'Pincode cannot be empty'
          })
        })
      ).optional()
    }).required().messages({
      'object.base': 'Pick-up address must be an object',
      'any.required': 'Pick-up address is required'
    })
});

module.exports = {
  orderValidateSchema
}