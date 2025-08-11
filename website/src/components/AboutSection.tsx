import { usePortfolioStore } from "../store/backendStore";
import { useEffect } from "react";

const AboutSection = () => {
  const { user, getUser } = usePortfolioStore();

  useEffect(() => {
    getUser();
  }, []);

  return (
    <section
      id="about"
      className="w-full py-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold">About</h2>
        <div className="prose max-w-xl mx-auto text-muted-foreground dark:prose-invert mt-4">
          <p>{user?.bio}</p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
