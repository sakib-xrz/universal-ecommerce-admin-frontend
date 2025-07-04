"use client";

import TitleWithButton from "@/components/shared/title-with-button";
import {
  useDeleteProductMutation,
  useGetProductListQuery,
  useUpdatePublishStatusMutation,
} from "@/redux/api/productApi";
import { generateQueryString, sanitizeParams } from "@/utils";
import {
  Breadcrumb,
  Button,
  Dropdown,
  Modal,
  Pagination,
  Switch,
  Table,
} from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import ProductSearchFilter from "./_components/product-search-filter";
import { Image } from "antd";
import { ChevronDown, PencilLine, Ruler, Trash2 } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";
import ManageImageModal from "./_components/manage-image-modal";
import { useGetCategoriesListQuery } from "@/redux/api/categoryApi";
import ManageStockModal from "./_components/manage-stock-modal";
import defaultProductImage from "@/public/images/default/default_product.jpg";
import { toast } from "sonner";

const breadcrumbItems = [
  {
    title: <Link href="/super-admin/dashboard">Dashboard</Link>,
  },
  {
    title: "Product",
  },
];

// rowSelection objects indicates the need for row selection
// const rowSelection = {
//   onChange: (selectedRowKeys, selectedRows) => {
//     console.log(
//       `selectedRowKeys: ${selectedRowKeys}`,
//       "selectedRows: ",
//       selectedRows,
//     );
//   },
//   onSelect: (record, selected, selectedRows) => {
//     console.log(record, selected, selectedRows);
//   },
//   onSelectAll: (selected, selectedRows, changeRows) => {
//     console.log(selected, selectedRows, changeRows);
//   },
// };

export default function Product() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [openManageImagesModal, setOpenManageImagesModal] = useState(false);
  const [openManageStockModal, setOpenManageStockModal] = useState(false);

  const [searchKey, setSearchKey] = useState(searchParams.get("search") || "");

  const { data: categoryData, isLoading: isCategoryListLoading } =
    useGetCategoriesListQuery();

  const [deleteProduct, { isLoading: isDeleteLoading }] =
    useDeleteProductMutation();

  const [updatePublishStatus, { isLoading: isUpdatePublishStatusLoading }] =
    useUpdatePublishStatusMutation();

  const [params, setParams] = useState({
    id: searchParams.get("id") || null,
    search: searchParams.get("search") || "",
    category_id: searchParams.get("category_id") || null,
    discount_type: searchParams.get("discount_type") || null,
    is_published: searchParams.get("is_published") || null,
    is_featured: searchParams.get("is_featured") || null,
    sort_by: searchParams.get("sort_by") || "created_at",
    sort_order: searchParams.get("sort_order") || "desc",
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });

  const debouncedSearch = useDebouncedCallback((value) => {
    setParams((prev) => ({ ...prev, search: value, page: 1 }));
  }, 400);

  const updateURL = () => {
    const queryString = generateQueryString(params);
    router.push(`/super-admin/product${queryString}`, undefined, {
      shallow: true,
    });
  };

  const debouncedUpdateURL = useDebouncedCallback(updateURL, 500);

  useEffect(() => {
    debouncedUpdateURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchKey(value);
    debouncedSearch(value);
  };

  const handlePaginationChange = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const { id, ...restParams } = params;
  const { data, isLoading } = useGetProductListQuery(
    sanitizeParams(restParams),
  );

  const dataSource = data?.data || [];

  const items = [
    {
      key: "1",
      label: (
        <p
          onClick={() => {
            setParams((prev) => ({ ...prev, id: currentProductId }));
            setOpenManageImagesModal(true);
          }}
          className="flex items-center gap-2 text-sm"
        >
          <ImageIcon size={16} className="text-primary" /> Manage Images
        </p>
      ),
    },
    {
      key: "2",
      label: (
        <p
          onClick={() => {
            setParams((prev) => ({ ...prev, id: currentProductId }));
            setOpenManageStockModal(true);
          }}
          className="flex items-center gap-2 text-sm"
        >
          <Ruler size={16} className="text-primary" /> Manage Stock
        </p>
      ),
    },
    {
      key: "3",
      label: (
        <Link
          href={`/super-admin/product/edit/${currentProductId}`}
          className="flex items-center gap-2 text-sm"
        >
          <PencilLine size={16} className="text-primary" /> Update Product
        </Link>
      ),
    },
    {
      key: "4",
      label: (
        <p
          onClick={() => {
            setOpenDeleteModal(true);
          }}
          className="flex items-center gap-2 text-sm"
        >
          <Trash2 size={16} /> Delete Product
        </p>
      ),
      danger: true,
    },
  ];

  const columns = [
    {
      title: <div className="text-center">Image</div>,
      dataIndex: "id",
      key: "id",
      render: (_text, record) => (
        <div className="flex items-center justify-center">
          <Image.PreviewGroup
            items={
              record.images && record.images.length
                ? [...record.images]
                    .sort((a, b) => {
                      const order = { PRIMARY: 1, SECONDARY: 2, EXTRA: 3 };
                      return (order[a.type] || 4) - (order[b.type] || 4);
                    })
                    .map((image) => image.image_url)
                : [
                    "https://res.cloudinary.com/dl5rlskcv/image/upload/v1735927164/default-product_o9po6f.jpg",
                  ]
            }
          >
            <Image
              src={
                record.images?.find((image) => image.type === "PRIMARY")
                  ?.image_url ||
                "https://res.cloudinary.com/dl5rlskcv/image/upload/v1735927164/default-product_o9po6f.jpg"
              }
              alt={record.name}
              width={50}
              height={50}
            />
          </Image.PreviewGroup>
        </div>
      ),
    },
    {
      title: (
        <div className="text-left">
          <h4>
            Product{" "}
            <small className="font-normal text-gray-500">(SKU ID)</small>
          </h4>
        </div>
      ),
      key: "name",
      render: (_text, record) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <h3 title={record.name} className="line-clamp-1 font-medium">
              {record.name}
            </h3>
            <small className="text-gray-500">({record.sku})</small>
          </div>
        </div>
      ),
      width: 450,
      sorter: true,
    },
    {
      title: "Category",
      key: "category",
      render: (_text, record) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <h3
              title={record.category.name}
              className="font-medium max-lg:line-clamp-1"
            >
              {record.category.name}
            </h3>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="text-center">
          <h4>
            Price{" "}
            <small className="font-normal text-gray-500">
              (<span className="text-rose-600">Buy</span>,{" "}
              <span className="text-orange-600">Cost</span>,{" "}
              <span className="text-blue-600">Sell</span>)
            </small>
          </h4>
        </div>
      ),
      key: "buy_price",
      render: (_text, record) => (
        <>
          <p className="text-center font-medium">
            <span className="text-rose-600">{record.buy_price}</span>,{" "}
            <span className="text-orange-600">{record.cost_price}</span>,{" "}
            <span className="text-gray-500 line-through">
              {record.discount !== 0 ? record.sell_price : null}
            </span>{" "}
            <span className="font-semibold text-blue-600">
              {record.discount !== 0
                ? record.discounted_price
                : record.sell_price}
            </span>
          </p>
          <div className="text-center text-sm font-medium text-green-600">
            {record.discount > 0 &&
              `${record.discount}${record.discount_type === "PERCENTAGE" ? "%" : " BDT"} OFF`}
          </div>
        </>
      ),
      sorter: true,
    },
    {
      title: <div className="text-center">Stock</div>,
      key: "total_stock",
      render: (_text, record) => (
        <div>
          <p
            className={`text-center font-semibold ${record.total_stock === 0 ? "text-danger" : ""}`}
          >
            {record.total_stock}
          </p>
          {record.variants &&
            record.variants.length > 0 &&
            record.variants[0].size && (
              <p className="text-center text-gray-500">
                (
                {record.variants.map((variant, index) => (
                  <span key={index} className="text-xs">
                    {variant.size}={variant.stock}
                    {index < record.variants.length - 1 ? ", " : ""}
                  </span>
                ))}
                )
              </p>
            )}
        </div>
      ),
      width: 250,
      sorter: true,
    },
    {
      title: <div className="text-center">Published</div>,
      key: "is_published",
      render: (_text, record) => (
        <div className="flex justify-center">
          <Switch
            size="small"
            checked={record.is_published}
            onChange={async () => {
              setCurrentProductId(record.id);
              try {
                await updatePublishStatus(record.id).unwrap();
                toast.success("Product status changed successfully");
              } catch (error) {
                toast.error(
                  error.message || "Failed to change category status",
                );
              } finally {
                setCurrentProductId(null);
              }
            }}
            loading={
              isUpdatePublishStatusLoading && currentProductId === record.id
            }
          />
        </div>
      ),
    },
    // {
    //   title: <div className="text-center">Featured</div>,
    //   key: "is_featured",
    //   render: (_text, record) => (
    //     <div className="mx-auto w-10 text-center">
    //       {record.is_featured ? "Yes" : "No"}
    //     </div>
    //   ),
    // },
    {
      title: <div className="text-center">Action</div>,
      key: "action",
      render: (_text, record) => (
        <div
          onClick={() => {
            setCurrentProductId(record.id);
          }}
        >
          <Dropdown menu={{ items }} trigger={["click"]}>
            <p className="flex cursor-pointer items-center justify-center gap-1 text-[#007bff]">
              Actions
              <ChevronDown size={16} />
            </p>
          </Dropdown>
        </div>
      ),
    },
  ];

  const handleTableChange = (_pagination, _filters, sorter) => {
    const { order, columnKey } = sorter;

    setParams((prev) => ({
      ...prev,
      sort_by: columnKey || "created_at",
      sort_order:
        order === "ascend" ? "asc" : order === "descend" ? "desc" : "desc",
    }));
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(currentProductId).unwrap();
      setOpenDeleteModal(false);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  return (
    <div className="space-y-5">
      <Breadcrumb items={breadcrumbItems} />
      <div className="space-y-5">
        <TitleWithButton
          title="Products"
          buttonText="Add Product"
          href="/super-admin/product/add"
        />
      </div>
      <ProductSearchFilter
        params={params}
        setParams={setParams}
        searchKey={searchKey}
        handleSearchChange={handleSearchChange}
        categoryData={categoryData}
        data={data}
      />

      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        loading={isLoading || isCategoryListLoading}
        pagination={false}
        scroll={{
          x: "max-content",
        }}
        // rowSelection={rowSelection}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
      />

      {!isLoading && (
        <Pagination
          current={params.page}
          onChange={handlePaginationChange}
          total={data.meta.total}
          pageSize={params.limit}
          align="center"
          showSizeChanger={true}
          onShowSizeChange={(current, size) =>
            setParams((prev) => ({ ...prev, limit: size, page: current }))
          }
          responsive={true}
        />
      )}

      {openManageImagesModal && (
        <ManageImageModal
          openManageImagesModal={openManageImagesModal}
          setOpenManageImagesModal={setOpenManageImagesModal}
          currentProductId={currentProductId}
          setCurrentProductId={setCurrentProductId}
          params={params}
          setParams={setParams}
        />
      )}

      {openManageStockModal && (
        <ManageStockModal
          openManageStockModal={openManageStockModal}
          setOpenManageStockModal={setOpenManageStockModal}
          currentProductId={currentProductId}
          setCurrentProductId={setCurrentProductId}
          params={params}
          setParams={setParams}
        />
      )}

      <Modal
        open={openDeleteModal}
        title="Are you absolutely sure?"
        icon={<></>}
        closable={false}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              disabled={isDeleteLoading}
              onClick={() => {
                setOpenDeleteModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              loading={isDeleteLoading}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        }
        centered
        destroyOnClose
      >
        This action cannot be undone. This will permanently delete the product
        from the database.
      </Modal>
    </div>
  );
}
