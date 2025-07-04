import Label from "@/components/shared/label";
import { useGetSingleProductQuery } from "@/redux/api/productApi";
import {
  useDeleteProductImageMutation,
  useUploadProductImageMutation,
} from "@/redux/api/productImageApi";
import { Button, Modal, Upload } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { ImageUp, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function ManageImageModal({
  openManageImagesModal,
  setOpenManageImagesModal,
  currentProductId,
  setCurrentProductId,
  params,
  setParams,
}) {
  const [deleteImageId, setDeleteImageId] = useState(null);
  const { data, isLoading: isCurrentProductLoading } =
    useGetSingleProductQuery(currentProductId);
  const [uploadProductImage, { isLoading }] = useUploadProductImageMutation();
  const [productType, setProductType] = useState(null);
  const [deleteProductImage, { isLoading: isDeleteLoading }] =
    useDeleteProductImageMutation();

  if (isCurrentProductLoading) {
    return null;
  }

  const currentProduct = data?.data;

  const handleUploadImage = async (file, type) => {
    if (!file || isLoading) return;

    try {
      setProductType(type);
      const formData = new FormData();
      formData.append("product_id", currentProduct.id);
      formData.append("type", type);
      formData.append("image", file.originFileObj);

      await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setProductType(null);
    }
  };

  const handleDeleteImage = async (imageId, type) => {
    if (isDeleteLoading) return;

    try {
      setDeleteImageId(imageId);
      setProductType(type);
      await deleteProductImage(imageId).unwrap();
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete image");
    } finally {
      setProductType(null);
      setDeleteImageId(null);
    }
  };

  const imageList = currentProduct?.images || [];

  const primaryImage =
    imageList && imageList.find((image) => image.type === "PRIMARY");

  const secondaryImage =
    imageList && imageList.find((image) => image.type === "SECONDARY");

  const extraImages =
    imageList && imageList.filter((image) => image.type === "EXTRA");

  return (
    <Modal
      open={openManageImagesModal}
      onCancel={() => {
        setParams({ ...params, id: null });
        setCurrentProductId(null);
        setOpenManageImagesModal(false);
      }}
      title={
        <div className="pr-8">
          Manage Images for {currentProduct?.name}{" "}
          <span className="font-normal text-gray-500">
            ({currentProduct?.sku})
          </span>
          <p className="text-xs font-normal text-gray-500">
            Recommended product size: 1280x1280
          </p>
        </div>
      }
      centered
      footer={null}
      destroyOnClose
      width={"auto"}
    >
      <>
        <div className="flex items-center gap-4">
          {primaryImage?.image_url ? (
            <div>
              <Label required>Primary Image</Label>
              <div className="relative">
                <Image
                  src={primaryImage?.image_url}
                  alt=""
                  width={128}
                  height={128}
                  className="size-32 rounded object-cover"
                />
                <Button
                  size="small"
                  shape="circle"
                  className="!disabled:cursor-not-allowed !absolute right-2 top-2"
                  danger
                  onClick={() => handleDeleteImage(primaryImage.id, "PRIMARY")}
                  disabled={isDeleteLoading && productType === "PRIMARY"}
                >
                  {isDeleteLoading && productType === "PRIMARY" ? (
                    <Loader2 size={16} className="animate-spin text-white" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="product">
              <Label required>Primary Image</Label>
              <Upload
                listType="picture-card"
                showUploadList={false}
                accept="image/*"
                maxCount={1}
                onChange={({ file }) => {
                  if (file.status === "done" || file.status === "uploading") {
                    handleUploadImage(file, "PRIMARY");
                  }
                }}
                disabled={isLoading && productType === "PRIMARY"}
                className="!disabled:cursor-not-allowed"
              >
                <button
                  style={{
                    border: 0,
                    background: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                  className="!disabled:cursor-not-allowed !outline-none"
                >
                  {isLoading && productType === "PRIMARY" ? (
                    <div className="gap-2text-sm flex size-32 flex-col items-center justify-center">
                      <Loader2 size={16} className="animate-spin" />
                      Uploading...
                    </div>
                  ) : (
                    <>
                      <Plus size={24} />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </>
                  )}
                </button>
              </Upload>
            </div>
          )}

          {secondaryImage?.image_url ? (
            <div>
              <Label required>Secondary Image</Label>
              <div className="relative">
                <Image
                  src={secondaryImage?.image_url}
                  alt=""
                  width={128}
                  height={128}
                  className="size-32 rounded object-cover"
                />
                <Button
                  size="small"
                  shape="circle"
                  className="!disabled:cursor-not-allowed !absolute right-2 top-2"
                  danger
                  onClick={() =>
                    handleDeleteImage(secondaryImage.id, "SECONDARY")
                  }
                  disabled={isDeleteLoading && productType === "SECONDARY"}
                >
                  {isDeleteLoading && productType === "SECONDARY" ? (
                    <Loader2 size={16} className="animate-spin text-white" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="product">
              <Label>Secondary Image</Label>
              <Upload
                listType="picture-card"
                showUploadList={false}
                accept="image/*"
                maxCount={1}
                onChange={({ file }) => {
                  if (file.status === "done" || file.status === "uploading") {
                    handleUploadImage(file, "SECONDARY");
                  }
                }}
                disabled={isLoading && productType === "SECONDARY"}
                className="!disabled:cursor-not-allowed"
              >
                <button
                  style={{
                    border: 0,
                    background: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                  className="!disabled:cursor-not-allowed !outline-none"
                >
                  {isLoading && productType === "SECONDARY" ? (
                    <div className="gap-2text-sm flex size-32 flex-col items-center justify-center">
                      <Loader2 size={16} className="animate-spin" />
                      Uploading...
                    </div>
                  ) : (
                    <>
                      <Plus size={24} />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </>
                  )}
                </button>
              </Upload>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Label>
            Extra Images <span className="text-gray-500">(max 4)</span>
          </Label>
          <div className="space-y-2">
            {extraImages.length < 4 && (
              <div>
                <Dragger
                  maxCount={1}
                  multiple={false}
                  accept=".jpg,.jpeg,.png"
                  onChange={({ file }) => {
                    if (file.status === "done" || file.status === "uploading") {
                      handleUploadImage(file, "EXTRA");
                    }
                  }}
                  fileList={[]}
                  className="w-full"
                  disabled={isLoading && productType === "EXTRA"}
                >
                  <p className="flex justify-center">
                    {isLoading && productType === "EXTRA" ? (
                      <Loader2 className="size-8 animate-spin" />
                    ) : (
                      <ImageUp className="size-8 opacity-70" />
                    )}
                  </p>
                  <p className="ant-upload-text !mt-3">
                    {isLoading && productType === "EXTRA"
                      ? "Uploading..."
                      : "Click or drag file to this area to upload"}
                  </p>
                  <p className="ant-upload-hint !text-sm">
                    {isLoading && productType === "EXTRA"
                      ? "It may take a few seconds to upload the image."
                      : "Support only .jpg, .jpeg, .png file format."}
                  </p>
                </Dragger>
              </div>
            )}

            {extraImages.length > 0 && (
              <div className="grid w-full grid-cols-2 items-center gap-4 sm:grid-cols-4">
                {extraImages.map((image) => (
                  <div className="relative w-full sm:w-fit" key={image.id}>
                    <Image
                      src={image?.image_url}
                      alt=""
                      width={128}
                      height={128}
                      className="w-full rounded object-cover sm:size-32"
                    />
                    <Button
                      size="small"
                      shape="circle"
                      className="!disabled:cursor-not-allowed !absolute right-2 top-2"
                      danger
                      onClick={() => handleDeleteImage(image.id, "EXTRA")}
                      disabled={
                        isDeleteLoading &&
                        productType === "EXTRA" &&
                        deleteImageId === image.id
                      }
                    >
                      {isDeleteLoading &&
                      productType === "EXTRA" &&
                      deleteImageId === image.id ? (
                        <Loader2
                          size={16}
                          className="animate-spin text-white"
                        />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    </Modal>
  );
}
