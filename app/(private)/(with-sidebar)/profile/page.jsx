"use client";

import FormInput from "@/components/form/form-input";
import Title from "@/components/shared/title";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateProfilePictureMutation,
} from "@/redux/api/profileApi";
import { Button, Upload } from "antd";
import { useFormik } from "formik";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Profile() {
  const { data, isLoading } = useGetProfileQuery();
  const [updateProfilePicture, { isLoading: isUpdateProfilePictureLoading }] =
    useUpdateProfilePictureMutation();

  const [updateProfile, { isLoading: isUpdateProfileLoading }] =
    useUpdateProfileMutation();

  const user = data?.data;

  const [isUploading, setIsUploading] = useState(false);

  const handleChange = async (info) => {
    if (isUploading) return;
    setIsUploading(true);

    try {
      const file = info.file.originFileObj;
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);
      await updateProfilePicture(formData).unwrap();
      toast.success("Profile picture updated successfully");
    } catch (error) {
      toast.error("Failed to update profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      phone: "",
    },
    onSubmit: async (values) => {
      const payload = {
        name: values.name,
        phone: values.phone.startsWith("+88")
          ? values.phone
          : `+88${values.phone}`,
      };
      try {
        await updateProfile(payload).unwrap();
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(error.message || "Failed to update profile");
      }
    },
  });

  useEffect(() => {
    if (user) {
      formik.setFieldValue("email", user.email);
      formik.setFieldValue("name", user.name);
      formik.setFieldValue("phone", user.phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100svh-150px)] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3 sm:rounded-md sm:bg-white sm:p-6 sm:shadow lg:mx-auto lg:w-8/12 lg:p-8">
        <Title title={"Update Profile"} />
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <Upload
                listType="picture-circle"
                showUploadList={false}
                accept="image/*"
                maxCount={1}
                onChange={handleChange}
                disabled={isUpdateProfilePictureLoading || isUploading}
              >
                {isUpdateProfilePictureLoading || isUploading ? (
                  <div className="flex size-28 flex-col items-center justify-center gap-2 rounded-full bg-gray-100 text-sm">
                    <Loader2 size={16} className="animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  <Image
                    src={user?.image}
                    alt={user?.name}
                    width={100}
                    height={100}
                    className="size-28 rounded-full object-cover"
                  />
                )}
              </Upload>
            </div>

            <FormInput
              label="Email"
              name="email"
              placeholder=""
              formik={formik}
              required
              disabled
            />
            <FormInput
              label="Name"
              name="name"
              placeholder="Enter your name"
              formik={formik}
              required
            />
            <FormInput
              label="Phone"
              name="phone"
              placeholder="Enter your phone number"
              formik={formik}
              required
            />
          </div>

          <Button
            disabled={isUpdateProfileLoading || isUpdateProfilePictureLoading}
            loading={isUpdateProfileLoading}
            className="w-full"
            type="primary"
            htmlType="submit"
          >
            Update Profile
          </Button>
        </form>
      </div>
    </div>
  );
}
