import { useEffect } from "react";
import { usePortfolioStore } from "../store/backendStore";
import { ChevronRight } from "lucide-react";

const EducationSection = () => {
  const { user, getUser } = usePortfolioStore();

  useEffect(() => {
    getUser();
  }, []); 

  return (
    <section
      id="education"
      className="w-full py-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold">Education</h2>

        <div className="flex flex-col gap-y-4 w-full max-w-xl mx-auto mt-6">
          {user?.education?.map((edu, index) => (
            <div
              key={index}
              className="group cursor-pointer border rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-900"
            >
              <div className="flex items-center justify-between gap-x-2">
                <h3 className="inline-flex items-center font-semibold text-sm sm:text-base">
                  {edu.institution}
                  <ChevronRight className="size-4 ml-1 transform translate-x-0 opacity-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all duration-300 ease-out" />
                </h3>
                <div className="text-xs sm:text-sm tabular-nums text-muted-foreground">
                  {edu.startYear} - {edu.endYear}
                </div>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground text-left">
                {edu.degree}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
