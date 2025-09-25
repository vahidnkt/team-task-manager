import {
  format,
  formatDistanceToNow,
  isAfter,
  isBefore,
  addDays,
  subDays,
  startOfDay,
  endOfDay,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";

// Date formatting utilities
export const formatDate = (
  date: Date | string | null | undefined,
  formatString: string = "MMM dd, yyyy"
): string => {
  if (!date) {
    return "Unknown";
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  return format(dateObj, formatString);
};

export const formatDateTime = (
  date: Date | string | null | undefined
): string => {
  if (!date) {
    return "Unknown";
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  return format(dateObj, "MMM dd, yyyy 'at' h:mm a");
};

export const formatTime = (date: Date | string | null | undefined): string => {
  if (!date) {
    return "Unknown";
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  return format(dateObj, "h:mm a");
};

export const formatRelativeTime = (
  date: Date | string | null | undefined
): string => {
  // Handle null, undefined, or empty values
  if (!date) {
    return "Unknown";
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  return formatDistanceToNow(dateObj, { addSuffix: true });
};

// Date comparison utilities
export const isDateInFuture = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return isAfter(dateObj, new Date());
};

export const isDateInPast = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return isBefore(dateObj, new Date());
};

export const isDateToday = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

export const isDateThisWeek = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  const weekAgo = subDays(today, 7);
  return isAfter(dateObj, weekAgo) && isBefore(dateObj, addDays(today, 1));
};

// Date manipulation utilities
export const addDaysToDate = (date: Date | string, days: number): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return addDays(dateObj, days);
};

export const subtractDaysFromDate = (
  date: Date | string,
  days: number
): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return subDays(dateObj, days);
};

export const getStartOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return startOfDay(dateObj);
};

export const getEndOfDay = (date: Date | string): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return endOfDay(dateObj);
};

// Duration utilities
export const getDaysDifference = (
  startDate: Date | string,
  endDate: Date | string
): number => {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  return differenceInDays(end, start);
};

export const getHoursDifference = (
  startDate: Date | string,
  endDate: Date | string
): number => {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  return differenceInHours(end, start);
};

export const getMinutesDifference = (
  startDate: Date | string,
  endDate: Date | string
): number => {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  return differenceInMinutes(end, start);
};

// Task and project specific utilities
export const getTaskDeadlineStatus = (
  dueDate: Date | string
): {
  status: "overdue" | "due-today" | "due-soon" | "not-due";
  daysLeft: number;
  message: string;
} => {
  const due = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  const now = new Date();
  const daysLeft = getDaysDifference(now, due);

  if (daysLeft < 0) {
    return {
      status: "overdue",
      daysLeft: Math.abs(daysLeft),
      message: `Overdue by ${Math.abs(daysLeft)} day${
        Math.abs(daysLeft) === 1 ? "" : "s"
      }`,
    };
  }

  if (daysLeft === 0) {
    return {
      status: "due-today",
      daysLeft: 0,
      message: "Due today",
    };
  }

  if (daysLeft <= 3) {
    return {
      status: "due-soon",
      daysLeft,
      message: `Due in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`,
    };
  }

  return {
    status: "not-due",
    daysLeft,
    message: `Due in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`,
  };
};

export const getProjectTimeline = (
  startDate: Date | string,
  endDate: Date | string
): {
  totalDays: number;
  daysPassed: number;
  daysRemaining: number;
  progressPercentage: number;
  status: "not-started" | "in-progress" | "completed" | "overdue";
} => {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const now = new Date();

  const totalDays = getDaysDifference(start, end);
  const daysPassed = getDaysDifference(start, now);
  const daysRemaining = getDaysDifference(now, end);

  let progressPercentage = 0;
  let status: "not-started" | "in-progress" | "completed" | "overdue";

  if (isBefore(now, start)) {
    status = "not-started";
    progressPercentage = 0;
  } else if (isAfter(now, end)) {
    status = "completed";
    progressPercentage = 100;
  } else if (daysRemaining < 0) {
    status = "overdue";
    progressPercentage = Math.min(100, (daysPassed / totalDays) * 100);
  } else {
    status = "in-progress";
    progressPercentage = Math.min(100, (daysPassed / totalDays) * 100);
  }

  return {
    totalDays,
    daysPassed: Math.max(0, daysPassed),
    daysRemaining: Math.max(0, daysRemaining),
    progressPercentage: Math.round(progressPercentage),
    status,
  };
};

// Date range utilities
export const getDateRange = (
  startDate: Date | string,
  endDate: Date | string
): {
  start: Date;
  end: Date;
  days: number;
  hours: number;
  minutes: number;
} => {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  return {
    start,
    end,
    days: getDaysDifference(start, end),
    hours: getHoursDifference(start, end),
    minutes: getMinutesDifference(start, end),
  };
};

// Calendar utilities
export const getMonthName = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMMM");
};

export const getYear = (date: Date | string): number => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.getFullYear();
};

export const getWeekNumber = (date: Date | string): number => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const firstDayOfYear = new Date(dateObj.getFullYear(), 0, 1);
  const pastDaysOfYear =
    (dateObj.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Input formatting utilities
export const formatDateForInput = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "yyyy-MM-dd");
};

export const formatDateTimeForInput = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "yyyy-MM-dd'T'HH:mm");
};

export const parseDateFromInput = (dateString: string): Date => {
  return new Date(dateString);
};

// Validation utilities
export const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const isValidDateString = (dateString: string): boolean => {
  const date = new Date(dateString);
  return isValidDate(date);
};

// Export commonly used date formats
export const DATE_FORMATS = {
  SHORT: "MMM dd, yyyy",
  LONG: "EEEE, MMMM dd, yyyy",
  TIME: "h:mm a",
  DATETIME: "MMM dd, yyyy 'at' h:mm a",
  ISO: "yyyy-MM-dd",
  INPUT_DATETIME: "yyyy-MM-dd'T'HH:mm",
  RELATIVE: "relative", // Special flag for relative formatting
} as const;
