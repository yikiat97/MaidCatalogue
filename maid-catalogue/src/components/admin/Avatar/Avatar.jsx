import React from "react";

export const Avatar = ({
  className,
  avatar = "https://c.animaapp.com/66RqWgHo/img/avatar.svg",
}) => {
  return (
    <img
      className={`absolute w-10 h-10 top-0 left-0 ${className}`}
      alt="Avatar"
      src={avatar}
    />
  );
};
