"use client";

import TitleWithButton from "@/components/shared/title-with-button";
import {
  useDeleteBannerMutation,
  useGetBannersQuery,
} from "@/redux/api/bannerApi";
import { Breadcrumb, Button, Image, Modal, Table } from "antd";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import CreateBanner from "./_components/create-banner";
import { PencilLine, Trash2 } from "lucide-react";
import dayjs from "dayjs";

const breadcrumbItems = [
  {
    title: <Link href="/super-admin/dashboard">Dashboard</Link>,
  },
  {
    title: "Banner",
  },
];

export default function Banner() {
  const [deleteBanner, { isLoading: isDeleteLoading }] =
    useDeleteBannerMutation();

  const [id, setId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const { data, isLoading } = useGetBannersQuery();

  const dataSource = data?.data || [];

  const columns = [
    {
      title: <div className="text-center">Banner Image</div>,
      dataIndex: "image_url",
      key: "image_url",
      render: (imageUrl, record) => (
        <div className="flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={`Banner ${record.id}`}
            width={200}
            height={80}
            className="!rounded-md object-cover"
          />
        </div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (
        <div>
          <div className="font-medium">
            {dayjs(date).format("MMM DD, YYYY")}
          </div>
          <div className="text-sm text-gray-500">
            {dayjs(date).format("hh:mm A")}
          </div>
        </div>
      ),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date) => (
        <div>
          <div className="font-medium">
            {dayjs(date).format("MMM DD, YYYY")}
          </div>
          <div className="text-sm text-gray-500">
            {dayjs(date).format("hh:mm A")}
          </div>
        </div>
      ),
    },
    {
      title: <div className="text-center">Actions</div>,
      key: "actions",
      render: (_text, record) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/super-admin/banner/edit/${record.id}`}>
            <Button size="small" icon={<PencilLine size={14} />} />
          </Link>
          <Button
            size="small"
            icon={<Trash2 size={14} />}
            danger
            onClick={() => {
              setId(record.id);
              setOpenDeleteModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    try {
      await deleteBanner(id).unwrap();
      setOpenDeleteModal(false);
      toast.success("Banner deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete banner");
    } finally {
      setId(null);
    }
  };

  return (
    <div className="space-y-5">
      <Breadcrumb items={breadcrumbItems} />
      <div className="space-y-5">
        <TitleWithButton
          title="Banners"
          buttonText="Add Banner"
          onClick={() => setOpenCreateModal(true)}
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
          rowKey={(record) => record.id}
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
                  setId(null);
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
          This action cannot be undone. This banner will be permanently deleted
          from our servers.
        </Modal>

        {openCreateModal && (
          <CreateBanner open={openCreateModal} setOpen={setOpenCreateModal} />
        )}
      </div>
    </div>
  );
}
