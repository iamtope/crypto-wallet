/* eslint-disable no-useless-escape */
import joi from '@hapi/joi';

/**
 * Validates a string input field
 * @param { Object } joi - Joi object.
 * @param { String } field - Field to be validated.
 * @returns { Object } A Joi validation schema.
 */
const nameSchema = (field) => joi
  .string()
  .required()
  .trim()
  .min(2)
  .max(30)
  .messages({
    'string.base': `The ${field} field parameter must be a string`,
    'string.empty': `The ${field} field cannot be an empty string`,
    'string.max': `${field} should not be more than 30 characters`,
    'string.min': `${field} should not be less than 2 characters`,
  });

/**
 * Validates a phonenumber input field
 * @param { Object } joi - Joi object.
 * @param { String } field - Field to be validated.
 * @returns { Object } A Joi validation schema.
 */
const phoneSchema = () => joi
  .string()
  .required()
  .trim()
  .pattern(new RegExp('[0-9+]+'))
  .min(7)
  .max(15)
  .messages({
    'string.base': 'Phone number must contain only numbers',
    'string.empty': 'Phone number cannot be empty',
    'object.pattern.match': 'Phone number must contain only numbers',
    'string.max': 'Phone number should not be more than 15 characters',
    'string.min': 'Phone number should not be less than 7 characters',
  });

/**
 * Validates a passwords input field
 * @param { Object } Joi - Joi object.
 * @param { String } field - Field to be validated.
 * @returns { Object } A Joi validation schema.
 */
const passwordSchema = (Joi) => Joi.string()
  .trim()
  .required()
  .pattern(new RegExp('^[a-zA-Z0-9@#%$!+:_|-]{5,30}$'))
  .messages({
    'string.base': 'Password must be a valid string',
    'string.empty': 'Password field cannot be empty',
    'any.required':
      'Password field is required else password cannot be updated',
    'object.pattern.match':
      'The only validate combinations are numbers, alphabets, and these characters: a-zA-Z0-9@#%$!+:_|-',
  });

/**
 * Validates an email
 * @param { Object } Joi - Joi object.
 * @param { String } field - Field to be validated.
 * @returns { Object } A Joi validation schema.
 */
const emailValidate = (Joi) => Joi.string().email().trim().required()
  .messages({
    'string.base': 'Email must be a valid string',
    'string.empty': 'Email field cannot be empty',
    'any.required': 'Email Address must be provided',
  });

/**
 * Validates user signup
 * @param { Object } Joi - Joi object.
 * @param { String } field - Field to be validated.
 * @returns { Object } A Joi validation schema.
 */
const userSchema = joi.object({
  first_name: joi.string().trim().lowercase({ convert: true }).required(),
  middle_name: joi.string().trim().lowercase({ convert: true }),
  last_name: joi.string().trim().lowercase({ convert: true }).required(),
  username: joi.string().trim().lowercase({ convert: true }).min(5)
    .required(),
  email: joi.string().trim().lowercase({ convert: true }).email()
    .required(),
  phone_number: joi.string().trim().pattern(new RegExp('[0-9+]+')).min(7)
    .max(15)
    .required()
    .messages({
      'string.base': 'Phone number must contain only numbers',
      'string.empty': 'Phone number cannot be empty',
      'object.pattern.match': 'Phone number must contain only numbers',
      'string.max': 'Phone number should not be more than 15 characters',
      'string.min': 'Phone number should not be less than 7 characters',
    }),
  date_of_birth: joi.date().required(),
  country: joi.string().trim().lowercase({ convert: true }).required(),
  city: joi.string().trim().lowercase({ convert: true }).required(),
  state: joi.string().trim().lowercase({ convert: true }).required(),
  password: joi.string().trim()
    .pattern(new RegExp('^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{5,30}$'))
    .required()
    .messages({
      'string.base': 'Password must be a valid string',
      'string.empty': 'Password field cannot be empty',
      'any.required': 'Password field is required',
      'string.max': 'Phone number should not be more than 30 characters',
      'string.min': 'Phone number should not be less than 5 characters',
      'object.pattern.match':
        'Password must contains at least a symbol, uppercase, lowercase, and number',
    })
});

/**
 * Validates user login
 * @param { Object } Joi - Joi object.
 * @param { String } field - Field to be validated.
 * @returns { Object } A Joi validation schema.
 */
const loginSchema = joi.object({
  login_details: joi.string(),
  password: joi.string().trim()
    .pattern(new RegExp('^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{5,30}$'))
    .required()
    .messages({
      'string.base': 'Password must be a valid string',
      'string.empty': 'Password field cannot be empty',
      'any.required': 'Password field is required',
      'string.max': 'Phone number should not be more than 30 characters',
      'string.min': 'Phone number should not be less than 5 characters',
      'object.pattern.match':
        'Password must contains at least a symbol, uppercase, lowercase, and number',
    })
});

export {
  nameSchema, phoneSchema, passwordSchema, emailValidate, userSchema,
  loginSchema
};
