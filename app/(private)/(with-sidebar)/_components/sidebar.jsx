"use client";

import Container from "@/components/shared/container";
import useDesktop from "@/hooks/use-desktop";
import { getUserInfo } from "@/utils/auth";
import { getSidebarItems } from "@/utils/constant";
import { Layout, Menu } from "antd";
import { usePathname } from "next/navigation";
import { useState } from "react";

const { Content, Sider } = Layout;

export default function Sidebar({ children }) {
  const isDesktop = useDesktop();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(isDesktop ? false : true);
  const user = getUserInfo();

  const items = getSidebarItems(user?.role);

  return (
    <>
      <div className="max-md:hidden">
        <Layout
          style={{
            minHeight: "calc(100vh - 68px)",
          }}
        >
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
            }}
            width={300}
          >
            <Menu selectedKeys={[pathname]} mode="inline" items={items} />
          </Sider>
          <Layout>
            <Content
              style={{
                marginInlineStart: collapsed ? 80 : 300,
              }}
            >
              <Container className="max-w-full">{children}</Container>
            </Content>
          </Layout>
        </Layout>
      </div>
      <div className="hidden max-md:block">
        <Container>{children}</Container>
      </div>
    </>
  );
}
