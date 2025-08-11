import mongoose from 'mongoose'

const skillSchema = mongoose.Schema({
    skill: {
        type: String,
        required: true
    },
    proficiency: {
        type: String,
        required: true,
        enum: ["Beginner", "Intermediate", "Advanced", "Expert"]
    },
},{
    timestamps: true
});

export const Skill = mongoose.model("Skill", skillSchema);