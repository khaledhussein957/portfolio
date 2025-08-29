import { usePortfolioStore } from "../store/backendStore";
import type { Project } from "../store/backendStore";
import { Github, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ProjectsSection = () => {
  const { projects, getProjects } = usePortfolioStore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return (
    <section id="projects" className="w-full py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-12 max-w-xl mx-auto">
          <div className="inline-block rounded-lg bg-black text-white px-3 py-1 text-sm">
            Open Source Projects
          </div>
          <h2 className="text-4xl font-extrabold mt-4">
            Featured Open Source Work
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base">
            While I've successfully delivered numerous private projects for
            clients, here are some of my open source contributions that showcase
            my technical expertise. Most of my commercial work remains private
            due to client confidentiality.
          </p>
        </div>

        <div className="flex flex-col gap-6 max-w-xl mx-auto">
          {projects?.map((project) => (
            <div
              key={project._id}
              onClick={() => setSelectedProject(project)}
              className="cursor-pointer rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-lg transition-all flex flex-col text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {project.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {project.description.slice(0, 99) + "..."}
              </p>

              <div className="flex flex-wrap gap-2 mb-3 mt-auto">
                {project.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded bg-secondary text-secondary-foreground dark:text-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={() => setSelectedProject(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selectedProject.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedProject.status ? (
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {selectedProject.status}
                    </span>
                  ) : null}
                </DialogDescription>
              </DialogHeader>

              {/* Image */}
              {selectedProject.image && (
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full rounded-lg border mb-4"
                />
              )}

              {/* Description */}
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {selectedProject.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedProject.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded bg-secondary text-secondary-foreground dark:text-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-3">
                {selectedProject.liveLink && (
                  <a
                    href={selectedProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm bg-black text-white px-3 py-1 rounded hover:opacity-90 transition"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
                {selectedProject.githubLink && (
                  <a
                    href={selectedProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm bg-black text-white px-3 py-1 rounded hover:opacity-90 transition"
                  >
                    <Github className="w-4 h-4" />
                    Source
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProjectsSection;
