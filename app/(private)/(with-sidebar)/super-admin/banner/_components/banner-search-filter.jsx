"use client";

import { Input, Select } from "antd";
import { Search } from "lucide-react";

const statusOptions = [
  { label: "All Status", value: null },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

export default function BannerSearchFilter({
  params,
  setParams,
  searchKey,
  handleSearchChange,
  data,
}) {
  return (
    <div className="space-y-4 rounded-md bg-white p-4 shadow">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Input
            placeholder="Search banners..."
            prefix={<Search size={16} />}
            value={searchKey}
            onChange={handleSearchChange}
            allowClear
          />
        </div>

        <div>
          <Select
            placeholder="Filter by status"
            options={statusOptions}
            value={params.status}
            onChange={(value) =>
              setParams((prev) => ({ ...prev, status: value, page: 1 }))
            }
            className="w-full"
            allowClear
          />
        </div>

        <div>
          <Select
            placeholder="Sort by"
            value={`${params.sort_by}_${params.sort_order}`}
            onChange={(value) => {
              const [sort_by, sort_order] = value.split("_");
              setParams((prev) => ({ ...prev, sort_by, sort_order, page: 1 }));
            }}
            className="w-full"
            options={[
              { label: "Latest First", value: "created_at_desc" },
              { label: "Oldest First", value: "created_at_asc" },
              { label: "Title A-Z", value: "title_asc" },
              { label: "Title Z-A", value: "title_desc" },
            ]}
          />
        </div>

        <div>
          <Select
            placeholder="Items per page"
            value={params.limit}
            onChange={(value) =>
              setParams((prev) => ({ ...prev, limit: value, page: 1 }))
            }
            className="w-full"
            options={[
              { label: "10 per page", value: 10 },
              { label: "20 per page", value: 20 },
              { label: "50 per page", value: 50 },
              { label: "100 per page", value: 100 },
            ]}
          />
        </div>
      </div>

      {data?.meta && (
        <div className="text-sm text-gray-600">
          Showing {(data.meta.page - 1) * data.meta.limit + 1} to{" "}
          {Math.min(data.meta.page * data.meta.limit, data.meta.total)} of{" "}
          {data.meta.total} banners
        </div>
      )}
    </div>
  );
}
