"use client";

import TitleWithButton from "@/components/shared/title-with-button";
import {
  useDeleteFeaturedCategoryMutation,
  useGetFeaturedCategoriesQuery,
  useToggleFeaturedCategoryStatusMutation,
  useSortFeaturedCategoriesMutation,
} from "@/redux/api/featuredCategoryApi";
import { Breadcrumb, Table, Modal, Button, Switch, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useContext } from "react";
import { toast } from "sonner";
import EditFeaturedCategoryModal from "./_components/edit-featured-category-modal";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import DraggableRow, { DragHandleContext } from "./_components/draggable-row";

const items = [
  {
    title: <Link href="/super-admin/dashboard">Dashboard</Link>,
  },
  {
    title: "Featured Category",
  },
];

// Drag Handle Component
const DragHandle = () => {
  const dragHandlers = useContext(DragHandleContext);

  return (
    <div
      className="flex cursor-grab justify-center active:cursor-grabbing"
      {...dragHandlers}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 3C6 2.44772 5.55228 2 5 2C4.44772 2 4 2.44772 4 3C4 3.55228 4.44772 4 5 4C5.55228 4 6 3.55228 6 3Z"
          fill="#9CA3AF"
        />
        <path
          d="M12 3C12 2.44772 11.5523 2 11 2C10.4477 2 10 2.44772 10 3C10 3.55228 10.4477 4 11 4C11.5523 4 12 3.55228 12 3Z"
          fill="#9CA3AF"
        />
        <path
          d="M6 8C6 7.44772 5.55228 7 5 7C4.44772 7 4 7.44772 4 8C4 8.55228 4.44772 9 5 9C5.55228 9 6 8.55228 6 8Z"
          fill="#9CA3AF"
        />
        <path
          d="M12 8C12 7.44772 11.5523 7 11 7C10.4477 7 10 7.44772 10 8C10 8.55228 10.4477 9 11 9C11.5523 9 12 8.55228 12 8Z"
          fill="#9CA3AF"
        />
        <path
          d="M6 13C6 12.4477 5.55228 12 5 12C4.44772 12 4 12.4477 4 13C4 13.5523 4.44772 14 5 14C5.55228 14 6 13.5523 6 13Z"
          fill="#9CA3AF"
        />
        <path
          d="M12 13C12 12.4477 11.5523 12 11 12C10.4477 12 10 12.4477 10 13C10 13.5523 10.4477 14 11 14C11.5523 14 12 13.5523 12 13Z"
          fill="#9CA3AF"
        />
      </svg>
    </div>
  );
};

export default function FeaturedCategory() {
  const { data, isLoading } = useGetFeaturedCategoriesQuery();
  const [deleteFeaturedCategory, { isLoading: isDeleteLoading }] =
    useDeleteFeaturedCategoryMutation();
  const [toggleFeaturedCategoryStatus, { isLoading: isToggleLoading }] =
    useToggleFeaturedCategoryStatusMutation();
  const [sortFeaturedCategories, { isLoading: isSortLoading }] =
    useSortFeaturedCategoriesMutation();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editableItem, setEditableItem] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  // Sort data by sort_order for consistent display
  const sortedData = useMemo(() => {
    if (!data?.data) return [];
    return [...data.data].sort(
      (a, b) => (a.sort_order || 0) - (b.sort_order || 0),
    );
  }, [data?.data]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sortedData.findIndex((item) => item.id === active.id);
      const newIndex = sortedData.findIndex((item) => item.id === over.id);

      const newData = arrayMove(sortedData, oldIndex, newIndex);
      const sortedIds = newData.map((item) => item.id);

      try {
        await sortFeaturedCategories(sortedIds).unwrap();
        message.success("Featured categories sorted successfully");
      } catch (error) {
        console.error("Sort error:", error);
        message.error("Failed to sort featured categories");
      }
    }
  };

  const columns = [
    {
      title: "Drag",
      key: "drag",
      width: 60,
      render: () => <DragHandle />,
    },
    {
      title: "Serial",
      key: "sort_order",
      render: (_text, record) => (
        <div className="text-center font-medium">{record.sort_order}</div>
      ),
      width: 150,
      align: "center",
    },
    {
      title: "Title",
      key: "title",
      render: (_text, record) => (
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className="font-medium max-lg:line-clamp-1">
                {record.title}
              </h3>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      key: "category",
      render: (_text, record) => (
        <div className="flex items-center space-x-2">
          <Image
            src={record.category?.image}
            alt={record.category?.name}
            width={40}
            height={40}
            className="h-8 w-8 rounded object-cover"
            placeholder="blur"
            blurDataURL={record.category?.image}
          />
          <div>
            <p className="font-medium">{record.category?.name}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Banner",
      key: "banner_url",
      render: (_text, record) => (
        <div className="flex justify-center text-center">
          {record.banner_url ? (
            <Image
              src={record.banner_url}
              alt={record.title}
              width={120}
              height={72}
              className="h-12 w-auto rounded object-cover lg:h-10"
              placeholder="blur"
              blurDataURL={record.banner_url}
            />
          ) : (
            <span className="text-gray-400">No Banner</span>
          )}
        </div>
      ),
      align: "center",
    },
    {
      title: "YouTube Video",
      key: "youtube_video_link",
      render: (_text, record) => (
        <div className="text-center">
          {record.youtube_video_link ? (
            <a
              href={record.youtube_video_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Video
            </a>
          ) : (
            <span className="text-gray-400">No Video</span>
          )}
        </div>
      ),
      align: "center",
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
              setSelectedId(record.id);
              try {
                await toggleFeaturedCategoryStatus(record.id).unwrap();
                toast.success("Featured category status changed successfully");
              } catch (error) {
                console.log(error);
                toast.error(
                  error.message || "Failed to change featured category status",
                );
              } finally {
                setSelectedId(null);
              }
            }}
            loading={isToggleLoading && selectedId === record.id}
          />
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_text, record) => (
        <div className="flex justify-center space-x-4">
          <p
            className="cursor-pointer text-info hover:underline"
            onClick={() => {
              setEditableItem(record);
              setOpenEditModal(true);
            }}
          >
            Edit
          </p>
          <p
            className="cursor-pointer text-danger hover:underline"
            onClick={() => {
              setSelectedId(record.id);
              setOpenDeleteModal(true);
            }}
          >
            Delete
          </p>
        </div>
      ),
      align: "center",
    },
  ];

  const handleDelete = async () => {
    try {
      await deleteFeaturedCategory(selectedId).unwrap();
      setOpenDeleteModal(false);
      toast.success("Featured category deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete featured category");
    } finally {
      setSelectedId(null);
    }
  };

  return (
    <div className="space-y-5">
      <Breadcrumb items={items} />
      <div className="space-y-5">
        <TitleWithButton
          title="Featured Categories"
          buttonText="Add Featured Category"
          href="/super-admin/featured-category/add"
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        >
          <SortableContext
            items={sortedData.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              bordered
              dataSource={sortedData}
              columns={columns}
              loading={isLoading || isSortLoading}
              pagination={false}
              scroll={{
                x: "max-content",
              }}
              rowKey="id"
              components={{
                body: {
                  row: DraggableRow,
                },
              }}
            />
          </SortableContext>
        </DndContext>

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
                  setSelectedId(null);
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
          This action cannot be undone. This featured category will be
          permanently deleted from our servers.
        </Modal>

        {editableItem && (
          <EditFeaturedCategoryModal
            open={openEditModal}
            setOpen={setOpenEditModal}
            data={editableItem}
            setData={setEditableItem}
          />
        )}
      </div>
    </div>
  );
}
