"use client";

import TitleWithButton from "@/components/shared/title-with-button";
import {
  useDeleteStaticPageMutation,
  useGetStaticPagesQuery,
} from "@/redux/api/staticPageApi";
import { Breadcrumb, Table, Modal, Button } from "antd";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const items = [
  {
    title: <Link href="/super-admin/dashboard">Dashboard</Link>,
  },
  {
    title: "Static Pages",
  },
];

const kindLabels = {
  ABOUT_US: "About Us",
  PRIVACY_POLICY: "Privacy Policy",
  SHIPPING_INFORMATION: "Shipping Information",
};

// Helper function to strip HTML tags and truncate text
const stripHtmlAndTruncate = (html, maxLength = 100) => {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const text = temp.textContent || temp.innerText || "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export default function StaticPage() {
  const { data, isLoading } = useGetStaticPagesQuery();
  const [deleteStaticPage, { isLoading: isDeleteLoading }] =
    useDeleteStaticPageMutation();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const dataSource =
    data?.data?.map((page, index) => ({
      ...page,
      key: page.id,
      serial: index + 1,
    })) || [];

  const columns = [
    {
      title: "S.N.",
      dataIndex: "serial",
      key: "serial",
      width: 80,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <h3 className="font-medium">{text}</h3>,
    },
    {
      title: "Type",
      dataIndex: "kind",
      key: "kind",
      render: (kind) => (
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
          {kindLabels[kind]}
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <p className="line-clamp-2 text-sm text-gray-600">{text}</p>
      ),
    },
    {
      title: "Content Preview",
      dataIndex: "content",
      key: "content",
      render: (content) => (
        <div
          className="line-clamp-3 max-w-xs text-sm text-gray-600"
          title={stripHtmlAndTruncate(content, 200)}
        >
          {stripHtmlAndTruncate(content, 80)}
        </div>
      ),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-4">
          <Link
            href={`/super-admin/static-page/edit/${record.id}`}
            className="text-info hover:underline"
          >
            Edit
          </Link>
          <button
            className="text-danger hover:underline"
            onClick={() => {
              setSelectedId(record.id);
              setOpenDeleteModal(true);
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    try {
      await deleteStaticPage(selectedId).unwrap();
      setOpenDeleteModal(false);
      toast.success("Static page deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete static page");
    } finally {
      setSelectedId(null);
    }
  };

  return (
    <div className="space-y-5">
      <Breadcrumb items={items} />
      <div className="space-y-5">
        <TitleWithButton
          title="Static Pages"
          buttonText="Add Static Page"
          href="/super-admin/static-page/add"
        />
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          loading={isLoading}
          pagination={false}
          scroll={{
            x: "max-content",
          }}
        />

        <Modal
          open={openDeleteModal}
          title="Are you absolutely sure?"
          icon={<></>}
          closable={false}
          footer={
            <div className="flex items-center justify-end gap-2">
              <Button
                disabled={isDeleteLoading}
                onClick={() => {
                  setOpenDeleteModal(false);
                  setSelectedId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                danger
                loading={isDeleteLoading}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          }
          centered
          destroyOnClose
        >
          This action cannot be undone. This static page will be permanently
          deleted from our servers.
        </Modal>
      </div>
    </div>
  );
}
