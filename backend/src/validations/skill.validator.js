import Joi from "joi";

export const createSkillValidator = Joi.object({
    groupName: Joi.string().required().messages({
        "string.empty": "Group name is required",
    }),
    skill: Joi.alternatives()
        .try(
            Joi.string().required().messages({ "string.empty": "Skill name is required" }),
            Joi.array().items(Joi.string().required().messages({ "string.empty": "Skill name is required" })).min(1)
        )
        .required(),
    icon: Joi.string().required().messages({
        "string.empty": "Icon URL is required",
    }),
});

export const updateSkillValidator = Joi.object({
    groupName: Joi.string().optional(),
    skill: Joi.alternatives()
        .try(
            Joi.string().optional(),
            Joi.array().items(Joi.string().required()).min(1)
        )
        .optional(),
    icon: Joi.string().uri().optional(),
});