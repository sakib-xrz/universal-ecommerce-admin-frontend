/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  Avatar,
  Drawer,
  Dropdown,
  Skeleton,
  Menu as AntMenu,
  Badge,
} from "antd";
import { Bell, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import logo from "@/public/images/logo/logo.svg";
import { useGetProfileQuery } from "@/redux/api/profileApi";
import UserProfile from "./user-profile";
import UserProfileBox from "./user-profile-box";
import {
  generateProfileDropdownOptions,
  getSidebarItems,
  getUserRoleForRoute,
} from "@/utils/constant";
import { getUserInfo } from "@/utils/auth";
import { useGetNotificationStatsQuery } from "@/redux/api/notificationApi";
import useSocket from "@/hooks/use-socket";
import { toast } from "sonner";
import NotificationDrawer from "./notification-drawer";

const notificationAudio = "/audio/notification.mp3";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);

  const { data, isLoading } = useGetProfileQuery();
  const user = data?.data;
  const authUser = getUserInfo();

  const role = getUserRoleForRoute(user);
  const items = generateProfileDropdownOptions(role);
  const sidebarItems = getSidebarItems(authUser?.role);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const showNotificationDrawer = () => {
    setOpenNotification(true);
  };

  const onCloseNotification = () => {
    setOpenNotification(false);
  };

  const {
    data: notificationStatsData,
    isLoading: isNotificationStatsLoading,
    refetch,
  } = useGetNotificationStatsQuery();

  const { isConnected, on, off } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

    const handleNewOrderNotification = (notificationData) => {
      refetch();

      const audio = new Audio(notificationAudio);
      audio.play().catch((err) => {
        console.error("Audio playback failed:", err);
      });

      toast.message("New Order Placed", {
        description: notificationData.message || "A new order has been placed.",
        position: "bottom-right",
        duration: 5000,
      });
    };

    on("newOrderNotification", handleNewOrderNotification);

    return () => {
      off("newOrderNotification", handleNewOrderNotification);
    };
  }, [isConnected, on, off, refetch]);

  const notificationStats = notificationStatsData?.data;

  return (
    <div className="sticky top-0 z-50 bg-white shadow">
      <div className="py-2 pl-4 pr-6 sm:px-8">
        <div className="flex items-center justify-between gap-2 xs:gap-5">
          <Link href={isLoading ? "#" : `/${role}/dashboard`}>
            <Image
              src={logo}
              alt=""
              className="w-auto cursor-pointer max-xs:h-5 xs:h-8 sm:h-10"
              quality={100}
              loading="eager"
            />
          </Link>

          {/* For small screens */}
          <div className="hidden items-center gap-3 max-md:flex">
            {/* User profile dropdown for small screens */}
            <div className="flex items-center gap-5">
              {isNotificationStatsLoading ? (
                <div className="relative animate-pulse cursor-pointer">
                  <div className="size-8 rounded-full bg-gray-200"></div>
                </div>
              ) : (
                <Badge
                  count={notificationStats?.unread}
                  className="cursor-pointer"
                >
                  <Bell
                    className="cursor-pointer"
                    onClick={showNotificationDrawer}
                  />
                </Badge>
              )}
              <UserProfile user={user} isLoading={isLoading} />
            </div>

            <div>
              {isLoading ? (
                <Skeleton.Avatar active size="small" />
              ) : (
                <Dropdown
                  menu={{
                    items,
                    selectedKeys: [pathname],
                  }}
                  placement="bottomRight"
                  className="!cursor-pointer"
                >
                  <Avatar src={user?.image} size="small" />
                </Dropdown>
              )}
            </div>

            {/* Menu button for small screens */}
            <div>
              <Menu
                className="cursor-pointer text-primary"
                onClick={showDrawer}
              />
            </div>

            {/* Sidebar drawer for small screens */}
            <Drawer
              title={<UserProfileBox user={user} />}
              placement={"right"}
              closable={false}
              open={open}
              key={"right"}
              onClose={onClose}
              extra={
                <X onClick={onClose} className="cursor-pointer text-primary" />
              }
            >
              <AntMenu
                selectedKeys={[pathname]}
                mode="inline"
                items={sidebarItems}
                style={{ border: "none" }}
                onClick={({ key }) => {
                  router.push(key);
                  onClose();
                }}
              />
            </Drawer>
          </div>

          {/* For large screens */}
          <div className="flex items-center gap-5 max-md:hidden">
            {isNotificationStatsLoading ? (
              <div className="relative animate-pulse cursor-pointer">
                <div className="size-10 rounded-full bg-gray-200"></div>
              </div>
            ) : (
              <div className="w-fit" onClick={showNotificationDrawer}>
                <Badge
                  count={notificationStats?.unread}
                  className="cursor-pointer"
                >
                  <Bell className="cursor-pointer" />
                </Badge>
              </div>
            )}

            <UserProfile user={user} isLoading={isLoading} />
          </div>

          {/* Notification Drawer */}
          <NotificationDrawer
            open={openNotification}
            onClose={onCloseNotification}
          />
        </div>
      </div>
    </div>
  );
}
