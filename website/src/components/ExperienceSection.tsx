import { useEffect } from "react";
import { usePortfolioStore } from "../store/backendStore";
import { ChevronRight } from "lucide-react";

const ExperienceSection = () => {
  const { user, getUser } = usePortfolioStore();

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <section
      id="experience"
      className="w-full py-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-12">
          Experience
        </h2>

        <div className="flex flex-col gap-6 max-w-xl mx-auto">
          {user?.experience?.map((exp, index) => (
            <div
              key={index}
              className="group p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="inline-flex items-center gap-x-1 font-semibold text-sm sm:text-base">
                  {exp.company}
                  <ChevronRight className="w-4 h-4 translate-x-0 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
                </h3>
                <span className="text-xs sm:text-sm text-muted-foreground tabular-nums">
                  {exp.startYear} - {exp.endYear}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{exp.position}</p>
            </div>
          )) || (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No experience available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
