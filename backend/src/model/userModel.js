import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  startYear: {
    type: String,
  },
  endYear: {
    type: String,
  },
  gpa: {
    type: String,
  },
  uri: {
    type: String,
  }
});

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  startYear: {
    type: String,
  },
  endYear: {
    type: String,
  },
  uri: {
    type: String,
  }
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    education: [educationSchema],
    experience: [experienceSchema],
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);