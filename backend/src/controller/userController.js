import bcryptjs from "bcryptjs";
import { User } from "../model/userModel.js";
import cloudinary from "../config/cloudinary/cloudinary.js";

export const updateUser = async (req, res) => {
    const userID = req.userId;
    const { name, currentPassword, newPassword, image } = req.body;

    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }


        // Check if the current password is correct
        if (currentPassword) {
            const isMatch = await bcryptjs.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
        } else {
            return res.status(400).json({ message: "Current password is required" });
        }

        // Update user name
        user.name = name || user.name;


        if (newPassword) {
            const hashedPassword = await bcryptjs.hash(newPassword, 10);
            user.password = hashedPassword || user.password; // Update the password
        }


        if (image) {
            // Delete the old image from Cloudinary if it exists
            if (user.image) {
                await cloudinary.uploader.destroy(user.image.split("/").pop().split(".")[0]);
            }

            // Upload the new image to Cloudinary
            const uploadedResponse = await cloudinary.uploader.upload(image);
            user.image = uploadedResponse.secure_url; // Update the image URL
        }



        await user.save();

        // Remove the password from the response for security
        user.password = null;

        // Send a success response
        res.status(200).json({ message: "User  updated successfully", user });

    } catch (error) {
        console.log("Error in updateUser  ", error);
        res.status(400).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {

    const userID = req.userId;
    try {
        const user = await User.findByIdAndDelete(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.image) {
            await cloudinary.uploader.destroy(user.image.split("/").pop().split(".")[0]);
        };

        res.clearCookie("token");

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {

        console.log("Error in deleteUser ", error);
        res.status(400).json({ message: error.message });
    }
};