import FormInput from "@/components/form/form-input";
import Label from "@/components/shared/label";
import { useGetSingleProductQuery } from "@/redux/api/productApi";
import {
  useCreateProductVariantMutation,
  useDeleteProductVariantMutation,
  useUpdateProductVariantMutation,
} from "@/redux/api/productVariant";
import { useGetSizesQuery } from "@/redux/api/sizeApi";
import { Button, Empty, Input, Modal, Select, Spin, Table } from "antd";
import { useFormik } from "formik";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

export default function ManageStockModal({
  openManageStockModal,
  setOpenManageStockModal,
  currentProductId,
  setCurrentProductId,
  params,
  setParams,
}) {
  const [ariseForm, setAriseForm] = useState(false);

  const { data, isLoading: isCurrentProductLoading } =
    useGetSingleProductQuery(currentProductId);

  const { data: sizeData, isLoading: isSizesLoading } = useGetSizesQuery();

  const [createProductVariant, { isLoading: isCreateProductVariantLoading }] =
    useCreateProductVariantMutation();
  const [updateProductVariant, { isLoading: isUpdateProductVariantLoading }] =
    useUpdateProductVariantMutation();
  const [deleteProductVariant, { isLoading: isDeleteProductVariantLoading }] =
    useDeleteProductVariantMutation();

  const formik = useFormik({
    initialValues: {
      product_id: currentProductId,
      size_id: null,
      stock: null,
    },
    validationSchema: Yup.object({
      stock: Yup.number().required("Stock is required"),
    }),
    onSubmit: async (values) => {
      const payload = {
        ...values,
        stock: +values.stock,
      };
      try {
        await createProductVariant(payload);
        toast.success("Stock added successfully");
        setAriseForm(false);
        formik.setFieldValue("size_id", null);
        formik.setFieldValue("stock", null);
      } catch (error) {
        toast.error(error.message || "Failed to add stock");
      }
    },
  });

  if (isCurrentProductLoading || isSizesLoading) {
    return null;
  }

  const currentProduct = data?.data;

  const variants =
    (currentProduct?.variants &&
      currentProduct.variants?.length &&
      currentProduct.variants) ||
    [];

  const sizes = sizeData?.data;

  const options = sizes.map((size) => ({
    label: size.name,
    value: size.id,
  }));

  const columns = [
    {
      title: <div className="text-center">Size</div>,
      dataIndex: "size_id",
      key: "size_id",
      render: (_text, record) => (
        <div className="font-medium">
          {
            <Select
              size="small"
              options={options}
              value={record.size_id || "N/A"}
              className="!w-full"
              disabled
            />
          }
        </div>
      ),
    },
    {
      title: <div className="text-center">Stock</div>,
      dataIndex: "stock",
      key: "stock",
      render: (_text, record) => (
        <div className="text-center">
          <Input
            style={{
              width: "80px",
            }}
            size="small"
            defaultValue={record.stock}
            onBlur={(e) => {
              if (e.target.value !== record.stock) {
                updateProductVariant({
                  id: record.id,
                  data: {
                    stock: +e.target.value || 0,
                  },
                });
              }
            }}
          />
        </div>
      ),
    },
    {
      title: <div className="text-center">Action</div>,
      key: "action",
      render: (_text, record) => (
        <p
          className="mx-auto w-fit cursor-pointer text-center text-danger hover:underline"
          onClick={() => {
            deleteProductVariant(record.id);
          }}
        >
          Delete
        </p>
      ),
    },
  ];

  return (
    <Modal
      open={openManageStockModal}
      onCancel={() => {
        setParams({ ...params, id: null });
        setCurrentProductId(null);
        setOpenManageStockModal(false);
      }}
      title={
        <div className="pr-8">
          Manage Stock for {currentProduct?.name}{" "}
          <span className="font-normal text-gray-500">
            ({currentProduct?.sku})
          </span>
        </div>
      }
      centered
      footer={null}
      destroyOnClose
    >
      {variants.length ? (
        <Table
          rowKey={(record) => record.id}
          dataSource={variants}
          columns={columns}
          bordered
          pagination={false}
          loading={
            isUpdateProductVariantLoading || isDeleteProductVariantLoading
          }
        />
      ) : (
        <>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-gray-500">
                No stock available for this product
              </span>
            }
          />
        </>
      )}
      {ariseForm && (
        <form onSubmit={formik.handleSubmit}>
          <div className="mt-3">
            <div className="flex w-full items-start gap-3">
              <div className="w-1/2">
                <Label>Size (If Needed)</Label>
                <Select
                  options={
                    variants.length === 0
                      ? options
                      : options.filter(
                          (option) =>
                            !variants
                              .map((variant) => variant.size_id)
                              .includes(option.value),
                        )
                  }
                  className="!mt-1 !w-full"
                  placeholder="Select Size"
                  onChange={(value) => formik.setFieldValue("size_id", value)}
                  value={formik.values.size_id}
                  allowClear
                />
              </div>
              <div className="w-1/2">
                <FormInput
                  formik={formik}
                  name={"stock"}
                  label="Stock"
                  placeholder={"Stock Quantity"}
                  required
                />
              </div>
            </div>
            <div className="mt-3 flex w-full items-center gap-3">
              <Button
                danger
                onClick={() => {
                  setAriseForm(false);
                  formik.resetForm();
                  formik.setFieldValue("size_id", null);
                  formik.setFieldValue("stock", null);
                }}
                htmlType="button"
                className="w-full"
                disabled={isCreateProductVariantLoading}
              >
                <X size={20} /> Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={isCreateProductVariantLoading}
              >
                <Check size={20} /> Add Stock
              </Button>
            </div>
          </div>
        </form>
      )}

      {!ariseForm && variants.length !== sizes.length && (
        <Button
          type="primary"
          className="mt-3 w-full"
          onClick={() => setAriseForm(true)}
          disabled={
            variants.length &&
            variants.some((variant) => variant.size_id === null)
          }
        >
          Add New Stock
        </Button>
      )}
    </Modal>
  );
}
