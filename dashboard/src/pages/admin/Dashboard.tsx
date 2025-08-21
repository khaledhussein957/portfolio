import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/AuthStore";
import { useProjectStore } from "../../stores/ProjectStore";
import { useSkillStore } from "../../stores/SkillStore";
import StatCard from "@/components/StatCard";
import { Briefcase, Star } from "lucide-react";
import Header from "@/components/Header";
import { useOutletContext } from "react-router-dom";
import { useUserStore } from "@/stores/UserStore";

// Helper function to calculate trend
const calculateTrend = (items: { createdAt: string }[]) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthItems = items.filter((item) => {
    const itemDate = new Date(item.createdAt);
    return (
      itemDate.getMonth() === currentMonth &&
      itemDate.getFullYear() === currentYear
    );
  });

  const lastMonthDate = new Date(now.setMonth(now.getMonth() - 1));
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  const lastMonthItems = items.filter((item) => {
    const itemDate = new Date(item.createdAt);
    return (
      itemDate.getMonth() === lastMonth &&
      itemDate.getFullYear() === lastMonthYear
    );
  });

  const thisMonthCount = thisMonthItems.length;
  const lastMonthCount = lastMonthItems.length;

  if (lastMonthCount === 0) {
    return {
      trend: thisMonthCount > 0 ? "up" : "neutral",
      trendValue: thisMonthCount > 0 ? "+100%" : "0%",
    };
  }

  const percentageChange =
    ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100;

  return {
    trend: percentageChange >= 0 ? "up" : "down",
    trendValue: `${percentageChange >= 0 ? "+" : ""}${percentageChange.toFixed(
      0
    )}%`,
  };
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const { getUser } = useUserStore();
  const { projects, getProjects } = useProjectStore();
  const { skills, getSkills } = useSkillStore();
  const [loading, setLoading] = useState(true);

  const { onToggleSidebar } = useOutletContext<{
    onToggleSidebar: () => void;
  }>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getProjects(), getSkills()]);
      setLoading(false);
    };
    fetchData();
    getUser();
  }, [getProjects, getSkills, getUser]);

  const projectTrend = calculateTrend(projects);
  const skillTrend = calculateTrend(skills);

  return (
    <>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Overview" onToggleSidebar={onToggleSidebar} />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
            Welcome, {user?.name}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This is your dashboard. From here, you can manage your profile,
            projects, and skills.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <StatCard
              title="Projects"
              value={projects.length}
              icon={Briefcase}
              trend={projectTrend.trend as "up" | "down" | "neutral"}
              trendValue={projectTrend.trendValue}
              description="vs. last month"
              color="green"
              isLoading={loading}
            />
            <StatCard
              title="Skills"
              value={skills.length}
              icon={Star}
              trend={skillTrend.trend as "up" | "down" | "neutral"}
              trendValue={skillTrend.trendValue}
              description="vs. last month"
              color="indigo"
              isLoading={loading}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
