"use client";

import FormInput from "@/components/form/form-input";
import Label from "@/components/shared/label";
import Title from "@/components/shared/title";
import {
  useCreateSettingMutation,
  useGetSettingQuery,
  useUpdateSettingMutation,
} from "@/redux/api/settingApi";
import { Breadcrumb, Button, Card, Input } from "antd";
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
  const [faviconPreview, setFaviconPreview] = useState(null);

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
      favicon: null,
    },
    validationSchema: Yup.object().shape({
      address: Yup.string().min(10, "Address must be at least 10 characters"),
      phone: Yup.string().min(10, "Phone must be at least 10 characters"),
      email: Yup.string().email("Invalid email format"),
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
      favicon: Yup.mixed().nullable(),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if ((key === "logo" || key === "favicon") && values[key]) {
          formData.append(key, values[key]);
        } else if (
          key !== "logo" &&
          key !== "favicon" &&
          values[key] !== null
        ) {
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
        favicon: null,
      });
      setLogoPreview(setting.logo);
      setFaviconPreview(setting.favicon);
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
    <div className="space-y-6 xl:mx-auto xl:max-w-7xl">
      <Breadcrumb items={items} />

      <div className="space-y-6">
        <Title title={isEditing ? "Update Settings" : "Create Settings"} />

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Logo & Branding Section */}
          <Card title="Logo & Branding" className="shadow-sm">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Logo Upload */}
              <div className="space-y-4">
                <Label htmlFor="logo" required>
                  Company Logo{" "}
                  <small className="text-blue-600">
                    (Recommended size: 230x45)
                  </small>
                </Label>

                {logoPreview && (
                  <div className="mb-4">
                    <Image
                      src={logoPreview}
                      alt="Current logo"
                      width={200}
                      height={100}
                      className="rounded border bg-gray-50 object-contain p-2"
                    />
                  </div>
                )}

                <div
                  className={`${formik.touched.logo && formik.errors.logo ? "ant-upload-error" : ""}`}
                >
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
                    className="max-w-md"
                    style={{
                      borderColor:
                        formik.touched.logo && formik.errors.logo
                          ? "#ff4d4f"
                          : undefined,
                    }}
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

                {formik.touched.logo && formik.errors.logo && (
                  <div className="mt-1 text-sm text-red-500">
                    {formik.errors.logo}
                  </div>
                )}
              </div>

              {/* Favicon Upload */}
              <div className="space-y-4">
                <Label htmlFor="favicon">
                  Favicon{" "}
                  <small className="text-blue-600">
                    (Recommended size: 16x16, 32x32, or 64x64)
                  </small>
                </Label>

                {faviconPreview && (
                  <div className="mb-4">
                    <Image
                      src={faviconPreview}
                      alt="Current favicon"
                      width={64}
                      height={64}
                      className="rounded border bg-gray-50 object-contain p-2"
                    />
                  </div>
                )}

                <div
                  className={`${formik.touched.favicon && formik.errors.favicon ? "ant-upload-error" : ""}`}
                >
                  <Dragger
                    maxCount={1}
                    multiple={false}
                    accept=".jpg,.jpeg,.png,.ico"
                    onChange={({ file }) => {
                      if (file?.originFileObj) {
                        formik.setFieldValue("favicon", file.originFileObj);
                        // Create preview
                        const reader = new FileReader();
                        reader.onload = (e) =>
                          setFaviconPreview(e.target.result);
                        reader.readAsDataURL(file.originFileObj);
                      }
                    }}
                    fileList={[]}
                    className="max-w-md"
                    style={{
                      borderColor:
                        formik.touched.favicon && formik.errors.favicon
                          ? "#ff4d4f"
                          : undefined,
                    }}
                  >
                    <p className="flex justify-center">
                      <ImageUp className="size-8 opacity-70" />
                    </p>
                    <p className="ant-upload-text !mt-3">
                      Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint !text-sm">
                      Support .jpg, .jpeg, .png, .ico file format.
                    </p>
                  </Dragger>
                </div>

                {formik.touched.favicon && formik.errors.favicon && (
                  <div className="mt-1 text-sm text-red-500">
                    {formik.errors.favicon}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Basic Site Information */}
          <Card title="Basic Site Information" className="shadow-sm">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <FormInput
                label="Site Title"
                name="title"
                placeholder="Enter site title"
                formik={formik}
                required
              />

              <FormInput
                label="Meta Keywords"
                name="keywords"
                placeholder="Enter meta keywords (comma separated)"
                formik={formik}
                required
              />

              <div className="space-y-4 lg:col-span-2">
                <div className="space-y-1">
                  <Label htmlFor="description" required>
                    Meta Description
                  </Label>
                  <Input.TextArea
                    name="description"
                    placeholder="Enter meta description for SEO"
                    {...formik.getFieldProps("description")}
                    showCount
                    maxLength={255}
                    style={{
                      height: 150,
                      resize: "none",
                      paddingBottom: 20,
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card title="Contact Information" className="shadow-sm">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-4 lg:col-span-2">
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter business email address"
                  formik={formik}
                />

                <FormInput
                  label="Phone Number"
                  name="phone"
                  placeholder="Enter phone number"
                  formik={formik}
                />

                <div className="space-y-4 lg:col-span-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input.TextArea
                    name="address"
                    placeholder="Enter full business address"
                    {...formik.getFieldProps("address")}
                    showCount
                    maxLength={255}
                    style={{
                      height: 150,
                      resize: "none",
                      paddingBottom: 20,
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Social Media Links */}
          <Card title="Social Media Links" className="shadow-sm">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <FormInput
                label="Facebook Page URL"
                name="facebook"
                placeholder="https://facebook.com/yourpage"
                formik={formik}
              />

              <FormInput
                label="Instagram Profile URL"
                name="instagram"
                placeholder="https://instagram.com/yourprofile"
                formik={formik}
              />
            </div>
          </Card>

          {/* Analytics & Tracking */}
          <Card title="Analytics & Tracking" className="shadow-sm">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <FormInput
                label="Google Analytics ID"
                name="google_analytics_id"
                placeholder="GA-XXXXXXXXX-X"
                formik={formik}
              />

              <FormInput
                label="Google Tag Manager ID"
                name="google_tag_manager_id"
                placeholder="GTM-XXXXXXX"
                formik={formik}
              />

              <FormInput
                label="Facebook Pixel ID"
                name="facebook_pixel_id"
                placeholder="XXXXXXXXXXXXXXX"
                formik={formik}
              />
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreateLoading || isUpdateLoading}
              className="min-w-[140px]"
              size="large"
            >
              {isEditing ? "Update Settings" : "Create Settings"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
