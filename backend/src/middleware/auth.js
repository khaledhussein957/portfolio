import jwt from 'jsonwebtoken'
import dotenv from "dotenv";

dotenv.config();

const jwtAuth = (req, res, next) => {

    // 1. Read the token from the cookie
    const token = req.cookies.token;
    console.log(`token: ${token}`);

    try {

        // 2. if no token, return the error
        if (!token) {
            return res.status(401).send(" missed token from cookies Unauthorized");
        }

        // 3. check if token is valid
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(401).send("Error happen Unauthorized");
        }
        console.log(`decode: ${decode}`);

        req.userId = decode.userId;
        console.log(`req.userId: ${req.userId}`);

        next();

    } catch (err) {
        // 4. return error
        console.log(err);
        return res.status(401).send("Error happen Unauthorized");
    }
};

export default jwtAuth;
