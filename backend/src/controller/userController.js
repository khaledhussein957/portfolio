import bcryptjs from "bcryptjs";
import { User } from "../model/userModel.js";
import cloudinary from "../config/cloudinary/cloudinary.js";

export const updateUser = async (req, res) => {
    const userID = req.userId;
    const {
        name,
        title,
        bio,
        education,
        experience,
    } = req.body;

    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = name || user.name;
        user.title = title || user.title;
        user.bio = bio || user.bio;


        if (education) {
            user.education = typeof education === 'string' ? JSON.parse(education) : education;
        }
        if (experience) {
            user.experience = typeof experience === 'string' ? JSON.parse(experience) : experience;
        }

        if (req.file && req.file.path) {
            if (user.image) {
                const publicId = user.image.split("/").pop()?.split(".")[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId.toString());
                }
            }
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "profile-pictures" });
            user.image = result.secure_url;
        }

        await user.save();
        user.password = undefined;

        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error in updateUser:", error);
        res.status(500).json({ message: "Failed to update user", error: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const userID = req.userId;

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userID);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!currentPassword, newPassword) return res.status(400).json({ message: "All field are required" });

        // check if user password is same with password
        const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

        if (newPassword.length < 8) return res.status(400).json({
            message: "New password must be at least 8 characters long",
        });

        // hash the new password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({ message: "password updated successfully" });
    } catch (error) {
        console.error("Error in changePassword:", error);
        res.status(500).json({ message: "Failed to update user password", error: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        // find all users
        const user = await User.findOne().select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            user
        });
    } catch (error) {
        console.error("Error in getUser:", error);
        res.status(500).json({ message: "Failed to get user", error: error.message });
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