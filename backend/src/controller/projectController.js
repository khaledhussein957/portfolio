import { Project } from "../model/projectModel.js";

import cloudinary from "../config/cloudinary/cloudinary.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProject = async (req, res) => {
  const { title, description, technologies, githubLink, liveLink, status } =
    req.body;

  if (!title || !description || !technologies || !githubLink || !status) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let image;
  if (req.file) {
    const uploadedResponse = await cloudinary.uploader.upload(req.file.path);
    image = uploadedResponse.secure_url;
  }

  try {
    const newProject = new Project({
      title,
      description,
      image,
      technologies,
      githubLink,
      liveLink,
      status,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    technologies,
    githubLink,
    liveLink,
    status,
  } = req.body;

  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    let image;
    if (req.file) {
      if (project.image) {
        await cloudinary.uploader.destroy(
          project.image.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(image);
      image = uploadedResponse.secure_url;
    }

    project.title = title || project.title;
    project.image = image || project.image;
    project.description = description || project.description;
    project.technologies = technologies || project.technologies;
    project.githubLink = githubLink || project.githubLink;
    project.liveLink = liveLink || project.liveLink;
    project.status = status || project.status;

    await project.save();

    res.status(200).json({ message: "Project updated successfully" });
  } catch (error) {
    console.log("Error in updateProject ", error);
    res.status(400).json({ message: error.message });
  }
};
