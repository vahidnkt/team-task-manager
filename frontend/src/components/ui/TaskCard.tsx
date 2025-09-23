import React from "react";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { ROUTES } from "../../router";
import { cn } from "../../utils/helpers";
import AnimatedCard from "./AnimatedCard";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    status: "todo" | "in_progress" | "done";
    priority: "low" | "medium" | "high";
    dueDate?: string;
    projectId: string;
    projectName: string;
    assigneeId?: string;
    assigneeName?: string;
    createdAt: string;
  };
  className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, className }) => {
  const navigate = useNavigate();

  const handleTaskClick = () => {
    navigate(ROUTES.TASK_DETAIL(task.id));
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <AnimatedCard
      onClick={handleTaskClick}
      variant="default"
      hover3d={true}
      className={cn(
        "group cursor-pointer overflow-hidden relative",
        isOverdue && "ring-2 ring-red-200 border-red-200",
        className
      )}
    >
      {/* Gradient overlay for enhanced 3D effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-all duration-500" />

      {/* Ripple effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl animate-pulse" />
      </div>

      <div className="p-4 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 truncate">
              {task.title}
            </h4>
            <p className="text-sm text-gray-600 mt-1 font-medium group-hover:text-gray-700 transition-colors">
              📁 {task.projectName}
            </p>
            {task.description && (
              <p className="text-sm text-gray-500 mt-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
                {task.description}
              </p>
            )}
          </div>

          {/* Badges Container with 3D effect */}
          <div className="flex flex-col items-end space-y-2 ml-4 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500">
            <div className="transform group-hover:rotate-3 transition-transform duration-300">
              <StatusBadge status={task.status} />
            </div>
            <div className="transform group-hover:-rotate-3 transition-transform duration-300" style={{ transitionDelay: '0.1s' }}>
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
        </div>

        {/* Due date and assignee info */}
        <div className="mt-4 pt-3 border-t border-gray-100 group-hover:border-gray-200 transition-colors">
          <div className="flex items-center justify-between text-xs">
            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-1",
                isOverdue ? "text-red-600" : "text-gray-500"
              )}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">
                  {isOverdue ? "Overdue: " : "Due: "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}

            {task.assigneeName && (
              <div className="flex items-center gap-1 text-gray-500">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{task.assigneeName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced hover indicator with glow */}
      <div className="absolute inset-0 border-2 border-primary-200 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none group-hover:shadow-xl group-hover:shadow-primary-500/30" />

      {/* Corner sparkle effect */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
      </div>
    </AnimatedCard>
  );
};

export default TaskCard;