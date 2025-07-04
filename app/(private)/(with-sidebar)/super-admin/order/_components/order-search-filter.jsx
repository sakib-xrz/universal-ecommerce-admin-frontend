import Label from "@/components/shared/label";
import useDesktop from "@/hooks/use-desktop";
import {
  orderStatusOptions,
  paymentStatusOptions,
  platformOptions,
} from "@/utils/constant";
import { Button, Input, Select } from "antd";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

export default function OderSearchFilter({
  params,
  setParams,
  searchKey,
  handleSearchChange,
  data,
}) {
  const isDesktop = useDesktop();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  return (
    <div className="space-y-3">
      <div className="relative flex items-end gap-2">
        <div className="w-full space-y-2">
          <Label htmlFor="search">Search order</Label>
          <Input
            name="search"
            type="search"
            placeholder="Search order by order id, customer name, email or phone"
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
                  <Label htmlFor="status">Select Order Status</Label>
                  <Select
                    name="status"
                    value={params.status}
                    onChange={(value) =>
                      setParams({ ...params, status: value })
                    }
                    options={orderStatusOptions}
                    placeholder="Filter by published status"
                    allowClear
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Label htmlFor="payment_status">Select Payment Status</Label>
                  <Select
                    name="payment_status"
                    value={params.payment_status}
                    onChange={(value) =>
                      setParams({ ...params, payment_status: value })
                    }
                    options={paymentStatusOptions}
                    placeholder="Filter by payment status"
                    allowClear
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Label htmlFor="is_inside_dhaka">
                    Select Inside or Outside Dhaka
                  </Label>
                  <Select
                    name="is_inside_dhaka"
                    value={params.is_inside_dhaka}
                    onChange={(value) =>
                      setParams({ ...params, is_inside_dhaka: value })
                    }
                    options={[
                      { key: "1", label: "Inside Dhaka", value: "true" },
                      { key: "2", label: "Outside Dhaka", value: "false" },
                    ]}
                    placeholder="Filter by payment status"
                    allowClear
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Label htmlFor="platform">Select Platform Type</Label>
                  <Select
                    name="platform"
                    value={params.platform}
                    onChange={(value) =>
                      setParams({ ...params, platform: value })
                    }
                    options={platformOptions}
                    placeholder="Filter by platform"
                    allowClear
                  />
                </div>
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
