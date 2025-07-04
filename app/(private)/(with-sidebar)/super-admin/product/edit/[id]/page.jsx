/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import dynamic from "next/dynamic";
const DynamicQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import FormInput from "@/components/form/form-input";
import Label from "@/components/shared/label";
import Title from "@/components/shared/title";
import { Breadcrumb, Button, Input, Select, Tabs } from "antd";
import { useFormik } from "formik";
import Link from "next/link";
import { discountOptions } from "@/utils/constant";
import { Loader2 } from "lucide-react";
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "@/redux/api/productApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { sanitizeParams } from "@/utils";
import * as Yup from "yup";
import { useEffect } from "react";

const items = [
  {
    title: <Link href="/super-admin/dashboard">Dashboard</Link>,
  },
  {
    title: <Link href="/super-admin/product">Product</Link>,
  },
  {
    title: "Edit Product",
  },
];

export default function CreateProduct({ params: { id } }) {
  const router = useRouter();

  const { data, isLoading } = useGetSingleProductQuery(id);

  const [updateProduct, { isLoading: isUpdateProductLoading }] =
    useUpdateProductMutation();

  const currentProduct = data?.data;

  const formik = useFormik({
    initialValues: {
      name: "",
      sku: "",
      short_description: "",
      full_description: "",
      delivery_policy: "",
      youtube_video_link: "",
      buy_price: null,
      cost_price: null,
      sell_price: null,
      discount_type: null,
      discount: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product title is required"),
      sku: Yup.string().required("Product sku is required"),
      buy_price: Yup.number()
        .required("Buy price is required")
        .positive("Buy price must be positive"),
      cost_price: Yup.number()
        .required("Cost price is required")
        .positive("Cost price must be positive"),
      sell_price: Yup.number()
        .required("Sell price is required")
        .positive("Sell price must be positive"),
    }),
    onSubmit: async (values) => {
      const payload = {
        ...values,
        youtube_video_link: values.youtube_video_link || "",
        buy_price: parseFloat(values.buy_price),
        cost_price: parseFloat(values.cost_price),
        sell_price: parseFloat(values.sell_price),
        discount: parseFloat(values.discount),
      };
      try {
        await updateProduct({ id, data: payload }).unwrap();
        toast.success("Product update successfully");
        router.push("/super-admin/product");
      } catch (error) {
        toast.error(
          error?.errorMessages && error.errorMessages.length > 0
            ? error.errorMessages[0]?.message
            : error.message || "Something went wrong!!!",
        );
      }
    },
  });

  useEffect(() => {
    formik.setValues({
      name: currentProduct?.name,
      sku: currentProduct?.sku,
      short_description: currentProduct?.short_description,
      full_description: currentProduct?.full_description,
      delivery_policy: currentProduct?.delivery_policy,
      youtube_video_link: currentProduct?.youtube_video_link,
      buy_price: currentProduct?.buy_price,
      cost_price: currentProduct?.cost_price,
      sell_price: currentProduct?.sell_price,
      discount_type: currentProduct?.discount_type,
      discount: currentProduct?.discount,
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100svh-130px)] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Breadcrumb items={items} />

      <div className="space-y-3 sm:rounded-md sm:bg-white sm:p-6 sm:shadow lg:p-8">
        <Title title={"Update Product"} />

        <form onSubmit={formik.handleSubmit} className="space-y-2">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <FormInput
              label="Title"
              name="name"
              placeholder="Enter product title"
              formik={formik}
              required
            />
            <FormInput
              label="Product SKU"
              name="sku"
              placeholder="Enter product sku (it should be unique for each product)"
              formik={formik}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <FormInput
              label="Buy Price"
              name="buy_price"
              formik={formik}
              required
            />
            <FormInput
              label="Cost Price"
              name="cost_price"
              formik={formik}
              required
            />
            <FormInput
              label="Sell Price"
              name="sell_price"
              formik={formik}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="short_description" className={"py-1"}>
              Short Description
            </Label>
            <Input.TextArea
              name="short_description"
              placeholder="Enter short description"
              {...formik.getFieldProps("short_description")}
              showCount
              maxLength={255}
              style={{
                height: 150,
                resize: "none",
                paddingBottom: 20,
              }}
            />
          </div>

          <Tabs
            defaultActiveKey="1"
            type="card"
            size="small"
            items={[
              {
                label: "Description",
                key: "1",
                children: (
                  <DynamicQuill
                    placeholder="Enter detail description"
                    modules={{
                      toolbar: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ size: [] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [
                          { list: "ordered" },
                          { list: "bullet" },
                          { indent: "-1" },
                          { indent: "+1" },
                        ],
                        ["link", "image"],
                        ["clean"],
                      ],
                    }}
                    theme="snow"
                    value={formik.values.full_description}
                    onChange={(value) =>
                      formik.setFieldValue("full_description", value)
                    }
                  />
                ),
              },
              {
                label: "Delivery Policy",
                key: "2",
                children: (
                  <DynamicQuill
                    placeholder="Enter delivery policy"
                    modules={{
                      toolbar: [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ size: [] }],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [
                          { list: "ordered" },
                          { list: "bullet" },
                          { indent: "-1" },
                          { indent: "+1" },
                        ],
                        ["link", "image"],
                        ["clean"],
                      ],
                    }}
                    theme="snow"
                    value={formik.values.delivery_policy}
                    onChange={(value) =>
                      formik.setFieldValue("delivery_policy", value)
                    }
                  />
                ),
              },
            ]}
          />

          <FormInput
            label="Youtube Video Link"
            name="youtube_video_link"
            placeholder="Enter youtube video link"
            formik={formik}
          />

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="discount_type" className={"py-1"}>
                Discount Type
              </Label>
              <Select
                className="!mt-0.5 !w-full"
                name="discount_type"
                options={discountOptions}
                placeholder="Select Discount Type"
                onChange={(value) => {
                  {
                    formik.setFieldValue("discount_type", value);
                    formik.setFieldValue("discount", 0);
                  }
                }}
                value={formik.values.discount_type}
              />
            </div>

            <FormInput label="Discount" name="discount" formik={formik} />
          </div>

          <div>
            <div className="mt-5 flex items-center gap-2">
              <Button className="w-full" disabled={isUpdateProductLoading}>
                <Link href="/super-admin/product">Cancel</Link>
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={isUpdateProductLoading}
              >
                Update Product
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
