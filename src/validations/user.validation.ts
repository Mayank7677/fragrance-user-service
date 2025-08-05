import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string().trim().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
});