import { ShoppingBag } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useReadNotificationMutation } from "@/redux/api/notificationApi";

dayjs.extend(relativeTime);

export default function NotificationCard({ notification, onClose }) {
  const { order, is_read, created_at } = notification;
  const [readNotification] = useReadNotificationMutation();

  const handleRead = async () => {
    await readNotification(notification.id);
  };
  return (
    <Link
      onClick={() => {
        handleRead();
        onClose();
      }}
      href={`/super-admin/order/${order?.order_id}`}
      className={`flex items-center gap-3 p-4 ${
        is_read ? "bg-white hover:bg-slate-100" : "bg-gray-200"
      }`}
    >
      <div className="flex-shrink-0">
        <div
          className={`rounded-full p-2 ${
            is_read ? "bg-gray-200" : "bg-slate-300"
          }`}
        >
          <ShoppingBag size={24} className="text-primary-700 p-1" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-primary">New order placed</p>
          <p className="text-xs text-gray-500 first-letter:uppercase">
            {dayjs(created_at).fromNow()}
          </p>
        </div>
        <p className="text-xs text-gray-700">
          A new order <span className="font-semibold">#{order?.order_id}</span>{" "}
          has been placed by{" "}
          <span className="font-semibold">{order?.customer_name}</span>
        </p>
      </div>
    </Link>
  );
}
