import { usePortfolioStore } from "../store/backendStore";
import { useEffect } from "react";

function HeroSection() {
  const { user, getUser } = usePortfolioStore();

  useEffect(() => {
    getUser();
  }, []);

  return (
    <section
      id="hero"
      className="h-screen flex justify-center items-center text-center"
    >
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl sm:text-5xl xl:text-6xl font-bold tracking-tight">
          Hi, I'm {user?.name}
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          {user?.title}
        </p>
      </div>
    </section>
  );
}

export default HeroSection;
