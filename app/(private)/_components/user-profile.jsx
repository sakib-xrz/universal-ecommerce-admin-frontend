"use client";

import { Dropdown, Skeleton } from "antd";
import { usePathname } from "next/navigation";

import UserProfileBox from "./user-profile-box";
import {
  generateProfileDropdownOptions,
  getUserRoleForRoute,
} from "@/utils/constant";

export default function UserProfile({ user, isLoading }) {
  const pathname = usePathname();

  const role = getUserRoleForRoute(user);
  const items = generateProfileDropdownOptions(role);

  return (
    <>
      {isLoading ? (
        <div className="hidden w-[13.3rem] animate-pulse items-center gap-2 p-1 sm:rounded-md sm:border md:flex">
          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
          <div className="space-y-1 pr-2">
            <p className="h-3.5 w-16 animate-pulse rounded-sm bg-gray-200"></p>
            <p className="h-2.5 w-36 animate-pulse rounded-sm bg-gray-200"></p>
          </div>
        </div>
      ) : (
        <Dropdown
          menu={{
            items,
            selectedKeys: [pathname],
          }}
          placement="bottomRight"
          className="max-md:hidden"
        >
          <div>
            <UserProfileBox user={user} />
          </div>
        </Dropdown>
      )}
    </>
  );
}
