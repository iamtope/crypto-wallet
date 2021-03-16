import Joi from 'joi';

export default Joi.object({
  to: Joi.string().length(40).required(),
  amount: Joi.string().required(),
  description: Joi.string()
});
