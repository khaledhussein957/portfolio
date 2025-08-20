import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      require: true,
    },
    technologies: [String],
    githubLink: {
      type: String,
      require: true,
    },
    liveLink: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["In Progress", "Complete"],
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model("Project", projectSchema);
