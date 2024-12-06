import bcryptjs from "bcryptjs";

import { User } from "../model/userModel.js";
import cloudinary from "../config/cloudinary/cloudinary.js";

export const updateUser = async (req, res) => {
    const userID = req.user._id;
    const { name, email, currentPassword, newPassword , image} = req.body;

    try {

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcryptjs.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }
        
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        if (image) {
			if (user.image) {
				await cloudinary.uploader.destroy(user.image.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(image);
			image = uploadedResponse.secure_url;
		};

        user.name = name || user.name;
        user.email = email || user.email;
        user.password = hashedPassword || user.password;
        user.image = image || user.image;

        await user.save();

        user.password = null;

        res.status(200).json({ message: "User updated successfully", user });


    } catch (error) {
        
        console.log("Error in updateUser ", error);
        res.status(400).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    
    const userID = req.user._id;
    try {
        const user = await User.findByIdAndDelete(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });        
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        
        console.log("Error in deleteUser ", error);
        res.status(400).json({ message: error.message });
    }
};