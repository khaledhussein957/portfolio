import Joi from "joi";

export const createProjectValidator = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required",
  }),
  image: Joi.string().uri().optional().messages({
    "string.uri": "Image must be a valid URL",
  }),
  technologies: Joi.array().optional().messages({
    "array.base": "Technologies must be an array",
    "array.empty": "Technologies cannot be empty",
  }),
  githubLink: Joi.string().uri().required().messages({
    "string.empty": "GitHub link is required",
    "string.uri": "GitHub link must be a valid URL",
  }),
  liveLink: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Live link must be a valid URL",
  }),
  status: Joi.string()
    .required()
    .messages({
      "string.empty": "Status is required",
    })
    .valid("In Progress", "Complete")
    .messages({
      "any.only": "Status must be either 'In Progress' or 'Complete'",
    }),
});

export const updateProjectValidator = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  image: Joi.string().uri().optional(),
  technologies: Joi.array().optional().messages({
    "array.base": "Technologies must be an array",
    "array.empty": "Technologies cannot be empty",
  }),
  githubLink: Joi.string().uri().optional(),
  liveLink: Joi.string().uri().optional(),
  status: Joi.string().optional().valid("In Progress", "Complete").messages({
    "any.only": "Status must be either 'In Progress' or 'Complete'",
  }),
});
