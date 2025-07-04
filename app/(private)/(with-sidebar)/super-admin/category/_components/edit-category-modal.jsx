import FormInput from "@/components/form/form-input";
import Label from "@/components/shared/label";
import { useUpdateCategoryMutation } from "@/redux/api/categoryApi";
import { Button, Cascader, Checkbox, Modal } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useFormik } from "formik";
import { ImageUp, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import * as Yup from "yup";

export default function EditCategoryModal({
  open,
  setOpen,
  data,
  setData,
  options,
}) {
  console.log(data);
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();
  const formik = useFormik({
    initialValues: {
      name: data.name,
      parent_category_id: data.parent_category_id,
      make_parent: false,
      route: data.route,
      image: data.image,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("route", values.route);
      formData.append("parent_category_id", values.parent_category_id);
      if (typeof values.image === "object") {
        formData.append("image", values.image);
      }

      try {
        await updateCategory({
          id: data.id,
          payload: formData,
        }).unwrap();
        toast.success("Category updated successfully");
      } catch (error) {
        toast.error(error?.message);
      } finally {
        setOpen(false);
        setData(null);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <Modal
        open={open}
        title={`Edit Category - ${data.name}`}
        icon={<></>}
        closable={false}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              disabled={isLoading}
              htmlType="button"
              onClick={() => {
                setData(null);
                setOpen(false);
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
              Save Changes
            </Button>
          </div>
        }
        centered
        destroyOnClose
      >
        <div className="space-y-2">
          {formik.values.image !== null &&
          typeof formik.values.image === "string" ? (
            <div className="relative">
              <Image
                src={formik.values.image}
                alt={formik.values.name}
                quality={100}
                width={1200}
                height={725}
                className="h-auto w-full rounded object-cover"
                placeholder="blur"
                blurDataURL={formik.values.image}
              />
              <X
                htmlType="button"
                onClick={() => formik.setFieldValue("image", null)}
                className="absolute right-2 top-2 cursor-pointer rounded-full bg-danger text-white"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <Label htmlFor={"image"}>
                Image{" "}
                <small className="text-blue-600">
                  (Recommended size: 1200x725)
                </small>
              </Label>
              <Dragger
                maxCount={1}
                multiple={false}
                accept=".jpg,.jpeg,.png"
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
                  Support only .jpg, .jpeg, .png file format.
                </p>
              </Dragger>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Label htmlFor="parent_category_id" className={"py-1"}>
              Parent Category (Only change if needed)
            </Label>
            <Cascader
              options={
                options.filter((option) => option.value !== data.id) || []
              }
              onChange={(value) => {
                formik.setFieldValue(
                  "parent_category_id",
                  value?.length ? value[value?.length - 1] : null,
                );
              }}
              changeOnSelect
              className="!w-full"
              placeholder="Select Parent Category"
              disabled={formik.values.make_parent}
            />
          </div>

          <Checkbox
            onChange={(e) => {
              formik.setFieldValue("make_parent", e.target.checked);
              formik.setFieldValue("parent_category_id", null);
            }}
            disabled={data.parent_category_id === null}
          >
            Make this category as a parent category
          </Checkbox>

          <div>
            <FormInput
              label="Name"
              name="name"
              placeholder="Ex. T-Shirt"
              formik={formik}
              required
            />
          </div>
        </div>
      </Modal>
    </form>
  );
}
