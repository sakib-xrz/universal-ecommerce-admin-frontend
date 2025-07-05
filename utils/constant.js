import {
  LayoutDashboard,
  KeyRound,
  LogOut,
  UserRound,
  LayoutList,
  Box,
  UsersRoundIcon,
  ShoppingBag,
  Image,
} from "lucide-react";
import Link from "next/link";

export const ACCESS_TOKEN = "ACCESS_TOKEN";
export const REFRESH_TOKEN = "REFRESH_TOKEN";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export const generateProfileDropdownOptions = () => {
  return [
    {
      key: `/profile`,
      label: (
        <Link href={`/profile`} className="flex items-center gap-2">
          <UserRound className="size-5" /> Profile
        </Link>
      ),
    },
    {
      key: "/change-password",
      label: (
        <Link href="/change-password" className="flex items-center gap-2">
          <KeyRound className="size-5" /> Change Password
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "/logout",
      label: (
        <Link href="/logout" className="flex items-center gap-2">
          <LogOut className="size-5" /> Logout
        </Link>
      ),
      danger: true,
    },
  ];
};

export const getUserRoleForRoute = (user) => {
  return `${user?.role === "SUPER_ADMIN" ? "super-admin" : user?.role?.toLowerCase()}`;
};

const getItem = (label, key, icon, children) => ({
  key,
  icon,
  label: children ? label : <Link href={key}>{label}</Link>,
  children: children?.map((child) =>
    getItem(child.label, child.key, child.icon, child.children),
  ),
});

export const getSidebarItems = (role) => {
  const SUPER_ADMIN = [
    getItem("Dashboard", "/super-admin/dashboard", <LayoutDashboard />),
    getItem("Users", "/super-admin/user", <UsersRoundIcon />),
    getItem("Categories", "category", <LayoutList />, [
      getItem("Category List", "/super-admin/category"),
      getItem("Add Category", "/super-admin/category/add"),
    ]),
    getItem("Products", "product", <Box />, [
      getItem("Product Size", "/super-admin/product/size"),
      getItem("Product List", "/super-admin/product"),
      getItem("Add Product", "/super-admin/product/add"),
    ]),
    getItem("Orders", "/order", <ShoppingBag />, [
      getItem("Order List", "/super-admin/order"),
      getItem("Create Order", "/super-admin/order/add"),
    ]),
    getItem("Banners", "/banner", <Image />),
    getItem("Featured Categories", "/featured-category", <LayoutList />, [
      getItem("Featured Category List", "/super-admin/featured-category"),
      getItem("Add Featured Category", "/super-admin/featured-category/add"),
    ]),
  ];

  switch (role) {
    case "SUPER_ADMIN":
      return SUPER_ADMIN;
    case "ADMIN":
      return ADMIN;
    default:
      return [];
  }
};

export function transformCategories(data) {
  return data.map((category) => transformCategory(category));
}

function transformCategory(category) {
  return {
    value: category.id,
    label: category.name,
    children: (category.sub_categories || []).map((subCategory) =>
      transformCategory(subCategory),
    ),
  };
}

export const discountOptions = [
  {
    key: "1",
    value: "PERCENTAGE",
    label: "Percentage",
  },
  {
    key: "2",
    value: "FLAT",
    label: "Flat",
  },
];

export const userStatusOptions = [
  {
    key: "1",
    value: "ACTIVE",
    label: "Active",
  },
  {
    key: "2",
    value: "INACTIVE",
    label: "Inactive",
  },
];

export const userRoleOptions = [
  // {
  //   key: "1",
  //   value: "ADMIN",
  //   label: "Admin",
  // },
  {
    key: "CUSTOMER",
    value: "CUSTOMER",
    label: "Customer",
  },
];

export const paymentStatusOptions = [
  {
    key: "1",
    value: "PENDING",
    label: (
      <div className="flex items-center gap-2">
        <p style={{ color: "gold" }}>●</p>
        Pending
      </div>
    ),
  },
  {
    key: "2",
    value: "SUCCESS",
    label: (
      <div className="flex items-center gap-2">
        <p style={{ color: "green" }}>●</p>
        Success
      </div>
    ),
  },
  {
    key: "3",
    value: "PARTIAL",
    label: (
      <div className="flex items-center gap-2">
        <p style={{ color: "blue" }}>●</p>
        Partial
      </div>
    ),
  },
  {
    key: "4",
    value: "FAILED",
    label: (
      <div className="flex items-center gap-2">
        <p style={{ color: "red" }}>●</p>
        Failed
      </div>
    ),
  },
];

export const orderStatusOptions = [
  {
    key: "1",
    value: "PLACED",
    label: (
      <div className="flex items-center gap-2">
        <p style={{ color: "grey" }}>●</p>
        Placed
      </div>
    ),
  },
  {
    key: "2",
    value: "CONFIRMED",
    label: (
      <div className="flex items-center gap-2">
        <p style={{ color: "yellowgreen" }}>●</p>
        Confirmed
      </div>
    ),
  },
  {
    key: "3",
    value: "SHIPPED",
    label: (
      <div className="flex items-center gap-2">
        <p style={{ color: "blue" }}>●</p>
        Shipped
      </div>
    ),
  },
  {
    key: "4",
    value: "PENDING",
    label: (
      <div className="flex items-center gap-2">
        <p style={{ color: "gold" }}>●</p>
        Pending
      </div>
    ),
  },
  {
    key: "5",
    value: "DELIVERED",
    label: (
      <div className="flex items-center gap-2">
        <p style={{ color: "green" }}>●</p>
        Delivered
      </div>
    ),
  },
  {
    key: "6",
    value: "CANCELLED",
    label: (
      <div className="flex items-center gap-2">
        <p style={{ color: "red" }}>●</p>
        Cancelled
      </div>
    ),
  },
];

export const platformOptions = [
  {
    key: "1",
    value: "WEBSITE",
    label: "Website",
  },
  {
    key: "2",
    value: "FACEBOOK",
    label: "Facebook",
  },
  {
    key: "3",
    value: "WHATSAPP",
    label: "WhatsApp",
  },
  {
    key: "4",
    value: "INSTAGRAM",
    label: "Instagram",
  },
  {
    key: "5",
    value: "PHONE",
    label: "Phone",
  },
];

export const paymentMethodOptions = [
  {
    key: "1",
    value: "CASH_ON_DELIVERY",
    label: "Cash on Delivery",
  },
];
