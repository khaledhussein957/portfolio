import { createSkillValidator, updateSkillValidator } from "../validations/skill.validator.js";

export const validateCreateSkill = (req, res, next) => {
    // If file is uploaded, skip icon validation in Joi
    let body = { ...req.body };
    if (req.file) {
        body.icon = req.file.path; // dummy value to pass Joi validation
    }
    const { error } = createSkillValidator.validate(body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

export const validateUpdateSkill = (req, res, next) => {
    let body = { ...req.body };
    if (req.file) {
        body.icon = req.file.path;
    }
    const { error } = updateSkillValidator.validate(body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};