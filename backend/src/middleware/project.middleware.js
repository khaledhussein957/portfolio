import { createProjectValidator, updateProjectValidator } from "../validations/project.validator.js";

export const validateCreateProject = (req, res, next) => {
    const { error } = createProjectValidator.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

export const validateUpdateProject = (req, res, next) => {
    const { error } = updateProjectValidator.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};