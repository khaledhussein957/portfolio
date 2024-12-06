import mongoose from 'mongoose'

const skillSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    proficiency: {
        type: Number,
        min: 0,
        max: 100
    },
},{
    timestamps: true
});

export const Skill = mongoose.model("Skill", skillSchema);