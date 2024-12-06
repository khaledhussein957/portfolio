import { Skill } from "../model/skillModel.js";

export const addSkill = async (req,res) =>{
    try {
        const { skill, proficiency } = req.body;

        if(!skill || !proficiency){
            return res.status(400).json({error:"Please provide skill and proficiency"});
        };
        
        const newSkill = new Skill({
            skill,
            proficiency,
        });
        const savedSkill = await newSkill.save();
        res.status(201).json(savedSkill);
    } catch (error) {
        res.status(500).json({error:error.message});
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

export const updateSkill = async (req,res) =>{
    try {
        const { id } = req.params;
        const { skill, proficiency } = req.body;
        const updatedSkill = await Skill.findByIdAndUpdate(id,{ skill, proficiency },{new:true});
        if(!updatedSkill){
            return res.status(404).json({error:"Skill not found"});
        }
        res.status(200).json(updatedSkill);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
};