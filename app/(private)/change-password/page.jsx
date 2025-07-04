"use client";

import * as Yup from "yup";
import { Button, Modal, Result } from "antd";
import FormInput from "@/components/form/form-input";
import { useFormik } from "formik";
import { useState } from "react";
import { useChangePasswordMutation } from "@/redux/api/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/utils/auth";
import { getUserRoleForRoute } from "@/utils/constant";

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  const user = getUserInfo();
  const role = getUserRoleForRoute(user);

  const [changePassword] = useChangePasswordMutation();

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      retypeNewPassword: "",
    },

    // check if the old password and new password are not the same
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old password is required"),
      newPassword: Yup.string()
        .required("New password is required")
        .min(6, "Password must be at least 6 characters")
        .notOneOf(
          [Yup.ref("oldPassword"), null],
          "New password must be different from old password",
        ),
      retypeNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Retype new password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      const payload = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };

      try {
        await changePassword(payload).unwrap();
        setOpenModal(true);
      } catch (error) {
        toast.error(error.message || "Failed to change password");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex min-h-[calc(100vh-3.1rem)] justify-center sm:min-h-[calc(100vh-4.1rem)] lg:items-center">
      <div className="!h-fit rounded-md border p-6 max-lg:border-0">
        <p className="pb-3 text-2xl font-semibold">Change your password</p>
        <form className="space-y-5" onSubmit={formik.handleSubmit}>
          <div className="space-y-2">
            <FormInput
              label="Old Password"
              name="oldPassword"
              placeholder="Enter your old password"
              type="password"
              formik={formik}
              required
            />
            <FormInput
              label="New Password"
              name="newPassword"
              placeholder="Enter your new password"
              type="password"
              formik={formik}
              required
            />
            <FormInput
              label="Retype New Password"
              name="retypeNewPassword"
              placeholder="Retype your new password"
              type="password"
              formik={formik}
              required
            />
          </div>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Change password
          </Button>
        </form>

        <Modal
          centered
          open={openModal}
          closable={false}
          keyboard={false}
          okText={"Logout"}
          maskClosable={false}
          cancelText={"Continue"}
          onOk={() => {
            setOpenModal(false);
            router.push("/logout");
          }}
          onCancel={() => {
            setOpenModal(false);
            router.push(`/${role}/dashboard`);
          }}
        >
          <Result
            status="success"
            title="Password changed successfully"
            subTitle="It's recommended to logout and login again, but you can continue for now."
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: 10,
              paddingBottom: 10,
            }}
          />
        </Modal>
      </div>
    </div>
  );
}
