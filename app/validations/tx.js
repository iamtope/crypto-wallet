import Joi from 'joi';

export const txSchema = Joi.object({
  to: Joi.string().min(40).required(),
  amount: Joi.string().required(),
  pin: Joi.number().max(9999).min(1000).required(),
  description: Joi.string()
});

export const walletPinSchema = Joi.object({
  pin: Joi.number().max(9999).min(1000).required()
});

export const btcSchema = Joi.object({
  to: Joi.string().min(26).required(),
  amount: Joi.string().required(),
  pin: Joi.number().max(9999).min(1000).required(),
});
