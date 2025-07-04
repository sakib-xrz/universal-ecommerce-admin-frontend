import Label from "@/components/shared/label";
import useDesktop from "@/hooks/use-desktop";
import { userRoleOptions, userStatusOptions } from "@/utils/constant";
import { Button, Input, Select } from "antd";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

export default function UserSearchFilter({
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
          <Label htmlFor="search">Search user</Label>
          <Input
            name="search"
            type="search"
            placeholder="Search user by name, email or phone"
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
                  <Label htmlFor="role">Select Role</Label>
                  <Select
                    name="role"
                    value={params.role}
                    onChange={(value) => setParams({ ...params, role: value })}
                    options={userRoleOptions}
                    placeholder="Filter by role"
                    allowClear
                  />
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Label htmlFor="status">Select Status</Label>
                  <Select
                    name="status"
                    value={params.status}
                    onChange={(value) =>
                      setParams({ ...params, status: value })
                    }
                    options={userStatusOptions}
                    placeholder="Filter by status"
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
