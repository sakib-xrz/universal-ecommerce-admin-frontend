import {
  useGetNotificationListQuery,
  useReadAllNotificationsMutation,
} from "@/redux/api/notificationApi";
import { Divider, Drawer } from "antd";
import { X } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import NotificationCard from "./notofication-card";
dayjs.extend(relativeTime);

export default function NotificationDrawer({ open, onClose }) {
  const { data, isLoading } = useGetNotificationListQuery(
    {},
    {
      skip: !open,
      refetchOnMountOrArgChange: true,
    },
  );

  const notifications = data?.data || [];

  const [readAllNotification] = useReadAllNotificationsMutation();

  const handleReadAll = async () => {
    await readAllNotification();
  };

  return (
    <Drawer
      title={<div className="py-[1.2rem] pl-3">Notifications</div>}
      placement="right"
      onClose={onClose}
      open={open}
      key={"right"}
      closable={false}
      extra={<X onClick={onClose} className="cursor-pointer text-primary" />}
    >
      <div>
        <div className="flex items-center justify-end p-3 text-sm">
          {/* <p className="cursor-pointer font-medium hover:underline">See all</p> */}

          <p
            className="cursor-pointer font-medium hover:underline"
            onClick={handleReadAll}
          >
            Mark all as read
          </p>
        </div>

        <div>
          {isLoading
            ? [...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse items-center gap-3 border-b bg-gray-100 p-4"
                >
                  <div className="flex-shrink-0">
                    <div className="rounded-full p-2">
                      <div className="mx-auto size-10 rounded-full bg-gray-300"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-2/4 rounded bg-gray-300"></div>
                      <div className="ml-auto h-2.5 w-1/4 rounded bg-gray-300"></div>
                    </div>
                    <div className="mt-2 h-2.5 w-full rounded bg-gray-300"></div>
                  </div>
                </div>
              ))
            : notifications.map((notification) => (
                <div key={notification.id}>
                  <NotificationCard
                    notification={notification}
                    onClose={onClose}
                  />
                  <Divider
                    style={{
                      margin: "0px",
                    }}
                  />
                </div>
              ))}
        </div>
      </div>
    </Drawer>
  );
}
