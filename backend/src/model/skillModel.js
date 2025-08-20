import mongoose from "mongoose";

const skillSchema = mongoose.Schema(
  {
    icon: {
      type: String,
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },
    skill: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Skill = mongoose.model("Skill", skillSchema);
