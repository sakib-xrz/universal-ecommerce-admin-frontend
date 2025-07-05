"use client";

import TitleWithButton from "@/components/shared/title-with-button";
import {
  useDeleteFeaturedCategoryMutation,
  useGetFeaturedCategoriesQuery,
  useToggleFeaturedCategoryStatusMutation,
  useSortFeaturedCategoriesMutation,
} from "@/redux/api/featuredCategoryApi";
import { Breadcrumb, Table, Modal, Button, Switch, Tag } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import EditFeaturedCategoryModal from "./_components/edit-featured-category-modal";

const items = [
  {
    title: <Link href="/super-admin/dashboard">Dashboard</Link>,
  },
  {
    title: "Featured Category",
  },
];

export default function FeaturedCategory() {
  const { data, isLoading } = useGetFeaturedCategoriesQuery();
  const [deleteFeaturedCategory, { isLoading: isDeleteLoading }] =
    useDeleteFeaturedCategoryMutation();
  const [toggleFeaturedCategoryStatus, { isLoading: isToggleLoading }] =
    useToggleFeaturedCategoryStatusMutation();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editableItem, setEditableItem] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const dataSource = data?.data || [];

  const columns = [
    {
      title: <div className="text-center">Sort Order</div>,
      key: "sort_order",
      render: (_text, record) => (
        <div className="text-center font-medium">{record.sort_order}</div>
      ),
      width: 150,
    },
    {
      title: "Title",
      key: "title",
      render: (_text, record) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            {record.banner_url && (
              <Image
                src={record.banner_url}
                alt={record.title}
                width={120}
                height={72}
                className="h-12 w-auto rounded object-cover lg:h-10"
                placeholder="blur"
                blurDataURL={record.banner_url}
              />
            )}
            <div>
              <h3 className="font-medium max-lg:line-clamp-1">
                {record.title}
              </h3>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      key: "category",
      render: (_text, record) => (
        <div className="flex items-center space-x-2">
          <Image
            src={record.category?.image}
            alt={record.category?.name}
            width={40}
            height={40}
            className="h-8 w-8 rounded object-cover"
            placeholder="blur"
            blurDataURL={record.category?.image}
          />
          <div>
            <p className="font-medium">{record.category?.name}</p>
          </div>
        </div>
      ),
    },
    {
      title: <div className="text-center">Banner</div>,
      key: "banner_url",
      render: (_text, record) => (
        <div className="text-center">
          {record.banner_url ? (
            <Image
              src={record.banner_url}
              alt={record.title}
              width={120}
              height={72}
            />
          ) : (
            <span className="text-gray-400">No Banner</span>
          )}
        </div>
      ),
    },
    {
      title: <div className="text-center">YouTube Video</div>,
      key: "youtube_video_link",
      render: (_text, record) => (
        <div className="text-center">
          {record.youtube_video_link ? (
            <a
              href={record.youtube_video_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Video
            </a>
          ) : (
            <span className="text-gray-400">No Video</span>
          )}
        </div>
      ),
    },
    {
      title: <div className="text-center">Published</div>,
      key: "is_published",
      render: (_text, record) => (
        <div className="flex justify-center">
          <Switch
            size="small"
            checked={record.is_published}
            onChange={async () => {
              setSelectedId(record.id);
              try {
                await toggleFeaturedCategoryStatus(record.id).unwrap();
                toast.success("Featured category status changed successfully");
              } catch (error) {
                console.log(error);
                toast.error(
                  error.message || "Failed to change featured category status",
                );
              } finally {
                setSelectedId(null);
              }
            }}
            loading={isToggleLoading && selectedId === record.id}
          />
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_text, record) => (
        <div className="flex space-x-4">
          <p
            className="cursor-pointer text-info hover:underline"
            onClick={() => {
              setEditableItem(record);
              setOpenEditModal(true);
            }}
          >
            Edit
          </p>
          <p
            className="cursor-pointer text-danger hover:underline"
            onClick={() => {
              setSelectedId(record.id);
              setOpenDeleteModal(true);
            }}
          >
            Delete
          </p>
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    try {
      await deleteFeaturedCategory(selectedId).unwrap();
      setOpenDeleteModal(false);
      toast.success("Featured category deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete featured category");
    } finally {
      setSelectedId(null);
    }
  };

  return (
    <div className="space-y-5">
      <Breadcrumb items={items} />
      <div className="space-y-5">
        <TitleWithButton
          title="Featured Categories"
          buttonText="Add Featured Category"
          href="/super-admin/featured-category/add"
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
          rowKey="id"
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
          This action cannot be undone. This featured category will be
          permanently deleted from our servers.
        </Modal>

        {editableItem && (
          <EditFeaturedCategoryModal
            open={openEditModal}
            setOpen={setOpenEditModal}
            data={editableItem}
            setData={setEditableItem}
          />
        )}
      </div>
    </div>
  );
}
