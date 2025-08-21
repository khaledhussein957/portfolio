import { usePortfolioStore } from "../store/backendStore";
import { useEffect } from "react";

const SkillsSection = () => {
  const { skills, getSkills } = usePortfolioStore();

  useEffect(() => {
    getSkills();
  }, [getSkills]);

  return (
    <section
      id="skills"
      className="w-full py-20 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-12">Tech Stack & Tools</h2>

        <div className="flex flex-col gap-6 max-w-xl mx-auto">
          {skills?.length > 0 ? (
            skills.map((group, index) => (
              <div
                key={group._id || index}
                className="p-4 rounded-xl shadow-sm hover:shadow-md dark:shadow-[0_2px_8px_0_rgba(0,0,0,0.7)] text-center transition-all"
              >
                {group.icon && (
                  <img
                    src={group.icon}
                    alt={group.groupName}
                    className="mx-auto h-10 w-10 object-contain mb-2 dark:bg-white p-1 rounded"
                  />
                )}
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {group.groupName}
                </h3>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {Array.isArray(group.skill) ? (
                    group.skill.map((s, idx) => (
                      <span
                        key={idx}
                        className="inline-block  text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs border">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="inline-block text-black dark:text-white px-2 py-1 rounded text-xs border">
                      {group.skill}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
              No skills available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
