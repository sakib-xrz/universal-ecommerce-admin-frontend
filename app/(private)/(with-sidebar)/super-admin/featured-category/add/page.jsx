"use client";

import FormInput from "@/components/form/form-input";
import Label from "@/components/shared/label";
import Title from "@/components/shared/title";
import { useCreateFeaturedCategoryMutation } from "@/redux/api/featuredCategoryApi";
import { useGetCategoriesListQuery } from "@/redux/api/categoryApi";
import { Breadcrumb, Button, Select } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useFormik } from "formik";
import { ImageUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as Yup from "yup";

const items = [
  {
    title: <Link href="/super-admin/dashboard">Dashboard</Link>,
  },
  {
    title: <Link href="/super-admin/featured-category">Featured Category</Link>,
  },
  {
    title: "Add Featured Category",
  },
];

const youtubeUrlRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?([a-zA-Z0-9_-]{11})(\S+)?$/;

export default function AddFeaturedCategory() {
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesListQuery();
  const router = useRouter();

  const [createFeaturedCategory, { isLoading: isCreateLoading }] =
    useCreateFeaturedCategoryMutation();

  const formik = useFormik({
    initialValues: {
      category_id: "",
      title: "",
      youtube_video_link: "",
      banner: null,
    },
    validationSchema: Yup.object().shape({
      category_id: Yup.string().required("Category is required"),
      title: Yup.string().required("Title is required"),
      youtube_video_link: Yup.string()
        .matches(youtubeUrlRegex, "Must be a valid YouTube URL")
        .optional(),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("category_id", values.category_id);
      formData.append("title", values.title);

      if (values.youtube_video_link) {
        formData.append("youtube_video_link", values.youtube_video_link);
      }

      if (values.banner) {
        formData.append("banner", values.banner);
      }

      try {
        await createFeaturedCategory(formData).unwrap();
        formik.resetForm();
        toast.success("Featured category created successfully");
        router.push("/super-admin/featured-category");
      } catch (error) {
        toast.error(error?.message || "Failed to create featured category");
      }
    },
  });

  if (isCategoriesLoading) {
    return (
      <div className="flex h-[calc(100svh-130px)] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  const categoryOptions =
    categoriesData?.data
      ?.filter((cat) => cat.is_published)
      ?.map((category) => ({
        value: category.id,
        label: category.name,
      })) || [];

  return (
    <div className="space-y-5 xl:mx-auto xl:max-w-5xl">
      <Breadcrumb items={items} />

      <div className="space-y-3 sm:rounded-md sm:bg-white sm:p-6 sm:shadow lg:p-8">
        <Title title={"Create New Featured Category"} />
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div>
              <Label htmlFor="category_id" className="py-1">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                id="category_id"
                placeholder="Select a category"
                value={formik.values.category_id || undefined}
                onChange={(value) => formik.setFieldValue("category_id", value)}
                options={categoryOptions}
                className="!w-full"
                showSearch
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
              />
              {formik.touched.category_id && formik.errors.category_id && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.category_id}
                </p>
              )}
            </div>

            <div>
              <FormInput
                label="Title"
                name="title"
                placeholder="Ex. Premium T-Shirts Collection"
                formik={formik}
                required
              />
            </div>

            <div>
              <FormInput
                label="YouTube Video Link"
                name="youtube_video_link"
                placeholder="https://www.youtube.com/watch?v=..."
                formik={formik}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="banner">
                Banner Image{" "}
                <small className="text-blue-600">
                  (Recommended size: 1200x400)
                </small>
              </Label>
              <Dragger
                maxCount={1}
                multiple={false}
                accept=".jpg,.jpeg,.png"
                onChange={({ file }) => {
                  formik.setFieldValue("banner", file?.originFileObj);
                }}
                fileList={formik.values.banner ? [formik.values.banner] : []}
              >
                <p className="flex justify-center">
                  <ImageUp className="size-8 opacity-70" />
                </p>
                <p className="ant-upload-text !mt-3">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint !text-sm">
                  Support only .jpg, .jpeg, .png file format.
                </p>
              </Dragger>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <Link href="/super-admin/featured-category" className="w-full">
              <Button className="w-full">Cancel</Button>
            </Link>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={isCreateLoading}
            >
              Create Featured Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
