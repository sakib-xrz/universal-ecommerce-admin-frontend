"use client";

import TitleWithButton from "@/components/shared/title-with-button";
import {
  useChangeCategoryStatusMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/redux/api/categoryApi";
import { transformCategories } from "@/utils";
import { transformCategories as cascadeTransformCategories } from "@/utils/constant";
import { Breadcrumb, Table, Modal, Button, Switch } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import EditCategoryModal from "./_components/edit-category-modal";

const items = [
  {
    title: <Link href="/super-admin/dashboard">Dashboard</Link>,
  },
  {
    title: "Category",
  },
];

export default function Category() {
  const { data, isLoading } = useGetCategoriesQuery();
  const [deleteCategory, { isLoading: isDeleteLoading }] =
    useDeleteCategoryMutation();
  const [
    changeCategoryStatus,
    { isLoading: isChangeCategoryPublishStatusLoading },
  ] = useChangeCategoryStatusMutation();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editableCategory, setEditableCategory] = useState(null);
  const [id, setId] = useState(null);

  const dataSource = transformCategories(data?.data || []);

  const options = cascadeTransformCategories(data?.data || []);

  const columns = [
    {
      title: "Category",
      key: "name",
      render: (_text, record) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Image
              src={record.image}
              alt={record.name}
              width={120}
              height={72}
              className="h-10 w-auto rounded object-cover lg:h-8"
              placeholder="blur"
              blurDataURL={record.image}
            />
            <h3 className="font-medium max-lg:line-clamp-1">{record.name}</h3>
          </div>
        </div>
      ),
    },
    {
      title: "Slug",
      key: "slug",
      render: (_text, record) => <code>{record.slug}</code>,
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
              setId(record.id);
              try {
                await changeCategoryStatus(record.id).unwrap();
                toast.success("Category status changed successfully");
              } catch (error) {
                console.log(error);
                toast.error(
                  error.message || "Failed to change category status",
                );
              } finally {
                setId(null);
              }
            }}
            loading={isChangeCategoryPublishStatusLoading && id === record.id}
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
              setEditableCategory(record);
              setOpenEditModal(true);
            }}
          >
            Edit
          </p>
          <p
            className="cursor-pointer text-danger hover:underline"
            onClick={() => {
              setId(record.id);
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
      await deleteCategory(id).unwrap();
      setOpenDeleteModal(false);
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete category");
    } finally {
      setId(null);
    }
  };

  return (
    <div className="space-y-5">
      <Breadcrumb items={items} />
      <div className="space-y-5">
        <TitleWithButton
          title="Category"
          buttonText="Add Category"
          href="/super-admin/category/add"
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
          This action cannot be undone. This category will be permanently
          deleted from our servers.
        </Modal>

        {editableCategory && (
          <EditCategoryModal
            open={openEditModal}
            setOpen={setOpenEditModal}
            data={editableCategory}
            setData={setEditableCategory}
            options={options}
          />
        )}
      </div>
    </div>
  );
}
