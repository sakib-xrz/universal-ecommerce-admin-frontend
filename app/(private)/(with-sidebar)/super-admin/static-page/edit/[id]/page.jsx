"use client";

import dynamic from "next/dynamic";
const DynamicQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import FormInput from "@/components/form/form-input";
import Label from "@/components/shared/label";
import Title from "@/components/shared/title";
import {
  useGetStaticPageQuery,
  useUpdateStaticPageMutation,
} from "@/redux/api/staticPageApi";
import { Breadcrumb, Button, Select } from "antd";
import { useFormik } from "formik";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const kindOptions = [
  { value: "ABOUT_US", label: "About Us" },
  { value: "PRIVACY_POLICY", label: "Privacy Policy" },
  { value: "TERMS_AND_CONDITIONS", label: "Terms and Conditions" },
];

export default function EditStaticPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { data: pageData, isLoading } = useGetStaticPageQuery(id);
  const [updateStaticPage, { isLoading: isUpdateLoading }] =
    useUpdateStaticPageMutation();

  const page = pageData?.data;

  const items = [
    {
      title: <Link href="/super-admin/dashboard">Dashboard</Link>,
    },
    {
      title: <Link href="/super-admin/static-page">Static Pages</Link>,
    },
    {
      title: "Edit Static Page",
    },
  ];

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      kind: "",
      content: "",
    },
    validationSchema: Yup.object().shape({
      title: Yup.string()
        .required("Title is required")
        .min(5, "Title must be at least 5 characters"),
      description: Yup.string()
        .required("Description is required")
        .min(20, "Description must be at least 20 characters"),
      kind: Yup.string().required("Type is required"),
      content: Yup.string()
        .required("Content is required")
        .min(50, "Content must be at least 50 characters"),
    }),
    onSubmit: async (values) => {
      try {
        await updateStaticPage({ id, payload: values }).unwrap();
        toast.success("Static page updated successfully");
        router.push("/super-admin/static-page");
      } catch (error) {
        toast.error(error?.message || "Failed to update static page");
      }
    },
  });

  useEffect(() => {
    if (page) {
      formik.setValues({
        title: page.title || "",
        description: page.description || "",
        kind: page.kind || "",
        content: page.content || "",
      });
    }
  }, [page]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100svh-130px)] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5 xl:mx-auto xl:max-w-5xl">
      <Breadcrumb items={items} />

      <div className="space-y-3 sm:rounded-md sm:bg-white sm:p-6 sm:shadow lg:p-8">
        <Title title="Edit Static Page" />

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormInput
              label="Title"
              name="title"
              placeholder="Enter page title"
              formik={formik}
              required
            />

            <div className="space-y-1">
              <Label htmlFor="kind">Type *</Label>
              <Select
                id="kind"
                placeholder="Select page type"
                options={kindOptions}
                value={formik.values.kind || undefined}
                onChange={(value) => formik.setFieldValue("kind", value)}
                className="w-full"
              />
              {formik.touched.kind && formik.errors.kind && (
                <div className="text-sm text-red-600">{formik.errors.kind}</div>
              )}
            </div>
          </div>

          <FormInput
            label="Description"
            name="description"
            placeholder="Enter page description"
            formik={formik}
            required
          />

          <div className="space-y-1">
            <Label htmlFor="content">Content *</Label>
            <DynamicQuill
              placeholder="Enter page content"
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
              value={formik.values.content}
              onChange={(value) => formik.setFieldValue("content", value)}
              style={{ minHeight: "200px" }}
            />
            {formik.touched.content && formik.errors.content && (
              <div className="text-sm text-red-600">
                {formik.errors.content}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/super-admin/static-page" className="w-full">
              <Button className="w-full">Cancel</Button>
            </Link>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={isUpdateLoading}
            >
              Update Static Page
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
