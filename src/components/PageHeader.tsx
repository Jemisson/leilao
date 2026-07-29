import React from "react";
import { FaTags } from "react-icons/fa";

interface PageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  icon = <FaTags className="h-5 w-5" />,
  actions,
  className = "",
}) => {
  return (
    <div className={`mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-blueBright/10 text-blueBright">
          {icon}
        </div>
        <h1 className="text-lg font-bold uppercase text-pinkDark sm:text-xl">
          {title}
        </h1>
      </div>

      {actions && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
