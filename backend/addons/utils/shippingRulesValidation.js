const Joi = require('joi');

const shippingRuleSchema = Joi.object({

    ruleType: Joi.string().valid('B2C order', 'B2B order', 'Document order').required().messages({
        'string.base': 'Rule type must be a string',
        'any.required': 'Rule type is required',
        'any.only': 'Rule type must be one of B2C order, B2B order, or Document order',
    }),

    ruleName: Joi.string().required().messages({
        'string.base': 'Rule name must be a string',
        'any.required': 'Rule name is required',
    }),

    setPriority: Joi.number().required().messages({
        'number.base': 'Set priority must be a number',
        'any.required': 'Set priority is required',
    }),

    conditionType: Joi.string().valid('Match Any of the Below', 'Match All of the Below').required().messages({
        'string.base': 'Condition type must be a string',
        'any.required': 'Condition type is required',
        'any.only': 'Condition type must be one of Match Any of the Below, Match All of the Below',
    }),
    

    conditions: Joi.array().items(
        Joi.object({
            type: Joi.string().required().messages({
                'string.base': 'Condition type must be a string',
                'any.required': 'Condition type is required',
            }),
            operator: Joi.string().valid('is', 'is not').required().messages({
                'string.base': 'Operator must be a string',
                'any.required': 'Operator is required',
                'any.only': 'Operator must be either "is" or "is not"',
            }),
            value: Joi.string().required().messages({
                'string.base': 'Value must be a string',
                'any.required': 'Value is required',
            }),
        })
    ).required().messages({
        'array.base': 'Conditions must be an array',
        'any.required': 'Conditions are required',
    }),


    courierPriority: Joi.array().items(
        Joi.object({
            courierName: Joi.string().required().messages({
                'string.base': 'Courier name must be a string',
                'any.required': 'Courier name is required',
            }),
            priority: Joi.number().required().messages({
                'number.base': 'Priority must be a number',
                'any.required': 'Priority is required',
            }),
        })
    ).required().custom((value, helpers) => {
        const sortedPriorities = value.sort((a, b) => a.priority - b.priority);
        for (let i = 0; i < sortedPriorities.length; i++) {
            if (sortedPriorities[i].priority !== i + 1) {
                return helpers.error('any.invalid', { message: 'Priority numbers must start from 1 and be sequential.' });
            }
        }

        return value;
    }).messages({
        'array.base': 'Courier priorities must be an array',
        'any.required': 'Courier priorities are required',
    }),
}).unknown(true);

module.exports = shippingRuleSchema;
