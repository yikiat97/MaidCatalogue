import React from "react";
import { Home1 } from "../../../icons/Home1";

export const ListMenu = ({
  className,
  text = "Label",
  icon = <Home1 className="!relative !w-6 !h-6" />,
  textClassName,
}) => {
  return (
    <div
      className={`inline-flex flex-col items-start gap-2.5 p-4 relative rounded-lg ${className}`}
    >
      <div className="flex w-[186px] h-6 items-center gap-4 relative">
        {icon}
        <div
          className={`relative w-fit mt-[-1.00px] font-body-1-medium font-[number:var(--body-1-medium-font-weight)] text-greygrey-600 text-[length:var(--body-1-medium-font-size)] tracking-[var(--body-1-medium-letter-spacing)] leading-[var(--body-1-medium-line-height)] whitespace-nowrap [font-style:var(--body-1-medium-font-style)] ${textClassName}`}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
