import FormInput from "@/components/form/form-input";
import Label from "@/components/shared/label";
import { useUpdateFeaturedCategoryMutation } from "@/redux/api/featuredCategoryApi";
import { useGetCategoriesListQuery } from "@/redux/api/categoryApi";
import { Button, Modal, Select } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useFormik } from "formik";
import { ImageUp, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import * as Yup from "yup";

const youtubeUrlRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?([a-zA-Z0-9_-]{11})(\S+)?$/;

export default function EditFeaturedCategoryModal({
  open,
  setOpen,
  data,
  setData,
}) {
  const { data: categoriesData } = useGetCategoriesListQuery();
  const [updateFeaturedCategory, { isLoading }] =
    useUpdateFeaturedCategoryMutation();

  const formik = useFormik({
    initialValues: {
      category_id: data.category_id,
      title: data.title,
      youtube_video_link: data.youtube_video_link || "",
      banner: data.banner_url,
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

      if (typeof values.banner === "object" && values.banner) {
        formData.append("banner", values.banner);
      }

      try {
        await updateFeaturedCategory({
          id: data.id,
          payload: formData,
        }).unwrap();
        toast.success("Featured category updated successfully");
        setOpen(false);
        setData(null);
      } catch (error) {
        toast.error(error?.message || "Failed to update featured category");
      }
    },
  });

  const categoryOptions =
    categoriesData?.data
      ?.filter((cat) => cat.is_published)
      ?.map((category) => ({
        value: category.id,
        label: category.name,
      })) || [];

  return (
    <Modal
      open={open}
      title={`Edit Featured Category - ${data.title}`}
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
      width={800}
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
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

          {formik.values.banner !== null &&
          typeof formik.values.banner === "string" ? (
            <div className="relative">
              <Image
                src={formik.values.banner}
                alt={formik.values.title}
                quality={100}
                width={1200}
                height={400}
                className="h-auto w-full rounded object-cover"
                placeholder="blur"
                blurDataURL={formik.values.banner}
              />
              <X
                onClick={() => formik.setFieldValue("banner", null)}
                className="absolute right-2 top-2 cursor-pointer rounded-full bg-danger p-1 text-white"
                size={24}
              />
            </div>
          ) : (
            <Dragger
              maxCount={1}
              multiple={false}
              accept=".jpg,.jpeg,.png"
              onChange={({ file }) => {
                formik.setFieldValue("banner", file?.originFileObj);
              }}
              fileList={
                formik.values.banner && typeof formik.values.banner === "object"
                  ? [formik.values.banner]
                  : []
              }
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
          )}
        </div>
      </form>
    </Modal>
  );
}
