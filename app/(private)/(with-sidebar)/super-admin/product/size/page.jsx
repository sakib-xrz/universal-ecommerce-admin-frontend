"use client";

import FormInput from "@/components/form/form-input";
import TitleWithButton from "@/components/shared/title-with-button";
import {
  useCreateSizeMutation,
  useDeleteSizeMutation,
  useGetSizesQuery,
} from "@/redux/api/sizeApi";
import { Breadcrumb, Button, Modal, Table } from "antd";
import { useFormik } from "formik";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

const items = [
  {
    title: <Link href="/super-admin/dashboard">Dashboard</Link>,
  },
  {
    title: <Link href="/super-admin/product">Product</Link>,
  },
  {
    title: "Size",
  },
];

export default function Size() {
  const [id, setId] = useState(null);
  const [addSizeModal, setAddSizeModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [createSize, { isLoading: isCreateSizeLoading }] =
    useCreateSizeMutation();
  const [deleteSize, { isLoading: isDeleteLoading }] = useDeleteSizeMutation();

  const { data, isLoading: isSizesLoading } = useGetSizesQuery();

  const dataSource = data?.data || [];

  const columns = [
    {
      title: "Size",
      key: "name",
      dataIndex: "name",
      render: (_text, record) => <h3 className="font-medium">{record.name}</h3>,
    },
    {
      title: "Created At",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (_text, record) => (
        <p>{dayjs(record.created_at).format("lll")}</p>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_text, record) => (
        <p
          className="cursor-pointer text-danger hover:underline"
          onClick={() => {
            setId(record.id);
            setOpenDeleteModal(true);
          }}
        >
          Delete
        </p>
      ),
    },
  ];

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Size name is required"),
    }),
    onSubmit: async (values) => {
      const payload = {
        name: values.name.toUpperCase(),
      };
      try {
        await createSize(payload).unwrap();
        formik.resetForm();
        setAddSizeModal(false);
        toast.success("Size created successfully");
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to create size");
      }
    },
  });

  const handleDelete = async () => {
    try {
      await deleteSize(id).unwrap();
      setOpenDeleteModal(false);
      setId(null);
      toast.success("Size deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete size");
    }
  };

  return (
    <div className="space-y-5">
      <Breadcrumb items={items} />

      <div className="space-y-5">
        <TitleWithButton
          title="Size"
          buttonText="Add Size"
          onClick={() => setAddSizeModal(true)}
        />

        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          loading={isSizesLoading}
          pagination={false}
          //   ellipsis={true}
          scroll={{
            x: "max-content",
          }}
        />
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <Modal
          open={addSizeModal}
          title="Create New Size"
          icon={<></>}
          closable={false}
          footer={
            <div className="flex items-center justify-end gap-2">
              <Button
                onClick={() => {
                  setAddSizeModal(false);
                  formik.resetForm();
                }}
                disabled={isCreateSizeLoading}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                onClick={formik.handleSubmit}
                loading={isCreateSizeLoading}
              >
                Create Size
              </Button>
            </div>
          }
          centered
          destroyOnClose
        >
          <FormInput
            formik={formik}
            name="name"
            placeholder={"Size Name (e.g. S, M, L)"}
            required
          />
        </Modal>
      </form>

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
        This action cannot be undone. This size will be permanently deleted from
        our servers.
      </Modal>
    </div>
  );
}
