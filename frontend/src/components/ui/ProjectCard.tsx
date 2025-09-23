import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../router";
import { formatRelativeTime } from "../../utils/dateUtils";
import { cn } from "../../utils/helpers";
import AnimatedCard from "./AnimatedCard";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string;
    taskCount: number;
    completedTaskCount: number;
    progressPercentage: number;
    createdBy: string;
    creatorName: string;
    createdAt: string;
    updatedAt: string;
  };
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className }) => {
  const navigate = useNavigate();

  const handleProjectClick = () => {
    navigate(ROUTES.PROJECT_DETAIL(project.id));
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-blue-500";
    if (percentage >= 25) return "bg-yellow-500";
    return "bg-gray-400";
  };

  const getProgressGradient = (percentage: number) => {
    if (percentage >= 80) return "from-green-400 to-green-600";
    if (percentage >= 50) return "from-blue-400 to-blue-600";
    if (percentage >= 25) return "from-yellow-400 to-yellow-600";
    return "from-gray-300 to-gray-500";
  };

  return (
    <AnimatedCard
      onClick={handleProjectClick}
      variant="gradient"
      hover3d={true}
      className={cn("group cursor-pointer overflow-hidden relative", className)}
    >
      {/* Gradient overlay for enhanced 3D effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-50/20 to-purple-50/20 opacity-0 group-hover:opacity-100 transition-all duration-500" />

      {/* Animated mesh gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-pulse rounded-xl" />
      </div>

      <div className="p-6 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 truncate">
              {project.name}
            </h4>
            <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors">
              👤 by {project.creatorName}
            </p>
          </div>

          {/* Progress Circle with 3D effects */}
          <div className="flex flex-col items-center transform group-hover:scale-125 group-hover:-translate-y-2 group-hover:rotate-6 transition-all duration-500">
            <div className="relative w-16 h-16">
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-500">
                <div className={cn("w-full h-full rounded-full blur-md", getProgressColor(project.progressPercentage))} />
              </div>

              {/* Background circle */}
              <svg className="w-16 h-16 transform -rotate-90 relative z-10" viewBox="0 0 36 36">
                <path
                  className="text-gray-200 group-hover:text-gray-300 transition-colors duration-300"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Progress circle with animation */}
                <path
                  className={cn("transition-all duration-700 group-hover:drop-shadow-lg", getProgressColor(project.progressPercentage).replace('bg-', 'text-'))}
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="transparent"
                  strokeDasharray={`${project.progressPercentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                />
              </svg>

              {/* Percentage text with enhanced styling */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-all duration-300 group-hover:scale-110">
                  {project.progressPercentage}%
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors duration-300">
              Complete
            </div>
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {project.description}
          </p>
        )}

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500 bg-gradient-to-r",
                getProgressGradient(project.progressPercentage),
                "group-hover:shadow-lg transform group-hover:scale-y-110 origin-left"
              )}
              style={{ width: `${project.progressPercentage}%` }}
            />
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 text-gray-600 group-hover:text-gray-700 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">
                {project.completedTaskCount} of {project.taskCount} tasks
              </span>
            </div>

            <div className="flex items-center gap-1 text-gray-500 group-hover:text-gray-600 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">{formatRelativeTime(project.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced hover indicator with glow */}
      <div className="absolute inset-0 border-2 border-primary-200 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none group-hover:shadow-2xl group-hover:shadow-primary-500/30" />

      {/* Corner accent with animation */}
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary-100 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse" />

      {/* Floating elements */}
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
      </div>
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
      </div>
    </AnimatedCard>
  );
};

export default ProjectCard;