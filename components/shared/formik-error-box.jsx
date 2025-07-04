import { cn } from "@/utils/cn";

export default function FormikErrorBox({ formik, name, className }) {
  const showError = formik.errors[name] && formik.touched[name];
  const defaultClassNames = "text-sm text-danger font-bold";
  const errorMessage = formik.errors[name];
  return showError ? (
    <div>
      <div className={cn(defaultClassNames, className)}>{errorMessage}</div>
    </div>
  ) : null;
}
