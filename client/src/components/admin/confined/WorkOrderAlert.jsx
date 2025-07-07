import React from "react";

const WorkOrderAlert = ({ type, message }) => {
  if (!message) return null;
  
  const styles = {
    error: {
      container: "mb-6 p-6 bg-white border-l-4 border-red-500 rounded-2xl shadow-lg animate-fadeIn",
      icon: "h-6 w-6 text-red-500",
      text: "text-sm text-gray-900 font-medium"
    },
    success: {
      container: "mb-6 p-6 bg-white border-l-4 border-black rounded-2xl shadow-lg animate-fadeIn",
      icon: "h-6 w-6 text-black",
      text: "text-sm text-gray-900 font-medium"
    },
    warning: {
      container: "mb-6 p-6 bg-white border-l-4 border-yellow-500 rounded-2xl shadow-lg animate-fadeIn",
      icon: "h-6 w-6 text-yellow-500",
      text: "text-sm text-gray-900 font-medium"
    },
    info: {
      container: "mb-6 p-6 bg-white border-l-4 border-blue-500 rounded-2xl shadow-lg animate-fadeIn",
      icon: "h-6 w-6 text-blue-500",
      text: "text-sm text-gray-900 font-medium"
    }
  };

  const currentStyle = styles[type] || styles.success;

  const getIcon = () => {
    switch (type) {
      case "error":
        return (
          <svg className={currentStyle.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "warning":
        return (
          <svg className={currentStyle.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case "info":
        return (
          <svg className={currentStyle.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className={currentStyle.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={currentStyle.container}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-4 flex-1">
          <p className={currentStyle.text}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderAlert;