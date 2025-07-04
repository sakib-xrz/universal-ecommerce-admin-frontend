import Label from "@/components/shared/label";
import useDesktop from "@/hooks/use-desktop";
import { discountOptions } from "@/utils/constant";
import { Button, Input, Select } from "antd";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

export default function ProductSearchFilter({
  params,
  setParams,
  searchKey,
  handleSearchChange,
  categoryData,
  data,
}) {
  const isDesktop = useDesktop();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  return (
    <div className="space-y-3">
      <div className="relative flex items-end gap-2">
        <div className="w-full space-y-2">
          <Label htmlFor="search">Search product</Label>
          <Input
            name="search"
            type="search"
            placeholder="Search product by name, sku or category"
            onChange={handleSearchChange}
            value={searchKey}
            allowClear
          />
        </div>
        <div>
          <Button
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            icon={
              isFilterVisible ? (
                <X className="size-5 text-primary" />
              ) : (
                <SlidersHorizontal className="size-5 text-primary" />
              )
            }
          >
            {isDesktop && (isFilterVisible ? "Close" : "Filter")}
          </Button>

          {isFilterVisible && (
            <div className="absolute left-0 top-20 z-10 w-full space-y-3 rounded border bg-white p-4 shadow">
              <div className="flex items-center gap-4 max-lg:flex-col">
                <div className="flex w-full flex-col gap-2">
                  <Label htmlFor="category_id">Select Category</Label>
                  <Select
                    name="category_id"
                    value={params.category_id}
                    onChange={(value) =>
                      setParams({ ...params, category_id: value })
                    }
                    options={
                      categoryData?.data?.map((category) => ({
                        label: category.name,
                        value: category.id,
                      })) || []
                    }
                    placeholder="Filter by category"
                    optionFilterProp="label"
                    allowClear
                    showSearch
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Label htmlFor="discount_type">Discount Type</Label>
                  <Select
                    name="discount_type"
                    value={params.discount_type}
                    onChange={(value) =>
                      setParams({ ...params, discount_type: value })
                    }
                    options={discountOptions}
                    placeholder="Filter by discount type"
                    allowClear
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Label htmlFor="is_published">Published Status</Label>
                  <Select
                    name="is_published"
                    value={params.is_published}
                    onChange={(value) =>
                      setParams({ ...params, is_published: value })
                    }
                    options={[
                      { label: "Published", value: "true" },
                      { label: "Unpublished", value: "false" },
                    ]}
                    placeholder="Filter by published status"
                    allowClear
                  />
                </div>
                {/* <div className="flex w-full flex-col gap-2">
                  <Label htmlFor="is_featured">Featured Status</Label>
                  <Select
                    name="is_featured"
                    value={params.is_featured}
                    onChange={(value) =>
                      setParams({ ...params, is_featured: value })
                    }
                    options={[
                      { label: "Featured", value: "true" },
                      { label: "Not Featured", value: "false" },
                    ]}
                    placeholder="Filter by featured status"
                    allowClear
                  />
                </div> */}
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-500">
        Showing{" "}
        {data?.data?.length > 0
          ? `${params.limit * (params.page - 1) + 1} to ${
              params.limit * params.page > data?.meta?.total
                ? data?.meta?.total
                : params.limit * params.page
            } of ${data?.meta?.total} entries`
          : "No data found"}
      </p>
    </div>
  );
}
