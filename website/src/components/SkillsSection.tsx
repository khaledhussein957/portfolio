import { usePortfolioStore } from "../store/backendStore";
import { useEffect } from "react";

const SkillsSection = () => {
  const { skills, getSkills } = usePortfolioStore();

  useEffect(() => {
    getSkills();
  }, []);

  return (
    <section
      id="skills"
      className="w-full py-20 transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-12">
          Skills
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {skills?.length > 0 ? (
            skills.map((skill, index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md text-center transition-all"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  {skill.skill}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {skill.proficiency}
                </p>
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
