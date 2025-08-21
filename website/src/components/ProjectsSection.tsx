import { usePortfolioStore } from "../store/backendStore";
import { Github, Globe } from "lucide-react";
import { useEffect } from "react";

const ProjectsSection = () => {
  const { projects, getProjects } = usePortfolioStore();

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return (
    <section
      id="projects"
      className="w-full py-20"
    >
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
            my technical expertise. Most of my commercial work remains private due
            to client confidentiality.
          </p>
        </div>

        <div className="flex flex-col gap-6 max-w-xl mx-auto">
          {projects?.map((project) => (
            <div
              key={project._id}
              className="rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-lg transition-all flex flex-col text-left"
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

              <div className="flex gap-2 pt-2">
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs bg-black text-white px-2 py-1 rounded hover:opacity-90 transition"
                  >
                    <Globe className="w-3 h-3" />
                    Website
                  </a>
                )}
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs bg-black text-white px-2 py-1 rounded hover:opacity-90 transition"
                  >
                    <Github className="w-3 h-3" />
                    Source
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
