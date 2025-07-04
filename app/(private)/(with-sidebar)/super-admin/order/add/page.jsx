"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import { useDebouncedCallback } from "use-debounce";
import { Breadcrumb, Button, Input, Radio, Select } from "antd";
import { X } from "lucide-react";

import Title from "@/components/shared/title";
import Label from "@/components/shared/label";
import FormInput from "@/components/form/form-input";

import { useGetProductListQuery } from "@/redux/api/productApi";
import { useGetCustomerListQuery } from "@/redux/api/userApi";
import { sanitizeParams } from "@/utils";
import { paymentMethodOptions, platformOptions } from "@/utils/constant";
import { useCreateOrderMutation } from "@/redux/api/orderApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const breadcrumbItems = [
  {
    title: <Link href="/super-admin/dashboard">Dashboard</Link>,
  },
  {
    title: <Link href="/super-admin/order">Order</Link>,
  },
  {
    title: "Create Order",
  },
];

export default function CreateOrder() {
  const router = useRouter();

  // State for managing search and options
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerOptions, setCustomerOptions] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productOptions, setProductOptions] = useState([]);

  // Debounced callbacks for search inputs
  const debouncedCustomerSearch = useDebouncedCallback((value) => {
    setCustomerSearch(value);
  }, 400);

  const debouncedProductSearch = useDebouncedCallback((value) => {
    setProductSearch(value);
  }, 400);

  // Fetch data from APIs
  const { data: customerData, isLoading: isCustomerListLoading } =
    useGetCustomerListQuery(sanitizeParams({ search: customerSearch }));

  const { data: productData, isLoading: isProductListLoading } =
    useGetProductListQuery(
      sanitizeParams({ search: productSearch, is_published: true }),
    );

  const [createOrder, { isLoading: isCreateOrderLoading }] =
    useCreateOrderMutation();

  // Update customer options when data changes
  useEffect(() => {
    if (customerData?.data) {
      setCustomerOptions(
        customerData.data.map((user) => ({
          label: (
            <div>
              <h6 className="font-semibold">{user?.profile?.name}</h6>
              <p className="text-sm font-light">{user?.profile?.phone}</p>
            </div>
          ),
          value: user.id,
        })),
      );
    }
  }, [customerData]);

  // Update product options when data changes
  useEffect(() => {
    if (productData?.data) {
      setProductOptions(
        productData.data.map((product) => ({
          label: <div>{`${product.name} (${product.sku})`}</div>,
          value: product.id,
          product: product,
        })),
      );
    }
  }, [productData]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      user_id: null,
      customer_name: "",
      email: "",
      phone: "",
      is_inside_dhaka: true,
      address_line: "",
      note: "",
      product: [],
      platform: "WEBSITE",
      payment_method: "CASH_ON_DELIVERY",
      reference_link: "",
    },
    onSubmit: async (values) => {
      const payload = {
        ...values,
        product: values.product.map((product) => ({
          product_id: product.id,
          variant_id:
            product.variants.find(
              (variant) => variant?.size_id === product?.size_id,
            )?.id || product.variants[0]?.id,
          size_id: product.size_id || null,
          quantity: product.quantity,
        })),
      };

      try {
        await createOrder(payload).unwrap();
        toast.success("Order created successfully");
        router.push("/super-admin/order");
      } catch (error) {
        console.log(error);
        toast.error(
          error?.errorMessages && error.errorMessages.length > 0
            ? error.errorMessages[0]?.message
            : error.message || "Something went wrong!!!",
        );
      }
    },
  });

  // Selected products
  const selectedProducts = formik.values.product;

  return (
    <div className="space-y-5 xl:mx-auto xl:max-w-5xl">
      <Breadcrumb items={breadcrumbItems} />
      <div className="space-y-3 sm:rounded-md sm:bg-white sm:p-6 sm:shadow lg:p-8">
        <Title title="Create Order" />
        <form onSubmit={formik.handleSubmit} className="space-y-2">
          <div className="grid grid-cols-1 gap-10">
            {/* Customer Selection */}
            <div className="space-y-2">
              <Title title="Customer" className={"text-left text-xl"} />
              <div className="flex w-full flex-col gap-1">
                <Label htmlFor="user_id" className="py-1">
                  Select Customer
                </Label>
                <Select
                  allowClear
                  showSearch
                  name="user_id"
                  className="!mt-0.5 !w-full"
                  options={customerOptions}
                  placeholder="Search customer by phone number"
                  loading={isCustomerListLoading}
                  filterOption={false}
                  labelInValue
                  onSearch={(value) => debouncedCustomerSearch(value)}
                  onChange={(selectedOption) => {
                    const selectedCustomer = customerData?.data?.find(
                      (user) => user.id === selectedOption?.value,
                    );
                    formik.setFieldValue(
                      "user_id",
                      selectedOption?.value || null,
                    );
                    formik.setFieldValue(
                      "customer_name",
                      selectedCustomer?.profile?.name || "",
                    );
                    formik.setFieldValue(
                      "email",
                      selectedCustomer?.profile?.email || "",
                    );
                    formik.setFieldValue(
                      "phone",
                      selectedCustomer?.profile?.phone || "",
                    );
                  }}
                  value={
                    formik.values.user_id
                      ? {
                          value: formik.values.user_id,
                          label: `${formik.values.customer_name} (${formik.values.phone})`,
                        }
                      : undefined
                  }
                  onClear={() => {
                    setCustomerSearch("");
                    formik.setFieldValue("user_id", null);
                    formik.setFieldValue("customer_name", "");
                    formik.setFieldValue("email", "");
                    formik.setFieldValue("phone", "");
                  }}
                />
              </div>

              <div className="space-y-2">
                <FormInput
                  formik={formik}
                  name="customer_name"
                  label="Name"
                  disabled={formik.values.user_id}
                  required
                  placeholder="Enter customer name"
                  {...formik.getFieldProps("customer_name")}
                />
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <FormInput
                    formik={formik}
                    name="email"
                    label="Email"
                    type="email"
                    disabled={formik.values.user_id}
                    required
                    placeholder="Enter customer email"
                    {...formik.getFieldProps("email")}
                  />
                  <FormInput
                    formik={formik}
                    name="phone"
                    label="Phone"
                    type="tel"
                    disabled={formik.values.user_id}
                    required
                    placeholder="Enter customer phone"
                    {...formik.getFieldProps("phone")}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="address_line" className={"py-1"} required>
                    Delivery Address
                  </Label>
                  <Input.TextArea
                    name="address_line"
                    placeholder="Enter delivery address"
                    {...formik.getFieldProps("address_line")}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="note" className={"py-1"}>
                    Note <span className="text-gray-500">(Optional)</span>
                  </Label>
                  <Input.TextArea
                    name="note"
                    placeholder="Enter note"
                    {...formik.getFieldProps("note")}
                  />
                </div>

                <div className="flex w-full flex-col gap-1">
                  <Label htmlFor="note" className={"py-1"} required>
                    Delivery Location
                  </Label>
                  <Radio.Group
                    name="is_inside_dhaka"
                    size="small"
                    onChange={(e) => {
                      formik.setFieldValue("is_inside_dhaka", e.target.value);
                    }}
                    value={formik.values.is_inside_dhaka}
                  >
                    <Radio value={true}>Inside Dhaka</Radio>
                    <Radio value={false}>Outside Dhaka</Radio>
                  </Radio.Group>
                </div>
              </div>
            </div>

            {/* Product Selection */}
            <div className="space-y-2">
              <Title title="Products" className={"text-left text-xl"} />
              <div className="flex w-full flex-col gap-1">
                <Label htmlFor="product" className="py-1">
                  Select Product
                </Label>
                <Select
                  allowClear
                  showSearch
                  name="product"
                  className="!mt-0.5 !w-full"
                  options={productOptions}
                  placeholder="Search product by name or SKU"
                  loading={isProductListLoading}
                  filterOption={false}
                  labelInValue
                  onSearch={(value) => debouncedProductSearch(value)}
                  onChange={(selectedOption, options) => {
                    if (selectedOption) {
                      const product = options?.product;
                      formik.setFieldValue("product", [
                        ...formik.values.product,
                        product,
                      ]);
                    }
                  }}
                  onClear={() => setProductSearch("")}
                />
              </div>
              {selectedProducts.length > 0 && (
                <div className="!mt-5 space-y-4">
                  {selectedProducts.map((product, index) => {
                    const hasVariants =
                      product?.variants?.length > 1 &&
                      product?.variants[0]?.size_id !== null;

                    const stock = product?.variants?.reduce(
                      (acc, variant) => acc + variant?.stock,
                      0,
                    );
                    return (
                      <div
                        key={product.id}
                        className="flex flex-col rounded-md border p-4 shadow"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h6 className="text-sm font-semibold">
                            {index + 1}. {`${product.name} (${product.sku})`}
                          </h6>
                          <button
                            type="button"
                            onClick={() => {
                              formik.setFieldValue(
                                "product",
                                formik.values.product.filter(
                                  (_product, i) => i !== index,
                                ),
                              );
                            }}
                            className="p-.5 rounded-md border bg-gray-50 text-danger"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        <div className="flex gap-2 max-sm:flex-col sm:items-center">
                          <div className="flex w-full flex-col gap-1">
                            <Label
                              className="text-sm font-medium"
                              required={hasVariants}
                            >
                              Size
                            </Label>
                            <Select
                              size="small"
                              allowClear
                              showSearch
                              name={`product[${index}].size_id`}
                              className="!mt-0.5 !w-full"
                              options={product?.variants?.map((variant) => ({
                                label: (
                                  <div>
                                    {variant?.size} ({variant?.stock})
                                  </div>
                                ),
                                value: variant?.size_id,
                              }))}
                              placeholder={
                                hasVariants
                                  ? "Select size"
                                  : `No size available (${stock})`
                              }
                              filterOption={false}
                              labelInValue
                              onChange={(selectedOption) => {
                                formik.setFieldValue(
                                  `product[${index}].size_id`,
                                  selectedOption?.value || null,
                                );
                              }}
                              disabled={hasVariants ? false : true}
                            />
                          </div>
                          <div className="w-full">
                            <FormInput
                              size="small"
                              formik={formik}
                              name={`product[${index}].quantity`}
                              label="Quantity"
                              type="number"
                              min={1}
                              required
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order Details */}
            <div className="space-y-2">
              <Title title="Order Details" className={"text-left text-xl"} />
              <div className="flex gap-2">
                <div className="flex w-full flex-col gap-1">
                  <Label htmlFor="platform" className="py-1" required>
                    Platform
                  </Label>
                  <Select
                    name="platform"
                    className="!mt-0.5 !w-full"
                    options={platformOptions}
                    placeholder="Select platform"
                    onChange={(selectedOption) => {
                      formik.setFieldValue("platform", selectedOption);
                    }}
                    value={formik.values.platform}
                  />
                </div>
                <div className="flex w-full flex-col gap-1">
                  <Label htmlFor="payment_method" className="py-1" required>
                    Payment Method
                  </Label>
                  <Select
                    name="payment_method"
                    className="!mt-0.5 !w-full"
                    options={paymentMethodOptions}
                    placeholder="Select payment method"
                    onChange={(selectedOption) => {
                      formik.setFieldValue("payment_method", selectedOption);
                    }}
                    value={formik.values.payment_method}
                  />
                </div>
              </div>
              <FormInput
                formik={formik}
                name="reference_link"
                label="Reference Link"
                placeholder="Enter reference link"
                {...formik.getFieldProps("reference_link")}
              />
            </div>
          </div>

          <div>
            <div className="mt-5 flex items-center gap-2">
              <Link
                href="/super-admin/order"
                className="w-full"
                disabled={isCreateOrderLoading}
              >
                <Button className="w-full" disabled={isCreateOrderLoading}>
                  Cancel
                </Button>
              </Link>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={isCreateOrderLoading}
              >
                Create Order
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
