"use client";

import { Avatar } from "antd";

export default function UserProfileBox({ user }) {
  return (
    <div
      className="flex w-fit items-center gap-2 p-1 sm:cursor-pointer sm:rounded-md sm:border"
      onClick={(e) => e.preventDefault()}
    >
      <Avatar src={user?.image} />
      <div className="pr-2">
        <p className="text-start text-xs font-semibold text-primary">
          {user?.name}
        </p>
        <p className="text-start text-xs font-medium text-gray-500">
          {user?.email}
        </p>
      </div>
    </div>
  );
}
