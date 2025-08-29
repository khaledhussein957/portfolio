import Joi from "joi";

export const registerValidation = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

export const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

export const updateUserValidation = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),

    // Optional fields
    image: Joi.string().uri(),
    title: Joi.string().max(100),
    bio: Joi.string().min(20).max(1000),

    // education
    education: Joi.array().items(
        Joi.object({
            institution: Joi.string().required(),
            degree: Joi.string().required(),
            startYear: Joi.string().allow('').optional(),
            endYear: Joi.string().allow('').optional(),
            gpa: Joi.string().allow('').optional(),
            uri: Joi.string().uri().allow('').optional(),
        })
    ),

    // experience
    experience: Joi.array().items(
        Joi.object({
            company: Joi.string().required(),
            position: Joi.string().required(),
            startYear: Joi.string().allow('').optional(),
            endYear: Joi.string().allow('').optional(),
            uri: Joi.string().uri().allow('').optional(),
        })
    )
}).or('name', 'email');

export const changePasswordValidation = Joi.object({
    currentPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required(),
});