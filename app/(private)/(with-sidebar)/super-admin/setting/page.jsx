"use client";

import FormInput from "@/components/form/form-input";
import Label from "@/components/shared/label";
import Title from "@/components/shared/title";
import {
  useCreateSettingMutation,
  useGetSettingQuery,
  useUpdateSettingMutation,
} from "@/redux/api/settingApi";
import { Breadcrumb, Button } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useFormik } from "formik";
import { ImageUp, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const items = [
  {
    title: <Link href="/super-admin/dashboard">Dashboard</Link>,
  },
  {
    title: "Settings",
  },
];

export default function Setting() {
  const { data: settingData, isLoading } = useGetSettingQuery();
  const [createSetting, { isLoading: isCreateLoading }] =
    useCreateSettingMutation();
  const [updateSetting, { isLoading: isUpdateLoading }] =
    useUpdateSettingMutation();
  const [logoPreview, setLogoPreview] = useState(null);

  const setting = settingData?.data;
  const isEditing = Boolean(setting);

  const formik = useFormik({
    initialValues: {
      address: "",
      phone: "",
      email: "",
      facebook: "",
      instagram: "",
      title: "",
      description: "",
      keywords: "",
      google_analytics_id: "",
      google_tag_manager_id: "",
      facebook_pixel_id: "",
      logo: null,
    },
    validationSchema: Yup.object().shape({
      address: Yup.string()
        .required("Address is required")
        .min(10, "Address must be at least 10 characters"),
      phone: Yup.string()
        .required("Phone is required")
        .min(10, "Phone must be at least 10 characters"),
      email: Yup.string()
        .required("Email is required")
        .email("Invalid email format"),
      title: Yup.string()
        .required("Title is required")
        .min(5, "Title must be at least 5 characters"),
      description: Yup.string()
        .required("Description is required")
        .min(20, "Description must be at least 20 characters"),
      keywords: Yup.string()
        .required("Keywords are required")
        .min(10, "Keywords must be at least 10 characters"),
      facebook: Yup.string().url("Invalid URL format").nullable(),
      instagram: Yup.string().url("Invalid URL format").nullable(),
      logo: isEditing
        ? Yup.mixed().nullable()
        : Yup.mixed().required("Logo is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key === "logo" && values[key]) {
          formData.append(key, values[key]);
        } else if (key !== "logo" && values[key] !== null) {
          formData.append(key, values[key] || "");
        }
      });

      try {
        if (isEditing) {
          await updateSetting({ id: setting.id, payload: formData }).unwrap();
          toast.success("Settings updated successfully");
        } else {
          await createSetting(formData).unwrap();
          toast.success("Settings created successfully");
        }
      } catch (error) {
        toast.error(
          error?.message ||
            `Failed to ${isEditing ? "update" : "create"} settings`,
        );
      }
    },
  });

  useEffect(() => {
    if (setting) {
      formik.setValues({
        address: setting.address || "",
        phone: setting.phone || "",
        email: setting.email || "",
        facebook: setting.facebook || "",
        instagram: setting.instagram || "",
        title: setting.title || "",
        description: setting.description || "",
        keywords: setting.keywords || "",
        google_analytics_id: setting.google_analytics_id || "",
        google_tag_manager_id: setting.google_tag_manager_id || "",
        facebook_pixel_id: setting.facebook_pixel_id || "",
        logo: null,
      });
      setLogoPreview(setting.logo);
    }
  }, [setting]);

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
        <Title title={isEditing ? "Update Settings" : "Create Settings"} />

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-4">
              <FormInput
                label="Site Title"
                name="title"
                placeholder="Enter site title"
                formik={formik}
                required
              />

              <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email address"
                formik={formik}
                required
              />

              <FormInput
                label="Phone"
                name="phone"
                placeholder="Enter phone number"
                formik={formik}
                required
              />

              <FormInput
                label="Facebook URL"
                name="facebook"
                placeholder="Enter Facebook URL"
                formik={formik}
              />

              <FormInput
                label="Instagram URL"
                name="instagram"
                placeholder="Enter Instagram URL"
                formik={formik}
              />
            </div>

            <div className="space-y-4">
              <FormInput
                label="Address"
                name="address"
                placeholder="Enter full address"
                formik={formik}
                required
              />

              <FormInput
                label="Meta Description"
                name="description"
                placeholder="Enter meta description"
                formik={formik}
                required
              />

              <FormInput
                label="Meta Keywords"
                name="keywords"
                placeholder="Enter meta keywords"
                formik={formik}
                required
              />

              <FormInput
                label="Google Analytics ID"
                name="google_analytics_id"
                placeholder="Enter Google Analytics ID"
                formik={formik}
              />

              <FormInput
                label="Google Tag Manager ID"
                name="google_tag_manager_id"
                placeholder="Enter Google Tag Manager ID"
                formik={formik}
              />

              <FormInput
                label="Facebook Pixel ID"
                name="facebook_pixel_id"
                placeholder="Enter Facebook Pixel ID"
                formik={formik}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="logo">
              Logo{" "}
              <small className="text-blue-600">
                (Recommended size: 400x200)
              </small>
            </Label>

            {logoPreview && (
              <div className="mb-4">
                <Image
                  src={logoPreview}
                  alt="Current logo"
                  width={200}
                  height={100}
                  className="rounded border object-contain"
                />
              </div>
            )}

            <Dragger
              maxCount={1}
              multiple={false}
              accept=".jpg,.jpeg,.png"
              onChange={({ file }) => {
                if (file?.originFileObj) {
                  formik.setFieldValue("logo", file.originFileObj);
                  // Create preview
                  const reader = new FileReader();
                  reader.onload = (e) => setLogoPreview(e.target.result);
                  reader.readAsDataURL(file.originFileObj);
                }
              }}
              fileList={[]}
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

          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreateLoading || isUpdateLoading}
              className="min-w-[120px]"
            >
              {isEditing ? "Update Settings" : "Create Settings"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
