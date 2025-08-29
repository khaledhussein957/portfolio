import { useEffect } from "react";
import { usePortfolioStore } from "../store/backendStore";
import { ChevronRight, Globe } from "lucide-react";

const EducationSection = () => {
  const { user, getUser } = usePortfolioStore();

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <section id="education" className="w-full py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold">Education</h2>

        <div className="flex flex-col gap-y-4 w-full max-w-xl mx-auto mt-6">
          {user?.education?.map((edu, index) => (
            <div
              key={index}
              className="group cursor-pointer rounded-xl px-4 py-3 shadow-sm hover:shadow-md dark:shadow-[0_2px_8px_0_rgba(0,0,0,0.7)] transition-all"
            >
              {/* Institution + Years */}
              <div className="flex items-center justify-between gap-x-2">
                <h3 className="inline-flex items-center font-semibold text-sm sm:text-base">
                  {edu.institution}
                  <ChevronRight className="size-4 ml-1 transform translate-x-0 opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all duration-300 ease-out" />
                </h3>
                <div className="text-xs sm:text-sm tabular-nums text-muted-foreground">
                  {edu.startYear} - {edu.endYear}
                </div>
              </div>

              {/* Degree */}
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground text-left">
                {edu.degree}
              </p>

              {/* GPA + Website */}
              <div className="mt-2 flex items-center justify-between">
                {/* GPA */}
                {edu.gpa && (
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    GPA: {edu.gpa}
                  </span>
                )}

                {/* Website URI (hover + clickable) */}
                {edu.uri && (
                  <a
                    href={edu.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs sm:text-sm text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Globe className="w-3 h-3" />
                    {new URL(edu.uri).hostname}
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

export default EducationSection;
