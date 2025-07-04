"use client";

import * as Yup from "yup";

import { useFormik } from "formik";
import { Button, Card } from "antd";
import Container from "@/components/shared/container";
import FormInput from "@/components/form/form-input";

import userLogin from "@/utils/userLogin";
import { useState } from "react";
import { toast } from "sonner";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const loginSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "superadmin@ecommerce.com",
      password: "123456",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);

      try {
        await userLogin(values);
        toast.success("Logged in successfully");
      } catch (error) {
        formik.resetForm();
        toast.error(error.message || "Failed to login");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container className="py-0 lg:py-0">
      <div className="flex h-svh items-center justify-evenly gap-5 text-base">
        <div className="w-full xs:w-8/12 lg:w-5/12">
          <Card className="w-full">
            <p className="pb-3 text-2xl font-semibold">
              {`LET'Z GEAR ADMIN LOGIN`}
            </p>
            <form className="space-y-1" onSubmit={formik.handleSubmit}>
              <div className="space-y-2">
                <FormInput
                  label="Email"
                  name="email"
                  placeholder="Enter your email"
                  formik={formik}
                  required
                />

                <div>
                  <FormInput
                    label="Password"
                    name="password"
                    placeholder="Enter your password"
                    type="password"
                    formik={formik}
                    required
                  />
                </div>
              </div>
              <div>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  className="mt-2"
                >
                  Sign in
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </Container>
  );
}
