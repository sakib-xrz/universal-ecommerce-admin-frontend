"use client";

import FormInput from "@/components/form/form-input";
import FormikErrorBox from "@/components/shared/formik-error-box";
import Label from "@/components/shared/label";
import { useCreateUserMutation } from "@/redux/api/userApi";
import { userRoleOptions } from "@/utils/constant";
import { Button, Modal, Select } from "antd";
import { useFormik } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";

export default function CreateUser({ open, setOpen }) {
  const [createUser, { isLoading }] = useCreateUserMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: null,
      phone: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
      role: Yup.string().required("Role is required"),
      phone: Yup.string()
        .matches(/^(\+88)?(01[3-9]\d{8})$/, "Invalid phone number")
        .required("Phone number is required"),
    }),
    onSubmit: async (values) => {
      const payload = {
        ...values,
        phone: values.phone.startsWith("+88")
          ? values.phone
          : `+88${values.phone}`,
      };

      try {
        await createUser(payload).unwrap();
        setOpen(false);
        formik.resetForm();
        toast.success("User created successfully");
      } catch (error) {
        console.error(error);
        toast.error(error?.message || "Failed to create user");
      }
    },
  });
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <Modal
        open={open}
        title={`Create New User`}
        icon={<></>}
        closable={false}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              disabled={isLoading}
              htmlType="button"
              onClick={() => {
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
              Create User
            </Button>
          </div>
        }
        centered
        destroyOnClose
      >
        <div className="space-y-2">
          <FormInput
            label="Name"
            name="name"
            placeholder="Enter name"
            formik={formik}
            required
          />
          <FormInput
            label="Email"
            name="email"
            placeholder="Enter email"
            formik={formik}
            required
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password"
            formik={formik}
            required
          />
          <div className="flex flex-col gap-1">
            <Label htmlFor="role" className={"py-1"} required>
              Role
            </Label>
            <Select
              className="!mt-0.5 !w-full"
              name="role"
              options={userRoleOptions}
              placeholder="Select role"
              onChange={(value) => {
                {
                  formik.setFieldValue("role", value);
                }
              }}
            />
            <FormikErrorBox formik={formik} name="role" />
          </div>
          <FormInput
            label="Phone"
            name="phone"
            placeholder="Enter phone"
            formik={formik}
            required
          />
        </div>
      </Modal>
    </form>
  );
}
