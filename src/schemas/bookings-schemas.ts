import Joi from 'joi';

export const roomSchema = Joi.object({
    roomId: Joi.number().required(),
});
