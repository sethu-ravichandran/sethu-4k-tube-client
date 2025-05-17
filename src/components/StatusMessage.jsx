import React from "react";
import { cn } from "../lib/utils";
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

const StatusMessage = ({ status, message }) => {
  if (status === "idle" || !message) {
    return null;
  }

  const statusConfig = {
    loading: {
      icon: <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />,
      className: "bg-blue-50 text-blue-700 border-blue-100",
    },
    success: {
      icon: <CheckCircle className="h-5 w-5 text-green-500 mr-2" />,
      className: "bg-green-50 text-green-700 border-green-100",
    },
    error: {
      icon: <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />,
      className: "bg-red-50 text-red-700 border-red-100",
    },
  };

  const { icon, className } = statusConfig[status];

  return (
    <div
      className={cn(
        "flex items-center p-3 mt-3 rounded-md border animate-fade-in",
        className
      )}
    >
      {icon}
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default StatusMessage;
