"use client";

import Label from "@/components/shared/label";
import Title from "@/components/shared/title";
import FormikErrorBox from "@/components/shared/formik-error-box";
import {
  useGetBannersQuery,
  useUpdateBannerMutation,
} from "@/redux/api/bannerApi";
import { Breadcrumb, Button, Image } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useFormik } from "formik";
import { ImageUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import * as Yup from "yup";
import { useState, useEffect } from "react";

const breadcrumbItems = [
  {
    title: <Link href="/super-admin/dashboard">Dashboard</Link>,
  },
  {
    title: <Link href="/super-admin/banner">Banner</Link>,
  },
  {
    title: "Edit Banner",
  },
];

export default function EditBanner() {
  const router = useRouter();
  const params = useParams();
  const bannerId = params.id;

  const [currentImage, setCurrentImage] = useState("");

  const { data: bannersData, isLoading: isBannersLoading } =
    useGetBannersQuery();
  const [updateBanner, { isLoading: isUpdateBannerLoading }] =
    useUpdateBannerMutation();

  // Find the current banner
  const currentBanner = bannersData?.data?.find(
    (banner) => banner.id === bannerId,
  );

  const formik = useFormik({
    initialValues: {
      image: null,
    },
    validationSchema: Yup.object({
      // Image is not required for update since user might want to keep current image
    }),
    onSubmit: async (values) => {
      // If no new image is selected, show error
      if (!values.image) {
        toast.error("Please select a new image to update");
        return;
      }

      const formData = new FormData();
      formData.append("image", values.image);

      try {
        await updateBanner({ id: bannerId, data: formData }).unwrap();
        toast.success("Banner updated successfully");
        router.push("/super-admin/banner");
      } catch (error) {
        toast.error(
          error?.errorMessages && error.errorMessages.length > 0
            ? error.errorMessages[0]?.message
            : error.message || "Something went wrong!!!",
        );
      }
    },
  });

  // Set initial values when banner data is loaded
  useEffect(() => {
    if (currentBanner) {
      setCurrentImage(currentBanner.image_url || "");
    }
  }, [currentBanner]);

  if (isBannersLoading) {
    return (
      <div className="flex h-[calc(100svh-130px)] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!currentBanner) {
    return (
      <div className="flex h-[calc(100svh-130px)] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">Banner Not Found</h2>
          <p className="mb-4 text-gray-600">
            The banner you're looking for doesn't exist.
          </p>
          <Button
            type="primary"
            onClick={() => router.push("/super-admin/banner")}
          >
            Back to Banners
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 xl:mx-auto xl:max-w-5xl">
      <Breadcrumb items={breadcrumbItems} />

      <div className="space-y-3 sm:rounded-md sm:bg-white sm:p-6 sm:shadow lg:p-8">
        <Title title={"Edit Banner"} />

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div className="space-y-2">
            {/* Show current image */}
            {currentImage && (
              <div className="mb-4">
                <Label className="py-1">Current Banner Image:</Label>
                <div className="mt-2">
                  <Image
                    src={currentImage}
                    alt="Current banner"
                    width={400}
                    height={150}
                    className="rounded-lg border object-cover"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor={"image"}>
                Upload New Banner Image{" "}
                <small className="text-blue-600">
                  (Recommended size: 1200x400)
                </small>
              </Label>
              <Dragger
                maxCount={1}
                multiple={false}
                accept=".jpg,.jpeg,.png,.webp"
                onChange={({ file }) => {
                  formik.setFieldValue("image", file?.originFileObj);
                }}
                fileList={formik.values.image ? [formik.values.image] : []}
              >
                <p className="flex justify-center">
                  <ImageUp className="size-8 opacity-70" />
                </p>
                <p className="ant-upload-text !mt-3">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint !text-sm">
                  Support .jpg, .jpeg, .png, .webp file format. Max size: 5MB
                </p>
              </Dragger>
              <FormikErrorBox formik={formik} name="image" />
            </div>
          </div>

          <div>
            <div className="mt-5 flex items-center gap-2">
              <Link href="/super-admin/banner" className="w-full">
                <Button className="w-full">Cancel</Button>
              </Link>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={isUpdateBannerLoading}
              >
                Update Banner
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
