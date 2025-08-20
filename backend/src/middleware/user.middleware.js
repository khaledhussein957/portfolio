import { changePasswordValidation, loginValidation, registerValidation, updateUserValidation } from "../validations/user.validator.js";

export const validateRegisterUser = (req, res, next) => {
    const {error} = registerValidation.validate(req.body);

    if(error){
        return res.status(400).json({message: error.details[0].message})
    }
    next();
}

export const validateLogin = (req, res, next) => {
    const {error} = loginValidation.validate(req.body);

    if(error){
        return res.status(400).json({message: error.details[0].message})
    }
    next();
}

export const validateUpdateUser = (req, res, next) => {
    const { error } = updateUserValidation.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};

export const validateChangePassword = (req, res, next) => {
    const { error } = changePasswordValidation.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
}