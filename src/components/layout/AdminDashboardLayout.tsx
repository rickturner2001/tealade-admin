import { Breadcrumb, Space, Button, Avatar, Dropdown } from "antd";
import { Layout, Menu } from "antd";
import { useSession } from "next-auth/react";

import { UserOutlined } from "@ant-design/icons";
import { dropdownItems, menuItems } from "./consts";

const { Header, Content, Footer, Sider } = Layout;

const AdminDashboardLayout = ({
  breadCrumbs,
  children,
}: {
  breadCrumbs: JSX.Element[];
  children: JSX.Element;
}) => {
  const { data, status } = useSession();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsedWidth={0} collapsible defaultCollapsed={true}>
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
          }}
        />
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>
      <Layout className="site-layout">
        <Header className="bg-white px-8">
          <Space align="center" className="w-full items-center justify-between">
            <span className="invisible hidden md:visible md:block"></span>
            <h1 className="text-lg font-medium uppercase tracking-widest text-neutral-900 md:text-center ">
              Tealade Admin
            </h1>
            {status === "authenticated" ? (
              <Dropdown trigger={["click"]} menu={{ items: dropdownItems }}>
                <Avatar
                  icon={
                    data.user?.image ? (
                      <img
                        className="h-full w-full"
                        alt="user icon"
                        src={data.user.image}
                      />
                    ) : (
                      <UserOutlined />
                    )
                  }
                />
              </Dropdown>
            ) : (
              <Button href="/login" type="primary" className="bg-blue-500">
                Sign up
              </Button>
            )}
          </Space>
        </Header>
        <Content className="flex w-full flex-col ">
          <div className="flex h-max w-full items-center justify-end bg-gray-300 py-4 px-8 ">
            <Breadcrumb className="">
              <Breadcrumb.Item href="/admin">Admin dashboard</Breadcrumb.Item>
              {breadCrumbs}
            </Breadcrumb>
          </div>

          <div className="mx-auto  w-full max-w-7xl px-8 ">{children}</div>
        </Content>
        <Footer style={{ textAlign: "center" }} className="bg-white">
          Tealade ©2023 Tealade admin dashboard
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminDashboardLayout;
