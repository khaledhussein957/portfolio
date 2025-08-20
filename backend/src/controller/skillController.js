import { Skill } from "../model/skillModel.js";
import cloudinary from "../config/cloudinary/cloudinary.js";

export const addSkill = async (req, res) => {
    try {
        const { groupName, skill } = req.body;
        if (!groupName || !skill) {
            return res.status(400).json({ error: "Please provide groupName and skill" });
        }

        // skill can be string or array depending on how it's sent
        if (!Array.isArray(skill)) {
            skill = [skill];
        }

        let iconUrl = "";
        if (req.file) {
            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "skills/icons"
            });
            iconUrl = result.secure_url;
        } else {
            return res.status(400).json({ error: "Please upload an icon image" });
        }

        const newSkill = new Skill({
            icon: iconUrl,
            groupName,
            skill,
        });
        const savedSkill = await newSkill.save();
        res.status(201).json(savedSkill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getSkills = async (req,res) =>{
    try {

        const skills = await Skill.find();
        if(!skills){
            return res.status(404).json({error:"Skills not found"});
        };

        res.status(200).json(skills);

    } catch (error) {
        console.log(`Error in getSkills ${error}`);
        res.status(500).json({error:error.message});
    }
};

export const deleteSkill = async (req,res) =>{
    try {
        const { id } = req.params;
        const deletedSkill = await Skill.findByIdAndDelete(id);
        if(!deletedSkill){
            return res.status(404).json({error:"Skill not found"});
        }
        res.status(200).json({message:"Skill deleted successfully"});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
};    

export const updateSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const { groupName } = req.body;
        let { skill } = req.body;
        if (!groupName || !skill) {
            return res.status(400).json({ error: "Please provide groupName and skill" });
        }
        if (!Array.isArray(skill)) {
            skill = [skill];
        }
        let updateData = { groupName, skill };

        if (req.file) {
            // Upload new icon to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "skills/icons"
            });
            updateData.icon = result.secure_url;
        }

        const updatedSkill = await Skill.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        if (!updatedSkill) {
            return res.status(404).json({ error: "Skill not found" });
        }
        res.status(200).json(updatedSkill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};