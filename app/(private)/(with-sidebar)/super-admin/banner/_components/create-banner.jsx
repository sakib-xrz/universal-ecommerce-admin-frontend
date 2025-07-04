"use client";

import FormikErrorBox from "@/components/shared/formik-error-box";
import Label from "@/components/shared/label";
import { useCreateBannerMutation } from "@/redux/api/bannerApi";
import { Button, Modal } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useFormik } from "formik";
import { ImageUp } from "lucide-react";
import { toast } from "sonner";
import * as Yup from "yup";

export default function CreateBanner({ open, setOpen }) {
  const [createBanner, { isLoading }] = useCreateBannerMutation();

  const formik = useFormik({
    initialValues: {
      image: null,
    },
    validationSchema: Yup.object().shape({
      image: Yup.mixed().required("Banner image is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("image", values.image);

      try {
        await createBanner(formData).unwrap();
        setOpen(false);
        formik.resetForm();
        toast.success("Banner created successfully");
      } catch (error) {
        console.error(error);
        toast.error(error?.message || "Failed to create banner");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <Modal
        open={open}
        title={`Add New Banner`}
        icon={<></>}
        closable={false}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              disabled={isLoading}
              htmlType="button"
              onClick={() => {
                setOpen(false);
                formik.resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={formik.handleSubmit}
              loading={isLoading}
            >
              Add Banner
            </Button>
          </div>
        }
        centered
        destroyOnClose
        width={600}
      >
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor={"image"} required>
              Banner Image{" "}
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
      </Modal>
    </form>
  );
}
