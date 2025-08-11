import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define supported color and trend types
type StatCardColor =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "indigo"
  | "orange";

type StatCardSize = "small" | "default";
type StatCardTrend = "up" | "down" | "neutral";

// Props interface
interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ElementType;
  trend?: StatCardTrend;
  trendValue?: string;
  description?: string;
  color?: StatCardColor;
  size?: StatCardSize;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  description,
  color = "blue",
  size = "default",
  isLoading = false,
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    red: "bg-red-50 text-red-600 border-red-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };

  const iconColorClasses = {
    blue: "text-blue-500",
    green: "text-green-500",
    red: "text-red-500",
    yellow: "text-yellow-500",
    purple: "text-purple-500",
    indigo: "text-indigo-500",
    orange: "text-orange-500",
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
          </CardTitle>
          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`h-full transition-all duration-200 hover:shadow-md ${colorClasses[color]}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle
          className={`${
            size === "small" ? "text-xs" : "text-sm"
          } font-medium text-gray-600`}
        >
          {title}
        </CardTitle>
        {Icon && (
          <Icon
            className={`${size === "small" ? "h-4 w-4" : "h-5 w-5"} ${
              iconColorClasses[color]
            }`}
          />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div
            className={`${
              size === "small" ? "text-xl" : "text-2xl"
            } font-bold text-gray-900`}
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>

          {(trend || description) && (
            <div className="flex items-center gap-2">
              {trend && trendValue && (
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    trend === "up"
                      ? "text-green-600 border-green-200 bg-green-50"
                      : trend === "down"
                      ? "text-red-600 border-red-200 bg-red-50"
                      : "text-gray-600 border-gray-200 bg-gray-50"
                  }`}
                >
                  {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}{" "}
                  {trendValue}
                </Badge>
              )}
              {description && (
                <p className="text-xs text-gray-500 truncate">{description}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
